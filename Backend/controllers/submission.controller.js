// Get recent submissions for the logged-in user

import { Problem } from "../models/problem.js";
import Submission from "../models/submission.js";
import { User } from "../models/user.js";
import { getLanguageById } from "../utils/problemId.js";
import { submitBatch } from "../utils/submitBatch.js";
import { submitToken } from "../utils/submitToken.js";
export const submit = async (req, res) => {
  try {
    console.log("result", req.userInfo);
    const userId = req.userInfo.id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);
    if (!user || !problem) {
      return res
        .status(404)
        .json({ success: false, message: "User or Problem not found" });
    }

    // const languageId= getLanguageById(language)
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    const languageId = getLanguageById(language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const judgeResponse = await submitBatch(submissions);
    const tokens = judgeResponse.map((res) => res.token);
    const testResults = await submitToken(tokens);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResults) {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        status = test.status_id === 4 ? "error" : "wrong";
        errorMessage = test.stderr || test.compile_output || "Unknown error";
      }
    }

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.runtime = runtime;
    submittedResult.errorMessage = errorMessage;
    submittedResult.memory = memory;

    await submittedResult.save();

    // If user hasn't already solved this problem, add to solved list
    if (!user.problemSolved.includes(problemId)) {
      user.problemSolved.push(problemId);
      await user.save();
    }
    const accepted = status == "accepted";
    return res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
    });
  } catch (error) {
    console.error("Error in submit controller:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const runcode = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);
    if (!user || !problem) {
      return res
        .status(404)
        .json({ success: false, message: "User or Problem not found" });
    }

    const languageId = getLanguageById(language);
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    const statusMap = {
      1: "In Queue",
      2: "Processing",
      3: "Accepted",
      4: "Wrong Answer",
      5: "Time Limit Exceeded",
      6: "Compilation Error",
      7: "Runtime Error",
      8: "Internal Error",
    };

    for (const test of testResult) {
      test.status_description = statusMap[test.status_id] || "Unknown";

      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        status = false;
        errorMessage =
          test.compile_output || test.stderr || test.message || "Unknown error";
      }
    }

    return res.status(201).json({
      success: status,
      testCases: testResult,
      testCasesPassed,
      totalTestCases: problem.visibleTestCases.length,
      runtime,
      memory,
      errorMessage,
    });
  } catch (error) {
    console.error("Error in run controller:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const getRecentSubmissions = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find the most recent 10 submissions for this user
    const submissions = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get problem titles for each submission
    const submissionsWithTitles = await Promise.all(
      submissions.map(async (submission) => {
        const problem = await Problem.findById(submission.problemId)
          .select("title")
          .lean();
        return {
          ...submission,
          problemTitle: problem ? problem.title : "Unknown Problem",
        };
      })
    );

    return res.status(200).json({
      success: true,
      submissions: submissionsWithTitles,
    });
  } catch (error) {
    console.error("Error in getRecentSubmissions controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

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
    submittedResult.memory = memory;

    await submittedResult.save();

    // If user hasn't already solved this problem, add to solved list
    if (!user.problemSolved.includes(problemId)) {
      user.problemSolved.push(problemId);
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "Submission evaluated",
      submission: submittedResult,
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

    const languageId = getLanguageById(language);

    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const judgeResponse = await submitBatch(submissions);
    const tokens = judgeResponse.map((res) => res.token);
    const testResults = await submitToken(tokens);
    // const testResults = await submitToken(tokens).select('-field1 -field2 -field3'); according to frontend requirement i want to show there

    return res.status(201).json({
      success: true,
      message: "Submission evaluated",
      testResults,
    });
  } catch (error) {
    console.error("Error in submit controller:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

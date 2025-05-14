import { Problem } from "../models/problem.js";
import Submission from "../models/submission.js";
import { getLanguageById } from "../utils/problemId.js";
import { submitBatch } from "../utils/submitBatch.js";
import { submitToken } from "../utils/submitToken.js";
export const submit = async (req, res) => {
  try {
    const userId = result.id;
    const problemId = req.params.id;

    const { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(404).json({
        success: false,
        message: "Missing some fields",
      });
    }

    // db mai sabse pehle store karliya fetch karna honga
    const problem = await Problem.findById(problemId);

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.testCasesTotal,
    });

    // judge zero ko bhejna honga
    // language id fetch

    const languageId = getLanguageById(language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    console.log(submissions);

    const submitResult = await submitBatch(submissions);

    const resultToken = submitResult.map((data) => data.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
          errorMessage = test.stderr;
        }
      }
    }

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.runtime = runtime;
    submittedResult.status = status;
    submittedResult.memory = memory;

    await submitResult.save();

    res.status(201).json(submitResult);
  } catch (error) {
    console.log("Error in submit controller:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

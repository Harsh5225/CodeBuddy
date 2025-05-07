import { Problem } from "../models/problem.js";
import { submitBatch } from "../utils/submitBatch.js";
import { submitToken } from "../utils/submitToken.js";
import { getLanguageById } from "../utils/problemId.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator,
    } = req.body;
    console.log("req.body in createProblem==>", req.body);

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      console.log("languageId", languageId);
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: 71,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      // console.log(submissions);

      const submitResult = await submitBatch(submissions);
      console.log("submitResult==>", submitResult);

      const resultToken = submitResult.map((data) => data.token);
      const testResult = await submitToken(resultToken);
      console.log("testResult==>", testResult);

      for (const data of testResult) {
        const dataStatus = testResult.find(
          (status) => status.id === data.status_id
        ) || {
          description: "Unknown Status",
        };

        if (data.status_id !== 3) {
          return res.status(400).json({ message: dataStatus.description });
        }
      }
    }

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.userInfo._id,
    });

    console.log("userProblem==>", userProblem);
    return res.status(200).json({
      message: "Problem created successfully",
    });
  } catch (error) {
    console.log("Error in createProblem controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//! ISSUE-(8-05)
// fix(judge0): standardize to judge0-ce endpoint and add fallback

// - Switch from judge0-extra-ce to standard judge0-ce endpoint
// - Add C (50) as fallback language when preferred IDs fail
// - Verify language support before submission
// - Improve error logging for debugging

// Resolves language ID errors (54,71 not found)

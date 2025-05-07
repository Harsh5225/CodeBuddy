import { getLanguageById } from "../utils/problemId.js";
import { submitBatch } from "../utils/submitBatch.js";
import { submitToken } from "../utils/submitToken.js";
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
    } = req.body;

    for (const { language, completeCode } of referenceSolution) {
      const langId = getLanguageById(language);

      const submitData = visibleTestCases.map((data) => ({
        source_code: completeCode,
        language_id: langId,
        stdin: data.input,
        expected_output: data.output,
      }));

      const submitResult = await submitBatch(submitData);
      console.log("submitResult==>", submitResult);

      const resultToken = submitResult.map((data) => data.token);
      const testResult = await submitToken(resultToken);
      console.log("testResult==>", testResult);

      for (const data of testResult) {
        const dataStatus = statusDescription.find(
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
      problemCreator: req.user._id,
    });

    console.log("userProblem==>", userProblem);
    return res.status(200).json({
      id: userProblem._id,
      message: "Problem created successfully",
    });
  } catch (error) {
    console.log("Error in createProblem controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

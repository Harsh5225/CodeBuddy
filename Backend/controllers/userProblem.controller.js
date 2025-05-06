import { getLanguageById } from "../utils/problemId";

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

    // format of creating batch submission data

    // const submitData = [
    //     {
    //       "language_id": 46,
    //       "source_code": "echo hello from Bash",
    //       stdin:23,
    //       expected_output:43,
    //     },
    //     {
    //       "language_id": 123456789,
    //       "source_code": "print(\"hello from Python\")"
    //     },
    //     {
    //       "language_id": 72,
    //       "source_code": ""
    //     }
    //   ]

    for (const { language, completeCode } of referenceSolution) {
      const langId = getLanguageById(language);

      const submitData = visibleTestCases.map((input, output) => ({
        source_code: completeCode,
        language_id: langId,
        stdin: input,
        expected_output: output,
      }));

      const submitResult = await submitBatch(submitData);
    }
  } catch (error) {
    console.log("Error in createProblem controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

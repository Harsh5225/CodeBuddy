import { Problem } from "../models/problem.js";
import { submitBatch } from "../utils/submitBatch.js";
import { submitToken } from "../utils/submitToken.js";
import { getLanguageById } from "../utils/problemId.js";
import { User } from "../models/user.js";
import Submission from "../models/submission.js";

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

    // Normalize language case to lowercase
    const normalizedStartCode = startCode.map((item) => ({
      ...item,
      language: item.language.toLowerCase(),
    }));

    const normalizedReferenceSolution = referenceSolution.map((item) => ({
      ...item,
      language: item.language.toLowerCase(),
    }));

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      console.log("languageId", languageId);
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
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
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode: normalizedStartCode,
      referenceSolution: normalizedReferenceSolution,
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

export const updateProblem = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        message: "Missing id field",
      });
    }

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

    // Normalize language case to lowercase
    const normalizedStartCode = startCode.map((item) => ({
      ...item,
      language: item.language.toLowerCase(),
    }));

    const normalizedReferenceSolution = referenceSolution.map((item) => ({
      ...item,
      language: item.language.toLowerCase(),
    }));

    //checks
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      console.log("languageId", languageId);
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
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

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode: normalizedStartCode,
        referenceSolution: normalizedReferenceSolution,
        problemCreator,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    return res.status(200).json({
      message: "Problem updated successfully",
      data: updatedProblem,
    });
  } catch (error) {
    console.log("Error in updating Problem controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID is Missing");

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) return res.status(404).send("Problem is Missing");

    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.log("error in delete controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProblem = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (!id) {
      return res.status(404).json({
        message: "Empty id field",
      });
    }

    const dsaProblem = await Problem.findById(id);
    if (!dsaProblem) return res.status(404).send("Problem is Missing");

    return res.status(200).json({
      dsaProblem,
    });
  } catch (error) {
    console.log("error in getProblem controller", error.message);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const getAllproblem = async (req, res) => {
  try {
    // Parse query params
    const pageIdx = parseInt(req.query.pageNum) || 1;
    const pagelimit = parseInt(req.query.pagecnt) || 10;

    const skip = (pageIdx - 1) * pagelimit;

    // Fetch paginated data
    const dsaProblems = await Problem.find().skip(skip).limit(pagelimit);

    // Get total count for pagination metadata
    const totalProblems = await Problem.countDocuments();

    return res.status(200).json({
      success: true,
      problems: dsaProblems,
      totalProblems,
      currentPage: pageIdx,
      totalPages: Math.ceil(totalProblems / pagelimit),
    });
  } catch (error) {
    console.log("Error in getAllproblem controller:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

// You have a User model where problemSolved is an array of ObjectId references to a Problem model. You want to create an API that fetches all problems solved by a specific user. My approach was to get the IDs from the problemSolved array and manually populate each one.

// !Learning you don’t need to manually loop
// However, instead of manually iterating through each ID, Mongoose allows you to use .populate('problemSolved') to automatically fetch full problem documents in one query even it's in an array.
// It return an array of fully populated problems in the API response.

export const allsolvedProblemByUser = async (req, res) => {
  try {
    console.log("allsolvedProblmes=>>", req.userInfo.id);
    const userId = req.userInfo.id;

    // agar mai problem bhejna chata huu to mujhe iterate har problme ke id mai karna padega aur usko populate karna padega

    // Populate the 'problemSolved' field which contains array of ObjectIds
    // const populatedUser = await User.findById(userId).populate("problemSolved");
    // SELECTED ITEMS
    const populatedUser = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });
    const problems = populatedUser.problemSolved;
    const count = problems.length;
    if (!populatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      count,
      problems,
    });
    return res.status(200).send("debugging");
  } catch (error) {
    console.log("Error in solvedAllproblemByUser controller:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const submittedProblem = async (req, res) => {
  try {
    console.log("result", req.userInfo);
    const userId = req.userInfo._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({ userId, problemId });

    if (ans.length == 0) res.status(200).send("No Submission is persent");

    res.status(200).send(ans);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

//! ISSUE-(8-05)
// fix(judge0): standardize to judge0-ce endpoint and add fallback

// - Switch from judge0-extra-ce to standard judge0-ce endpoint
// - Add C (50) as fallback language when preferred IDs fail
// - Verify language support before submission
// - Improve error logging for debugging

// Resolves language ID errors (54,71 not found)

// populatedUser eg. json

// {
//   "_id": "user123",
//   "username": "rohit",
//   "email": "rohit@example.com",
//   "problemSolved": [
//     {
//       "_id": "prob1",
//       "title": "Two Sum",
//       "difficulty": "Easy"
//     },
//     {
//       "_id": "prob2",
//       "title": "Longest Substring Without Repeating Characters",
//       "difficulty": "Medium"
//     }
//   ],
//   "__v": 0
// }

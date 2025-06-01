import Submission from "../models/submission.js";
import { Problem } from "../models/problem.js";

// Get recent submissions for the logged-in user
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

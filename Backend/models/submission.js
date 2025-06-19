import mongoose, { mongo } from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "c++", "java", "cpp"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "wrong", "error"],
      default: "pending",
    },
    runtime: {
      type: Number, // milliseconds
      default: 0,
    },
    memory: {
      type: Number, // kB
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    testCasesTotal: {
      // Recommended addition
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
submissionSchema.index({ userId: 1, problemId: 1 }); // compound index creation
const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;

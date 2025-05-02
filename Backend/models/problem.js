import mongoose from "mongoose";

const problemSchema = new mongoose.createSchema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  tags: {
    type: String,
    enum: [
      "array",
      "string",
      "linkedlist",
      "tree",
      "stack",
      "queue",
      "hashmap",
      "heap",
      "graph",
      "dp",
      "greedy",
      "backtracking",
      "binarysearch",
      "bitmanipulation",
      "math",
      "recursion, sorting",
      "trie",
      "segmenttree",
      "fenwicktree",
      "matrix,",
      "game theory",
      "geometry",
      "combinatorics",
      "number theory",
    ],
    required: true,
  },
  visibleTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
  ],
  hiddenTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],
  // constraints: {
  //   type: String,
  //   required: true,
  // },
  startCode: [
    {
      language: {
        type: String,
        required: true,
      },
      initialCode: {
        type: String,
        required: true,
      },
    },
  ],
  problemCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Problem = mongoose.model("Problem", problemSchema);

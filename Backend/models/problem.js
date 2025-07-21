import mongoose from "mongoose";
const { Schema } = mongoose;

const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  tags: {
    type: String,
    enum: [
      "string",
      "array",
      "hashmap",
      "hashing",
      "stack",
      "trie",
      "heap",
      "set",
      "dp",
      "sliding window",
      "two pointers",
      "greedy",
      "binary search",
      "backtracking",
      "recursion",
      "string matching",
      "bit manipulation",
      "math",
      "palindrome",
      "anagram",
      "substring",
      "subsequence",
      "pattern matching",
      "regular expressions",
      "lexicographical order",
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

  startCode: [
    {
      language: {
        type: String,
        required: true,
        enum: ["javascript", "c++", "cpp", "java", "python", "c"],
      },
      initialCode: {
        type: String,
        required: true,
      },
    },
  ],

  referenceSolution: [
    {
      language: {
        type: String,
        required: true,
        enum: ["javascript", "c++", "cpp", "java", "python", "c"],
      },
      completeCode: {
        type: String,
        required: true,
      },
    },
  ],

  problemCreator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Problem = mongoose.model("Problem", problemSchema);

// sample data for referenceSolution
// const referenceSolution = [
//   {
//     language: "c++",
//     completeCode: "C++ Code",
//   },
//   {
//     language: "java",
//     completeCode: "java Code",
//   },
//   {
//     language: "js",
//     completeCode: "JS Code",
//   },
// ];

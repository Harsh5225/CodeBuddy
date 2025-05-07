import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const submitBatch = async (submissions) => {
  try {
    // console.log(
    //   "Submitting payload:",
    //   JSON.stringify({ submissions: submitData }, null, 2)
    // );

    // console.log("process=>", process.env.RAPIDAPI_KEY);
    // console.log("process=>host", process.env.RAPIDAPI_HOST);
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        base64_encoded: "false",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST,
        "Content-Type": "application/json",
      },
      data: { submissions },
    };
    const response = await axios.request(options);
    console.log("response in submitBatch==>", response.data);
    return response.data;
  } catch (error) {
    console.log("Error in submitBatch function:", error.response?.data);
    throw new Error("Error in submitBatch function");
  }
};

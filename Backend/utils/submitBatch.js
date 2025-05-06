import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const submitBatch = async (submitData) => {
  try {
    const options = {
      method: "POST",
      url: "https://judge0-extra-ce.p.rapidapi.com/submissions/batch",
      params: {
        base64_encoded: "true",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST,
        "Content-Type": "application/json",
      },
      data: submitData,
    };
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error in submitBatch function:", error.message);
    throw new Error("Error in submitBatch function");
  }
};

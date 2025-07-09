import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const waiting = (timer) => new Promise((resolve) => setTimeout(resolve, timer));

export const submitToken = async (resultToken) => {
  try {
    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        tokens: resultToken.join(","),
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST,
      },
    };

    async function fetchData() {
      try {
        const response = await axios.request(options);
        return response.data;
      } catch (error) {
        console.error("Error while fetching from Judge0:", error.message);
        return null;
      }
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 12;

    while (attempts < MAX_ATTEMPTS) {
      const result = await fetchData();

      if (!result || !result.submissions) {
        console.log(`Attempt ${attempts + 1}: Waiting for Judge0 response...`);
        attempts++;
        await waiting(1000);
        continue;
      }

      const isResultObtained = result.submissions.every(
        (data) => data.status_id > 2
      );

      if (isResultObtained) {
        return result.submissions;
      }

      console.log(`Attempt ${attempts + 1}: Submissions not ready, retrying...`);
      attempts++;
      await waiting(1000);
    }

    // If max attempts exceeded, return partial data (may include compilation errors)
    const lastResult = await fetchData();
    return lastResult?.submissions || [];

  } catch (error) {
    console.log("Error in submitToken function:", error.message);
    throw new Error("Error in submitToken function");
  }
};

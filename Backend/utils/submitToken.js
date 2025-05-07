import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const waiting = async (timer) => {
  setTimeout(() => {
    return 1;
  }, timer);
};
export const submitToken = async (resultToken) => {
  try {
    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        // token structure is like this
        // "dce7bbc5-a8c9-4159-a28f-ac264e48c371,1ed737ca-ee34-454d-a06f-bbc73836473e,9670af73-519f-4136-869c-340086d406db"
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

        console.log("response in submitToken.js", response.data);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }

    while (true) {
      const result = await fetchData();
      const isResultObtained = result.submissions.every(
        (data) => data.status_id > 2
      );
      if (isResultObtained) {
        return result.submissions;
      }

      // Wait for a short period before checking again (e.g., 1 second)
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await waiting(1000);
    }
  } catch (error) {
    console.log("Error in submitToken function:", error.message);
    throw new Error("Error in submitToken function");
  }
};

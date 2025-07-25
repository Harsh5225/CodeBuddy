import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const submissionApi = createApi({
  reducerPath: "submissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl:import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    credentials: "include", // Include credentials for CORS requests  
    // if i dont inclue, it will not give the token in the request
  }),

  endpoints: (builder) => ({
    getSubmissionsByProblemId: builder.query({
      query: (problemId) => `/problem/submittedProblem/${problemId}`,
    }),
  }),
});

export const { useGetSubmissionsByProblemIdQuery } = submissionApi;

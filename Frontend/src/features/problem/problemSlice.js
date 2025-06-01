import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

// Fetch all problems with pagination
export const getAllProblems = createAsyncThunk(
  "problem/getAll",
  async ({ pageNum = 1, pagecnt = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/problem?pageNum=${pageNum}&pagecnt=${pagecnt}`
      );
      {
        console.log("getAllProblems=>>", response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch problems solved by the current user
export const getUserSolvedProblems = createAsyncThunk(
  "problem/getUserSolved",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/problem/userSolvedProblem");
      {
        console.log("getAllProblemsUserSolved=>>", response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const problemSlice = createSlice({
  name: "problem",
  initialState: {
    problems: [],
    solvedProblems: [],
    totalProblems: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    solvedLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getAllProblems
      .addCase(getAllProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload.problems || [];
        state.totalProblems = action.payload.totalProblems || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getAllProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch problems";
      })

      // Handle getUserSolvedProblems
      .addCase(getUserSolvedProblems.pending, (state) => {
        state.solvedLoading = true;
        state.error = null;
      })
      .addCase(getUserSolvedProblems.fulfilled, (state, action) => {
        state.solvedLoading = false;
        state.solvedProblems = action.payload.problems || [];
      })
      .addCase(getUserSolvedProblems.rejected, (state, action) => {
        state.solvedLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch solved problems";
      });
  },
});

export default problemSlice.reducer;

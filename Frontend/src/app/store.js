import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import problemReducer from "../features/problem/problemSlice";
import chartReducer from "../features/chatMessage/ChatSlice";
import { submissionApi } from "../features/submission/submissionApi";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    problem: problemReducer,
    chat: chartReducer,
    [submissionApi.reducerPath]: submissionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(submissionApi.middleware),
});
("// Updated configuration");

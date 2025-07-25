import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentStreak: 0,
  longestStreak: 0,
  totalSolved: 0,
  loading: false,
  error: null,
}

const streakSlice = createSlice({
  name: "streak",
  initialState,
  reducers: {
    setStreakData: (state, action) => {
      state.currentStreak = action.payload.currentStreak
      state.longestStreak = action.payload.longestStreak
      state.totalSolved = action.payload.totalSolved
    },
    setStreakLoading: (state, action) => {
      state.loading = action.payload
    },
    setStreakError: (state, action) => {
      state.error = action.payload
    },
    resetStreakState: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const { setStreakData, setStreakLoading, setStreakError, resetStreakState } = streakSlice.actions

export default streakSlice.reducer

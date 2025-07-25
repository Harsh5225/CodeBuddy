/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import {
  Flame,
  Trophy,
  Target,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  TrendingUp,
  CheckCircle,
  X,
  Crown,
} from "lucide-react";
import {
  setStreakData,
  setStreakError,
  setStreakLoading,
} from "../features/streak/streakSlice";
const DailyStreakCalendar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentStreak, longestStreak, totalSolved, loading } = useSelector(
    (state) => state.streak
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [solvedDates, setSolvedDates] = useState(new Set()); // Keep solvedDates local as it's for calendar rendering

  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isOpen && user) {
      fetchStreakData();
    }
  }, [isOpen, user]);

  const fetchStreakData = async () => {
    try {
      dispatch(setStreakLoading(true)); // Dispatch loading state
      const submissionsResponse = await axiosClient.get("/submission/recent");
      console.log("submission", submissionsResponse);
      const submissions = submissionsResponse.data.submissions || [];

      const solvedResponse = await axiosClient.get(
        "/problem/userSolvedProblem"
      );
      const solvedProblems = solvedResponse.data.problems || [];

      const solvedDatesSet = new Set();
      const acceptedSubmissions = submissions.filter(
        (sub) => sub.status === "accepted"
      );

      acceptedSubmissions.forEach((submission) => {
        const date = new Date(submission.createdAt);
        const dateString = date.toDateString();
        solvedDatesSet.add(dateString);
      });

      setSolvedDates(solvedDatesSet); // Update local solvedDates for calendar rendering

      const calculatedCurrentStreak = calculateCurrentStreak(solvedDatesSet);
      const calculatedLongestStreak = calculateLongestStreak(solvedDatesSet);

      dispatch(
        setStreakData({
          currentStreak: calculatedCurrentStreak,
          longestStreak: calculatedLongestStreak,
          totalSolved: solvedProblems.length,
        })
      ); // Dispatch streak data to Redux
    } catch (error) {
      console.error("Error fetching streak data:", error);
      dispatch(setStreakError(error.message)); // Dispatch error state
    } finally {
      dispatch(setStreakLoading(false)); // Dispatch loading state
    }
  };

  const calculateCurrentStreak = (solvedDatesSet) => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    const todayString = today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (solvedDatesSet.has(todayString)) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (solvedDatesSet.has(yesterdayString)) {
      streak = 1;
      currentDate = new Date(yesterday);
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      return 0;
    }

    while (solvedDatesSet.has(currentDate.toDateString())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const calculateLongestStreak = (solvedDatesSet) => {
    if (solvedDatesSet.size === 0) return 0;

    const sortedDates = Array.from(solvedDatesSet)
      .map((dateString) => new Date(dateString))
      .sort((a, b) => a - b);

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currentDate = sortedDates[i];
      const diffTime = currentDate - prevDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isDateSolved = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return solvedDates.has(date.toDateString());
  };

  const isToday = (day) => {
    const today = new Date();
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.toDateString() === today.toDateString();
  };

  const getStreakLevel = (streak) => {
    if (streak >= 30)
      return {
        level: "Master",
        color: "from-purple-500 to-pink-500",
        icon: Crown,
      };
    if (streak >= 14)
      return {
        level: "Expert",
        color: "from-yellow-500 to-orange-500",
        icon: Trophy,
      };
    if (streak >= 7)
      return {
        level: "Advanced",
        color: "from-blue-500 to-cyan-500",
        icon: Award,
      };
    if (streak >= 3)
      return {
        level: "Intermediate",
        color: "from-green-500 to-emerald-500",
        icon: Target,
      };
    return {
      level: "Beginner",
      color: "from-gray-500 to-gray-600",
      icon: Star,
    };
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!isOpen) return null;

  const streakLevel = getStreakLevel(currentStreak);
  const StreakIcon = streakLevel.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-10">
      <div className="bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-xl rounded-xl border border-gray-600/40 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>

        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Daily Streak Calendar
                </h2>
                <p className="text-gray-400">
                  Track your coding consistency and build habits
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Streak Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    Current Streak
                  </p>
                  <p className="text-3xl font-bold text-orange-400">
                    {currentStreak}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">days</p>
                </div>
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    Longest Streak
                  </p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {longestStreak}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">days</p>
                </div>
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    Total Solved
                  </p>
                  <p className="text-3xl font-bold text-blue-400">
                    {totalSolved}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">problems</p>
                </div>
              </div>
              {/* Streak Level Badge */}
              <div className="mb-8 text-center">
                <div
                  className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${streakLevel.color} rounded-full text-white font-bold text-lg`}
                >
                  <StreakIcon className="w-6 h-6 mr-2" />
                  <span>{streakLevel.level} Coder</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {currentStreak >= 30
                    ? "You're a coding master! 🎉"
                    : currentStreak >= 14
                    ? "Keep up the excellent work! 🔥"
                    : currentStreak >= 7
                    ? "You're on fire! 🚀"
                    : currentStreak >= 3
                    ? "Great progress! 💪"
                    : "Start your streak today! 🌟"}
                </p>
              </div>
              {/* Calendar */}
              <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-300" />
                  </button>

                  <h3 className="text-xl font-bold text-white">
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                  </h3>

                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
                {/* Day Names */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-gray-400 font-medium text-sm py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from(
                    { length: getFirstDayOfMonth(currentDate) },
                    (_, i) => (
                      <div key={`empty-${i}`} className="h-10"></div>
                    )
                  )}

                  {/* Days of the month */}
                  {Array.from(
                    { length: getDaysInMonth(currentDate) },
                    (_, i) => {
                      const day = i + 1;
                      const solved = isDateSolved(day);
                      const today = isToday(day);

                      return (
                        <div
                          key={day}
                          className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                            solved
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                              : today
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300"
                              : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                          }`}
                        >
                          {solved && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                          {!solved && day}
                        </div>
                      );
                    }
                  )}
                </div>
                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                    <span className="text-gray-300">Problem Solved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded"></div>
                    <span className="text-gray-300">Today</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-800/50 rounded"></div>
                    <span className="text-gray-300">No Activity</span>
                  </div>
                </div>
              </div>
              {/* Motivational Message */}
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    Keep Building Your Streak!
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Consistency is key to mastering algorithms. Solve at least
                    one problem daily to maintain your streak.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyStreakCalendar;

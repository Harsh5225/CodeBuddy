/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */


import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../features/auth/authSlice";
import axiosClient from "../utils/axiosClient";
import EditProfileModal from "./EditProfileModal";
import { setUser } from "../features/auth/authSlice";
import {
  User,
  Calendar,
  Trophy,
  Target,
  Zap,
  Flame,
  Code,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  LogOut,
  Home,
  Sparkles,
  Activity,
  BarChart3,
  Crown,
  Edit3,
  Camera,
  Heart,
  Briefcase,
  GraduationCap,
  Shield,
  BookOpen,
  MapPin,
} from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log("user in profile", user);
  const { solvedProblems } = useSelector((state) => state.problem);

  const [stats, setStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // Fetch complete profile data from backend
  const fetchProfileData = async () => {
    try {
      const response = await axiosClient.get("/user/profile");

      // Assuming your backend returns user data directly or in a standard format
      const userData = response.data.user || response.data;
      setProfileData(userData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // Fallback to Redux user data
      if (user) {
        setCurrentUser(user);
      }
    }
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);

        // Fetch complete profile data
        await fetchProfileData();

        // Calculate stats from solved problems
        if (solvedProblems && solvedProblems.length > 0) {
          const easy = solvedProblems.filter(
            (p) => p.difficulty?.toLowerCase() === "easy"
          ).length;
          const medium = solvedProblems.filter(
            (p) => p.difficulty?.toLowerCase() === "medium"
          ).length;
          const hard = solvedProblems.filter(
            (p) => p.difficulty?.toLowerCase() === "hard"
          ).length;

          setStats({
            easy,
            medium,
            hard,
            total: solvedProblems.length,
          });
        }

        // Fetch recent submissions
        try {
          const { data } = await axiosClient.get("/submission/recent");
          if (data.success) {
            console.log("Recent submissions data:", data.submissions);
            setRecentSubmissions(data.submissions || []);
          }
        } catch (error) {
          console.log("Recent submissions not available");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [solvedProblems]);

  // Initialize edit form when user data changes
  useEffect(() => {
    if (user && !profileData) {
      setCurrentUser(user);
    }
  }, [user, profileData]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    setProfileData(updatedUser);
    // You might want to dispatch an action to update the Redux store as well
    dispatch(setUser(updatedUser));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "hard":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusColor = (status) => {
    return status === "accepted"
      ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
      : "text-red-400 bg-red-500/10 border-red-500/20";
  };

  // Calculate user level based on problems solved
  const getUserLevel = () => {
    const total = stats.total;
    if (total >= 100) return "Expert";
    if (total >= 50) return "Advanced";
    if (total >= 20) return "Intermediate";
    if (total >= 5) return "Beginner";
    return "Newcomer";
  };

  // Calculate user rank (mock calculation)
  // const getUserRank = () => {
  //   const total = stats.total
  //   const baseRank = 10000
  //   const improvement = total * 50
  //   return Math.max(1, baseRank - improvement)
  // }

  // Calculate streak (mock calculation)
  const getStreak = () => {
    return Math.min(30, Math.floor(stats.total / 3) + 1);
  };

  // Get user role display
  const getUserRole = () => {
    return currentUser?.role === "admin" ? "Administrator" : "Developer";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/8 to-blue-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>

      {/* Enhanced Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-800/60 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg flex items-center justify-center overflow-hidden">
                  {currentUser?.photoUrl ? (
                    <img
                      src={currentUser.photoUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {currentUser?.firstName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-1.5 h-1.5 text-white" />
                </div>
              </div>
              <button
                onClick={() => navigate("/")}
                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-blue-300 transition-all duration-200"
              >
                CodeBuddy
              </button>
            </div>

            <div className="relative">
              <button
                className="flex items-center space-x-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg px-4 py-2 transition-all duration-200 backdrop-blur-sm border border-gray-600/30"
                onClick={() =>
                  document
                    .getElementById("user-menu")
                    .classList.toggle("hidden")
                }
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {currentUser?.firstName?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-gray-200 font-medium">
                  {currentUser?.firstName || "User"}
                </span>
              </button>

              <div
                id="user-menu"
                className="hidden absolute right-0 mt-2 w-48 bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-xl border border-gray-700/50"
              >
                <div className="py-2">
                  <button
                    className="flex items-center w-full px-4 py-2 text-blue-400 hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                    disabled
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile (Current)
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-gray-200 hover:bg-gray-700/50 transition-colors duration-200"
                    onClick={() => navigate("/")}
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Home
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-700/50 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        currentUser={currentUser}
        onUserUpdate={handleUserUpdate}
      />

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced User Info Card */}
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-3xl"></div>
            <div className="relative z-10 p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                    {currentUser?.photoUrl ? (
                      <img
                        src={currentUser.photoUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {currentUser?.firstName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center border-4 border-gray-800 hover:scale-110 transition-transform duration-200"
                    title="Upload Profile Photo"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">
                  {currentUser?.firstName || "User"}{" "}
                  {currentUser?.lastName || ""}
                </h2>
                <p className="text-gray-400 mb-2">
                  {currentUser?.emailId || currentUser?.email}
                </p>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>{getUserLevel()}</span>
                  </div>
                  {currentUser?.role === "admin" && (
                    <div className="px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Admin</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleEditProfile}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-4 hover:bg-blue-500/10 px-3 py-2 rounded-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit Profile</span>
                </button>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-6"></div>

              {/* Dynamic Quick Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">Joined</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">Location</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {currentUser?.location || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-300 text-sm">Role</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {currentUser?.jobTitle || getUserRole()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span className="text-gray-300 text-sm">Level</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {currentUser?.level || getUserLevel()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300 text-sm">Streak</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {currentUser?.streak || getStreak()} days
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-300 text-sm">Problems</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {stats.total} solved
                  </span>
                </div>
              </div>

              {/* Innovative Achievement Cards */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                  Achievements & Stats
                </h3>

                {/* Interactive Quick Actions */}

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-blue-600/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-3 hover:from-blue-600/30 hover:to-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <Code className="w-4 h-4 text-blue-400 group-hover:animate-pulse" />
                    <span className="text-sm text-blue-300 font-medium">
                      Solve
                    </span>
                  </button>
                  <button className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-lg p-3 hover:from-blue-600/30 hover:to-emerald-600/30 transition-all duration-200 flex items-center justify-center space-x-2 group">
                    <BarChart3 className="w-4 h-4 text-blue-400 group-hover:animate-bounce" />
                    <span className="text-sm text-blue-300 font-medium">
                      Stats
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Problem Solving Statistics */}
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-3xl"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Problem Solving Statistics
                    </h2>
                    <p className="text-gray-400">
                      Track your coding progress and achievements
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30 text-center hover:scale-105 transition-transform duration-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Total Solved
                    </p>
                    <p className="text-3xl font-bold text-blue-400">
                      {stats.total}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      +{Math.floor(stats.total * 0.1)} this week
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30 text-center hover:scale-105 transition-transform duration-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Easy
                    </p>
                    <p className="text-3xl font-bold text-blue-400">
                      {stats.easy}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">85% accuracy</p>
                  </div>

                  <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30 text-center hover:scale-105 transition-transform duration-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Medium
                    </p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {stats.medium}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">72% accuracy</p>
                  </div>

                  <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30 text-center hover:scale-105 transition-transform duration-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Hard
                    </p>
                    <p className="text-3xl font-bold text-red-400">
                      {stats.hard}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">58% accuracy</p>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-blue-400 mr-3" />
                      <h3 className="text-lg font-semibold text-white">
                        Difficulty Distribution
                      </h3>
                    </div>
                    <div className="text-sm text-gray-400">
                      {stats.total > 0
                        ? Math.round((stats.total / 200) * 100)
                        : 0}
                      % to next milestone
                    </div>
                  </div>

                  <div className="relative w-full bg-gray-800/50 rounded-full h-6 overflow-hidden border border-gray-600/30">
                    {stats.total > 0 && (
                      <>
                        <div
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-6 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${(stats.easy / stats.total) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-6 rounded-full -mt-6 transition-all duration-1000 ease-out"
                          style={{
                            width: `${(stats.medium / stats.total) * 100}%`,
                            marginLeft: `${(stats.easy / stats.total) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-gradient-to-r from-red-500 to-pink-500 h-6 rounded-full -mt-6 transition-all duration-1000 ease-out"
                          style={{
                            width: `${(stats.hard / stats.total) * 100}%`,
                            marginLeft: `${
                              ((stats.easy + stats.medium) / stats.total) * 100
                            }%`,
                          }}
                        ></div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between text-sm mt-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mr-2"></div>
                      <span className="text-blue-400 font-medium">
                        Easy ({stats.easy})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-2"></div>
                      <span className="text-yellow-400 font-medium">
                        Medium ({stats.medium})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-2"></div>
                      <span className="text-red-400 font-medium">
                        Hard ({stats.hard})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Recent Activity */}
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-3xl"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Recent Submissions
                      </h2>
                      <p className="text-gray-400">
                        Your latest coding activity
                      </p>
                    </div>
                  </div>
                </div>

                {recentSubmissions && recentSubmissions.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-gray-600/30">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800/50 border-b border-gray-600/30">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                              Problem
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                              Language
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600/30">
                          {recentSubmissions.map((submission) => (
                            <tr
                              key={submission._id}
                              className="hover:bg-gray-700/30 transition-colors duration-200"
                            >
                              <td className="px-6 py-4">
                                <button
                                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
                                  onClick={() =>
                                    navigate(`/problem/${submission.problemId}`)
                                  }
                                >
                                  {submission.problemTitle || "Problem"}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center w-fit ${getStatusColor(
                                    submission.status
                                  )}`}
                                >
                                  {submission.status === "accepted" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {submission.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                                  {submission.language}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-300">
                                {new Date(
                                  submission.createdAt
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl border border-gray-600/30">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Recent Submissions
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Start solving problems to track your progress!
                    </p>
                  </div>
                )}

                <div className="flex justify-end mt-8">
                  <button
                    className="bg-gradient-to-r from-blue-600 via-pink-600 to-blue-600 hover:from-blue-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-2xl relative overflow-hidden hover:scale-105 hover:shadow-blue-500/25"
                    onClick={() => navigate("/")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <Code className="w-5 h-5" />
                    <span>Solve Problems</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

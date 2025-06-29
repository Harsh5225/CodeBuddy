/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../features/auth/authSlice";
import {
  getAllProblems,
  getUserSolvedProblems,
} from "../features/problem/problemSlice";
import { NavLink } from "react-router";
import {
  Code,
  Filter,
  Trophy,
  Target,
  Zap,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Flame,
  TrendingUp,
  Award,
  Brain,
  Rocket,
  Sparkles,
} from "lucide-react";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    problems,
    solvedProblems,
    totalProblems,
    currentPage,
    totalPages,
    loading,
    solvedLoading,
    error,
  } = useSelector((state) => state.problem);

  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filteredProblems, setFilteredProblems] = useState([]);

  // Fetch problems on component mount
  useEffect(() => {
    console.log("user in homepage", user);
    dispatch(getAllProblems({ pageNum: 1, pagecnt: pageSize }));
    dispatch(getUserSolvedProblems());
  }, [dispatch, pageSize]);

  // Apply filters whenever problems change or filters change
  useEffect(() => {
    if (!problems) return;

    let result = [...problems];

    // Apply difficulty filter
    if (filters.difficulty !== "all") {
      result = result.filter(
        (problem) => problem.difficulty?.toLowerCase() === filters.difficulty
      );
    }

    // Apply tag filter
    if (filters.tag !== "all") {
      result = result.filter(
        (problem) => problem.tags?.toLowerCase() === filters.tag
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      if (filters.status === "solved") {
        result = result.filter((problem) => isProblemSolved(problem._id));
      } else if (filters.status === "unsolved") {
        result = result.filter((problem) => !isProblemSolved(problem._id));
      }
    }

    setFilteredProblems(result);
  }, [problems, filters, solvedProblems]);

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(getAllProblems({ pageNum: newPage, pagecnt: pageSize }));
    }
  };

  // Get difficulty badge color
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "hard":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  // Check if problem is solved by user
  const isProblemSolved = (problemId) => {
    return solvedProblems.some((problem) => problem._id === problemId);
  };

  // Handle problem selection
  const handleProblemSelect = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      difficulty: "all",
      tag: "all",
      status: "all",
    });
  };

  // Get unique tags from problems
  const getUniqueTags = () => {
    return ["all", "array", "linkedList", "graph", "dp", "math"];
  };

  const navigate = useNavigate();

  const difficultyCards = [
    {
      title: "Easy Problems",
      description: "Perfect for beginners. Start your coding journey here.",
      difficulty: "easy",
      icon: Target,
      gradient: "from-green-600 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Medium Problems",
      description: "Challenge yourself with intermediate difficulty problems.",
      difficulty: "medium",
      icon: Zap,
      gradient: "from-yellow-600 to-orange-600",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      title: "Hard Problems",
      description: "Test your skills with the most challenging problems.",
      difficulty: "hard",
      icon: Flame,
      gradient: "from-red-600 to-pink-600",
      bgGradient: "from-red-500/10 to-pink-500/10",
      borderColor: "border-red-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/8 to-blue-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-800/60 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-1.5 h-1.5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CodeBuddy
              </span>
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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.firstName?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-gray-200 font-medium">
                  {user?.firstName || "User"}
                </span>
              </button>

              <div
                id="user-menu"
                className="hidden absolute right-0 mt-2 w-48 bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-xl border border-gray-700/50"
              >
                <div className="py-2">
                  <button
                    className="flex items-center w-full px-4 py-2 text-gray-200 hover:bg-gray-700/50 transition-colors duration-200"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  {user?.role === "admin" && (
                    <button
                      className="flex items-center w-full px-4 py-2 text-gray-200 hover:bg-gray-700/50 transition-colors duration-200"
                      onClick={() => navigate("/admin")}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Admin Panel
                    </button>
                  )}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || "User"}!
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Continue your coding journey and master algorithmic problem solving
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-6 rounded-xl border border-gray-600/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Problems
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalProblems || 0}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-6 rounded-xl border border-gray-600/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Solved</p>
                <p className="text-2xl font-bold text-green-400">
                  {solvedProblems?.length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-6 rounded-xl border border-gray-600/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {totalProblems
                    ? Math.round(
                        ((solvedProblems?.length || 0) / totalProblems) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-6 rounded-xl border border-gray-600/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Rank</p>
                <p className="text-2xl font-bold text-yellow-400">Expert</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span>{error}</span>
          </div>
        )}

        {/* Problem Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-3 text-purple-400" />
            Problem Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {difficultyCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.difficulty}
                  className={`bg-gradient-to-r ${card.bgGradient} p-6 rounded-xl border ${card.borderColor} backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group`}
                  onClick={() => {
                    handleFilterChange("difficulty", card.difficulty);
                    document
                      .getElementById("problems-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon
                      className={`w-8 h-8 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                    />
                    <Rocket className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm">
                    <span
                      className={`bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent font-medium`}
                    >
                      Explore Problems →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problems Section */}
        <div id="problems-section" className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Code className="w-6 h-6 mr-3 text-purple-400" />
              All Problems
            </h2>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border ${
                showFilters
                  ? "bg-purple-600 text-white border-purple-500/30"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border-gray-600/30"
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 p-6 rounded-xl border border-gray-600/30 backdrop-blur-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Difficulty
                  </label>
                  <select
                    className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                    value={filters.difficulty}
                    onChange={(e) =>
                      handleFilterChange("difficulty", e.target.value)
                    }
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Tags
                  </label>
                  <select
                    className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                    value={filters.tag}
                    onChange={(e) => handleFilterChange("tag", e.target.value)}
                  >
                    {getUniqueTags().map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === "all"
                          ? "All Tags"
                          : tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="solved">Solved</option>
                    <option value="unsolved">Unsolved</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  className="px-4 py-2 bg-gray-600/50 hover:bg-gray-500/50 text-gray-200 rounded-lg transition-colors duration-200 backdrop-blur-sm border border-gray-600/30"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
                <span className="text-sm text-gray-400">
                  Showing {filteredProblems.length} of {problems?.length || 0}{" "}
                  problems
                </span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
          ) : filteredProblems.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 rounded-xl border border-gray-600/30 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-600/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Difficulty
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Tags
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600/30">
                      {filteredProblems.map((problem, index) => (
                        <tr
                          key={problem._id}
                          className="hover:bg-gray-700/30 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-gray-300">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <NavLink
                              to={`/problem/${problem._id}`}
                              className="text-white hover:text-purple-400 font-medium transition-colors duration-200"
                            >
                              {problem.title}
                            </NavLink>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyBadge(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                              {problem.tags}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {isProblemSolved(problem._id) ? (
                              <div className="flex items-center text-green-400">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">
                                  Solved
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="text-sm">Not Attempted</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                              onClick={() => handleProblemSelect(problem._id)}
                            >
                              Solve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {filters.difficulty === "all" &&
                filters.tag === "all" &&
                filters.status === "all" && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-gray-600/30"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm border ${
                              currentPage === page
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500/30"
                                : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border-gray-600/30"
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-gray-600/30"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
            </>
          ) : (
            <div className="text-center py-12 bg-gradient-to-r from-gray-800/60 to-gray-700/40 rounded-xl border border-gray-600/30 backdrop-blur-sm">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {filters.difficulty !== "all" ||
                filters.tag !== "all" ||
                filters.status !== "all"
                  ? "No problems match your filters. Try adjusting your criteria."
                  : "No problems found. Check back later!"}
              </p>
            </div>
          )}
        </div>

        {/* Solved Problems Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
            Your Solved Problems
          </h2>

          {solvedLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
          ) : solvedProblems.length > 0 ? (
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 rounded-xl border border-gray-600/30 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50 border-b border-gray-600/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Difficulty
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Tags
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600/30">
                    {solvedProblems.map((problem, index) => (
                      <tr
                        key={problem._id}
                        className="hover:bg-gray-700/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-gray-300">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-white font-medium">
                              {problem.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyBadge(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                            {problem.tags}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="px-4 py-2 bg-gray-600/50 hover:bg-gray-500/50 text-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 backdrop-blur-sm border border-gray-600/30"
                            onClick={() => handleProblemSelect(problem._id)}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-r from-gray-800/60 to-gray-700/40 rounded-xl border border-gray-600/30 backdrop-blur-sm">
              <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                You haven't solved any problems yet. Start solving to track your
                progress!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;

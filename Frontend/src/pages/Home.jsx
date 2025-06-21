/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../features/auth/authSlice";
import {
  getAllProblems,
  getUserSolvedProblems,
} from "../features/problem/problemSlice";
import { NavLink } from "react-router";
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
        return "badge-success";
      case "medium":
        return "badge-warning";
      case "hard":
        return "badge-error";
      default:
        return "badge-info";
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
    return ["array", "linkedList", "graph", "dp", "math"];
  };

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-base-200" data-theme="dark">
      {/* Navbar */}
      <div className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl text-primary">LeetCode Clone</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {user?.firstName?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </li>
              {/* <li>
                <a>Settings</a>
              </li> */}
              {user?.role === "admin" && (
                <li>
                  <button onClick={() => navigate("/admin")}>
                    Admin Panel
                  </button>
                </li>
              )}
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user?.firstName || "User"}!
        </h1>

        {/* Problem Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
              <h2 className="card-title text-success">Easy Problems</h2>
              <p>Perfect for beginners. Start your coding journey here.</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    handleFilterChange("difficulty", "easy");
                    window.scrollTo({
                      top:
                        document.getElementById("problems-section").offsetTop -
                        100,
                      behavior: "smooth",
                    });
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
              <h2 className="card-title text-warning">Medium Problems</h2>
              <p>Challenge yourself with intermediate difficulty problems.</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    handleFilterChange("difficulty", "medium");
                    window.scrollTo({
                      top:
                        document.getElementById("problems-section").offsetTop -
                        100,
                      behavior: "smooth",
                    });
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
              <h2 className="card-title text-error">Hard Problems</h2>
              <p>Test your skills with the most challenging problems.</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => {
                    handleFilterChange("difficulty", "hard");
                    window.scrollTo({
                      top:
                        document.getElementById("problems-section").offsetTop -
                        100,
                      behavior: "smooth",
                    });
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Problems List */}
        <div id="problems-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Problems</h2>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="bg-base-100 p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-wrap gap-4">
                {/* Difficulty Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Difficulty</span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tags</span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
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

              <div className="mt-4">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>

                <span className="ml-4 text-sm">
                  Showing {filteredProblems.length} of {problems.length}{" "}
                  problems
                </span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center my-8">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : filteredProblems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Difficulty</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map((problem, index) => (
                      <tr key={problem._id} className="hover">
                        <td>{index + 1}</td>
                        <NavLink to={`/problem/${problem._id}`}>
                          {" "}
                          <td>{problem.title}</td>
                        </NavLink>

                        <td>
                          <span
                            className={`badge ${getDifficultyBadge(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-outline">
                            {problem.tags}
                          </span>
                        </td>
                        <td>
                          {isProblemSolved(problem._id) ? (
                            <span className="text-success">Solved</span>
                          ) : (
                            <span className="text-base-content opacity-60">
                              Not Attempted
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-xs"
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

              {/* Only show pagination if not filtering */}
              {filters.difficulty === "all" &&
                filters.tag === "all" &&
                filters.status === "all" && (
                  <div className="flex justify-center mt-6">
                    <div className="join">
                      <button
                        className="join-item btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        «
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`join-item btn ${
                              currentPage === page ? "btn-active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        className="join-item btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
            </>
          ) : (
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                {filters.difficulty !== "all" ||
                filters.tag !== "all" ||
                filters.status !== "all"
                  ? "No problems match your filters. Try adjusting your criteria."
                  : "No problems found. Check back later!"}
              </span>
            </div>
          )}
        </div>

        {/* Solved Problems Section */}
        <h2 className="text-2xl font-bold mb-4 mt-10">Your Solved Problems</h2>

        {solvedLoading ? (
          <div className="flex justify-center my-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : solvedProblems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Tags</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {solvedProblems.map((problem, index) => (
                  <tr key={problem._id} className="hover">
                    <td>{index + 1}</td>
                    <td>{problem.title}</td>
                    <td>
                      <span
                        className={`badge ${getDifficultyBadge(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-outline">
                        {problem.tags}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-xs"
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
        ) : (
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              You haven't solved any problems yet. Start solving to track your
              progress!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;

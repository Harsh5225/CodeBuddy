import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../features/auth/authSlice";
import axiosClient from "../utils/axiosClient";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { solvedProblems } = useSelector((state) => state.problem);

  const [stats, setStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
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
        const { data } = await axiosClient.get("/submission/recent");

        if (data.success) {
          setRecentSubmissions(data.submissions || []);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [solvedProblems]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-base-200 flex items-center justify-center"
        data-theme="dark"
      >
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200" data-theme="dark">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a
            onClick={() => navigate("/")}
            className="btn btn-ghost text-xl text-primary cursor-pointer"
          >
            LeetCode Clone
          </a>
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
                <a className="font-bold">Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col items-center mb-4">
                <div className="avatar mb-4">
                  <div className="w-24 rounded-full bg-primary text-white grid place-items-center p-6">
                    <p className="text-4xl font-bold ">H</p>
                  </div>
                </div>
                <h2 className="card-title text-2xl">
                  {user?.firstName || "User"}
                </h2>
                <p className="text-base-content/70">{user?.email}</p>
                <div className="badge badge-primary mt-2">Coder</div>
              </div>

              <div className="divider"></div>

              <div className="stats stats-vertical shadow">
                <div className="stat">
                  <div className="stat-title">Joined</div>
                  <div className="stat-value text-lg">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  Problem Solving Statistics
                </h2>

                <div className="stats shadow w-full">
                  <div className="stat">
                    <div className="stat-title">Total Solved</div>
                    <div className="stat-value text-primary">{stats.total}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Easy</div>
                    <div className="stat-value text-success">{stats.easy}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Medium</div>
                    <div className="stat-value text-warning">
                      {stats.medium}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Hard</div>
                    <div className="stat-value text-error">{stats.hard}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Progress</h3>
                  <div className="w-full bg-base-300 rounded-full h-4">
                    <div
                      className="bg-success h-4 rounded-full"
                      style={{
                        width: `${
                          stats.easy > 0 ? (stats.easy / stats.total) * 100 : 0
                        }%`,
                      }}
                    ></div>
                    <div
                      className="bg-warning h-4 rounded-full -mt-4"
                      style={{
                        width: `${
                          stats.medium > 0
                            ? (stats.medium / stats.total) * 100
                            : 0
                        }%`,
                        marginLeft: `${
                          stats.easy > 0 ? (stats.easy / stats.total) * 100 : 0
                        }%`,
                      }}
                    ></div>
                    <div
                      className="bg-error h-4 rounded-full -mt-4"
                      style={{
                        width: `${
                          stats.hard > 0 ? (stats.hard / stats.total) * 100 : 0
                        }%`,
                        marginLeft: `${
                          stats.easy + stats.medium > 0
                            ? ((stats.easy + stats.medium) / stats.total) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-success">Easy</span>
                    <span className="text-warning">Medium</span>
                    <span className="text-error">Hard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Recent Submissions</h2>

                {recentSubmissions && recentSubmissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Problem</th>
                          <th>Status</th>
                          <th>Language</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSubmissions.map((submission) => (
                          <tr key={submission._id} className="hover">
                            <td>
                              <a
                                className="link link-primary"
                                onClick={() =>
                                  navigate(`/problem/${submission.problemId}`)
                                }
                              >
                                {submission.problemTitle || "Problem"}
                              </a>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  submission.status === "Accepted"
                                    ? "badge-success"
                                    : "badge-error"
                                }`}
                              >
                                {submission.status}
                              </span>
                            </td>
                            <td>{submission.language}</td>
                            <td>
                              {new Date(
                                submission.createdAt
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-info shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>No recent submissions. Start solving problems!</span>
                  </div>
                )}

                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                  >
                    Solve Problems
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

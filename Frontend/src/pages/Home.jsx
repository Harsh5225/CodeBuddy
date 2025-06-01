import React from "react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router";
import Logout from "./Logout";

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  //   const navigate = useNavigate();

  //hit  getallproblem

  return (
    <div className="min-h-screen bg-base-200" data-theme="dark">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
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
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <Logout />
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
                <button className="btn btn-success btn-sm">Explore</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
              <h2 className="card-title text-warning">Medium Problems</h2>
              <p>Challenge yourself with intermediate difficulty problems.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-warning btn-sm">Explore</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
              <h2 className="card-title text-error">Hard Problems</h2>
              <p>Test your skills with the most challenging problems.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-error btn-sm">Explore</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Problems */}
        <h2 className="text-2xl font-bold mb-4">Recent Problems</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: 1,
                  title: "Two Sum",
                  difficulty: "Easy",
                  status: "Solved",
                },
                {
                  id: 2,
                  title: "Add Two Numbers",
                  difficulty: "Medium",
                  status: "Attempted",
                },
                {
                  id: 3,
                  title: "Longest Substring",
                  difficulty: "Medium",
                  status: "Not Started",
                },
              ].map((problem) => (
                <tr key={problem.id}>
                  <td>{problem.id}</td>
                  <td>{problem.title}</td>
                  <td>
                    <span
                      className={`badge ${
                        problem.difficulty === "Easy"
                          ? "badge-success"
                          : problem.difficulty === "Medium"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>{problem.status}</td>
                  <td>
                    <button className="btn btn-primary btn-xs">Solve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Homepage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../features/auth/authSlice";
import { getAllProblems, getUserSolvedProblems } from "../features/problem/problemSlice";

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { 
    problems, 
    solvedProblems, 
    totalProblems, 
    currentPage, 
    totalPages,
    loading,
    solvedLoading,
    error
  } = useSelector((state) => state.problem);
  
  const [pageSize, setPageSize] = useState(10);

  // Fetch problems on component mount
  useEffect(() => {
    dispatch(getAllProblems({ pageNum: 1, pagecnt: pageSize }));
    dispatch(getUserSolvedProblems());
  }, [dispatch, pageSize]);

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(getAllProblems({ pageNum: newPage, pagecnt: pageSize }));
    }
  };

  // Get difficulty badge color
  const getDifficultyBadge = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy':
        return 'badge-success';
      case 'medium':
        return 'badge-warning';
      case 'hard':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  // Check if problem is solved by user
  const isProblemSolved = (problemId) => {
    return solvedProblems.some(problem => problem._id === problemId);
  };

  // Handle problem selection
  const handleProblemSelect = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

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

        {/* Error Display */}
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Problems List */}
        <h2 className="text-2xl font-bold mb-4">Problems</h2>
        
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : problems.length > 0 ? (
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
                  {problems.map((problem, index) => (
                    <tr key={problem._id} className="hover">
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td>{problem.title}</td>
                      <td>
                        <span className={`badge ${getDifficultyBadge(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-outline">{problem.tags}</span>
                      </td>
                      <td>
                        {isProblemSolved(problem._id) ? (
                          <span className="text-success">Solved</span>
                        ) : (
                          <span className="text-base-content opacity-60">Not Attempted</span>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="join">
                  <button 
                    className="join-item btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button 
                        key={pageNum}
                        className={`join-item btn ${currentPage === pageNum ? 'btn-active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>No problems found. Check back later!</span>
          </div>
        )}

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
                      <span className={`badge ${getDifficultyBadge(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-outline">{problem.tags}</span>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>You haven't solved any problems yet. Start solving to track your progress!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;



import { useEffect, useState } from "react"
import axiosClient from "../utils/axiosClient"
import { NavLink } from "react-router"
import { Video, Upload, Trash2, AlertCircle, Loader2 } from "lucide-react"

const AdminVideo = () => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      setLoading(true)
      const { data } = await axiosClient.get("/problem")
      setProblems(data?.problems || []) // Ensure array
    } catch (err) {
      setError("Failed to fetch problems")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return

    try {
      await axiosClient.delete(`/video/delete/${id}`)
      setProblems(problems.filter((problem) => problem._id !== id))
    } catch (err) {
      setError(err)
      console.log(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="text-center relative z-10">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading problems...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 p-8 shadow-2xl relative overflow-hidden max-w-md w-full mx-4">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-gray-400">{error.response?.data?.error || error}</p>
          </div>
        </div>
      </div>
    )
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

      <div className="container mx-auto p-4 relative z-10">
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-3xl"></div>

          <div className="relative z-10 p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                    Video Upload & Delete Panel
                  </h1>
                  <p className="text-gray-400">Manage video content for problems</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-600/30">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-700/50 to-gray-600/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Difficulty</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tags</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gradient-to-r from-gray-800/30 to-gray-700/20">
                    {problems.map((problem, index) => (
                      <tr
                        key={problem._id}
                        className="border-t border-gray-600/20 hover:bg-gradient-to-r hover:from-gray-700/30 hover:to-gray-600/20 transition-all duration-200"
                      >
                        <td className="px-6 py-4 text-gray-300 font-medium">{index + 1}</td>
                        <td className="px-6 py-4 text-white font-semibold">{problem.title}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              problem.difficulty === "easy"
                                ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-blue-400 border-blue-500/30"
                                : problem.difficulty === "medium"
                                  ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(problem.tags) ? (
                              problem.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold">
                                {problem.tags}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2 justify-center">
                            <NavLink
                              to={`/admin/upload/${problem._id}`}
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105"
                              title="Upload Video"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Upload</span>
                            </NavLink>
                            <button
                              onClick={() => handleDelete(problem._id)}
                              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105"
                              title="Delete Problem"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {problems.length === 0 && (
              <div className="text-center py-16">
                <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Problems Found</h3>
                <p className="text-gray-400">No problems available for video management.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminVideo

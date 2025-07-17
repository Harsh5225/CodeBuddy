/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import axiosClient from "../utils/axiosClient"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useSpring, animated } from "@react-spring/web"
import {
  ChevronLeft,
  Code,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Video,
  Settings,
  Home,
  Sparkles,
  Shield,
  Star,
} from "lucide-react"
import useLenis from "../hooks/useLenis"

const AdminPanel = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("create")
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentProblemId, setCurrentProblemId] = useState(null)
  useLenis();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: "array",
    visibleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
    startCode: [{ language: "javascript", initialCode: "// Your code here" }],
    referenceSolution: [{ language: "javascript", completeCode: "// Complete solution here" }],
  })

  // Animations
  const containerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 200, friction: 25 },
  })

  const headerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 200,
    config: { tension: 180, friction: 15 },
  })

  const tabAnimation = useSpring({
    from: { opacity: 0, transform: "translateX(-30px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    delay: 400,
    config: { tension: 160, friction: 12 },
  })

  // Handle input changes for basic form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle changes for nested array fields
  const handleArrayFieldChange = (arrayName, index, fieldName, value) => {
    const updatedArray = [...formData[arrayName]]
    updatedArray[index] = {
      ...updatedArray[index],
      [fieldName]: value,
    }

    setFormData({
      ...formData,
      [arrayName]: updatedArray,
    })
  }

  // Add new item to array fields
  const addArrayItem = (arrayName, defaultItem) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], defaultItem],
    })
  }

  // Remove item from array fields
  const removeArrayItem = (arrayName, index) => {
    const updatedArray = [...formData[arrayName]]
    updatedArray.splice(index, 1)

    setFormData({
      ...formData,
      [arrayName]: updatedArray,
    })
  }

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "easy",
      tags: "array",
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [{ language: "javascript", initialCode: "// Your code here" }],
      referenceSolution: [{ language: "javascript", completeCode: "// Complete solution here" }],
    })
    setEditMode(false)
    setCurrentProblemId(null)
  }

  // Fetch all problems for admin
  useEffect(() => {
    if (activeTab === "manage") {
      fetchProblems()
    }
  }, [activeTab])

  const fetchProblems = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get("/problem")
      setProblems(response.data.problems || [])
    } catch (error) {
      console.error("Error fetching problems:", error)
      toast.error("Failed to load problems")
    } finally {
      setLoading(false)
    }
  }

  // Load problem data for editing
  const handleEditProblem = async (id) => {
    try {
      setLoading(true)
      const response = await axiosClient.get(`/problem/${id}`)
      const problem = response.data

      // Set form data with problem details
      setFormData({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags,
        visibleTestCases: problem.visibleTestCases,
        hiddenTestCases: problem.hiddenTestCases,
        startCode: problem.startCode,
        referenceSolution: problem.referenceSolution,
      })

      setEditMode(true)
      setCurrentProblemId(id)
      setActiveTab("create") // Switch to create tab for editing
    } catch (error) {
      console.error("Error fetching problem details:", error)
      toast.error("Failed to load problem details")
    } finally {
      setLoading(false)
    }
  }

  // Update existing problem
  const handleUpdateProblem = async () => {
    try {
      setFormSubmitting(true)

      // Normalize language case to lowercase
      const formattedData = {
        ...formData,
        referenceSolution: formData.referenceSolution.map((sol) => ({
          ...sol,
          language: sol.language === "cpp" || sol.language === "C++" ? "c++" : sol.language.toLowerCase(),
        })),
        startCode: formData.startCode.map((code) => ({
          ...code,
          language: code.language === "cpp" || code.language === "C++" ? "c++" : code.language.toLowerCase(),
        })),
      }

      const response = await axiosClient.patch(`/problem/${currentProblemId}`, formattedData)

      if (response.status === 200) {
        toast.success("Problem updated successfully!")
        resetForm()
        setActiveTab("manage")
      }
    } catch (error) {
      console.error("Error updating problem:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Failed to update problem"
      toast.error(errorMessage)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Submit form to create or update a problem
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required")
      return
    }

    if (formData.visibleTestCases.some((tc) => !tc.input || !tc.output || !tc.explanation)) {
      toast.error("All visible test cases must have input, output, and explanation")
      return
    }

    if (formData.hiddenTestCases.some((tc) => !tc.input || !tc.output)) {
      toast.error("All hidden test cases must have input and output")
      return
    }

    if (formData.referenceSolution.some((sol) => !sol.completeCode)) {
      toast.error("All reference solutions must have complete code")
      return
    }

    // If in edit mode, update the problem, otherwise create a new one
    if (editMode) {
      await handleUpdateProblem()
    } else {
      try {
        setFormSubmitting(true)

        // Normalize language case to lowercase
        const formattedData = {
          ...formData,
          referenceSolution: formData.referenceSolution.map((sol) => ({
            ...sol,
            language: sol.language === "cpp" || sol.language === "C++" ? "c++" : sol.language.toLowerCase(),
          })),
          startCode: formData.startCode.map((code) => ({
            ...code,
            language: code.language === "cpp" || code.language === "C++" ? "c++" : code.language.toLowerCase(),
          })),
        }

        console.log("Submitting problem data:", formattedData)

        const response = await axiosClient.post("/problem/create", formattedData)

        if (response.status === 200) {
          toast.success("Problem created successfully!")
          resetForm()
        }
      } catch (error) {
        console.error("Error creating problem:", error)

        const errorMessage =
          error.response?.data?.message || error.response?.data?.error || error.message || "Failed to create problem"

        const errorDetails = error.response?.data?.details

        if (errorDetails) {
          console.error("Error details:", errorDetails)
        }

        toast.error(errorMessage)
      } finally {
        setFormSubmitting(false)
      }
    }
  }

  // Delete a problem
  const handleDeleteProblem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) {
      return
    }

    try {
      await axiosClient.delete(`/problem/${id}`)
      toast.success("Problem deleted successfully")
      fetchProblems()
    } catch (error) {
      console.error("Error deleting problem:", error)
      toast.error("Failed to delete problem")
    }
  }

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 p-8 shadow-2xl relative overflow-hidden max-w-md w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </button>
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
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <ToastContainer position="top-right" theme="dark" />

      {/* Enhanced Navbar */}
      <animated.div style={headerAnimation} className="relative z-10">
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl border-b border-gray-600/30 shadow-2xl">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                      CodeBuddy
                    </h1>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Settings className="w-3 h-3" />
                  <span>Admin Panel</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/")}
                  className="p-2 bg-gradient-to-r from-gray-700/50 to-gray-600/30 backdrop-blur-sm rounded-xl border border-gray-600/30 text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform duration-200">
                    {user?.firstName?.charAt(0) || "A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </animated.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <animated.div style={containerAnimation}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 text-lg">Manage coding problems and platform content</p>
          </div>

          {/* Enhanced Tabs */}
          <animated.div style={tabAnimation} className="mb-8">
            <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/30 backdrop-blur-xl rounded-2xl border border-gray-600/30 p-2 inline-flex space-x-2">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "create"
                    ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Problem</span>
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "manage"
                    ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Manage Problems</span>
              </button>
            </div>
          </animated.div>

          {/* Create Problem Form */}
          {activeTab === "create" && (
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-3xl"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center">
                    {editMode ? <Edit3 className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {editMode ? "Edit Problem" : "Create New Problem"}
                    </h2>
                    <p className="text-gray-400">
                      {editMode ? "Update the existing problem details" : "Add a new coding challenge to the platform"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <label className="block text-gray-300 text-sm font-medium mb-2">Problem Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter problem title"
                        className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Difficulty</label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Tags</label>
                        <select
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="array">Array</option>
                          <option value="linkedList">Linked List</option>
                          <option value="graph">Graph</option>
                          <option value="dp">Dynamic Programming</option>
                          <option value="math">Math</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Problem Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Provide a detailed problem description with examples and constraints"
                      className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                      required
                    />
                  </div>

                  {/* Visible Test Cases */}
                  <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Visible Test Cases</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("visibleTestCases", {
                            input: "",
                            output: "",
                            explanation: "",
                          })
                        }
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Test Case</span>
                      </button>
                    </div>

                    {formData.visibleTestCases.map((testCase, index) => (
                      <div
                        key={`visible-${index}`}
                        className="bg-gradient-to-r from-gray-800/40 to-gray-700/30 rounded-xl p-6 mb-4 border border-gray-600/20"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-white">Test Case #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("visibleTestCases", index)}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-1 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Input</label>
                            <textarea
                              value={testCase.input}
                              onChange={(e) =>
                                handleArrayFieldChange("visibleTestCases", index, "input", e.target.value)
                              }
                              placeholder="Test case input"
                              className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-24 resize-none font-mono text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Output</label>
                            <textarea
                              value={testCase.output}
                              onChange={(e) =>
                                handleArrayFieldChange("visibleTestCases", index, "output", e.target.value)
                              }
                              placeholder="Expected output"
                              className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-24 resize-none font-mono text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Explanation</label>
                            <textarea
                              value={testCase.explanation}
                              onChange={(e) =>
                                handleArrayFieldChange("visibleTestCases", index, "explanation", e.target.value)
                              }
                              placeholder="Explanation of the test case"
                              className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-24 resize-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hidden Test Cases */}
                  <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Hidden Test Cases</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("hiddenTestCases", {
                            input: "",
                            output: "",
                          })
                        }
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Test Case</span>
                      </button>
                    </div>

                    {formData.hiddenTestCases.map((testCase, index) => (
                      <div
                        key={`hidden-${index}`}
                        className="bg-gradient-to-r from-gray-800/40 to-gray-700/30 rounded-xl p-6 mb-4 border border-gray-600/20"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-white">Test Case #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("hiddenTestCases", index)}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-1 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Input</label>
                            <textarea
                              value={testCase.input}
                              onChange={(e) =>
                                handleArrayFieldChange("hiddenTestCases", index, "input", e.target.value)
                              }
                              placeholder="Test case input"
                              className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-24 resize-none font-mono text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Output</label>
                            <textarea
                              value={testCase.output}
                              onChange={(e) =>
                                handleArrayFieldChange("hiddenTestCases", index, "output", e.target.value)
                              }
                              placeholder="Expected output"
                              className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-24 resize-none font-mono text-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Starter Code Templates */}
                  <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Code className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Starter Code Templates</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("startCode", {
                            language: "javascript",
                            initialCode: "// Your code here",
                          })
                        }
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Template</span>
                      </button>
                    </div>

                    {formData.startCode.map((template, index) => (
                      <div
                        key={`starter-${index}`}
                        className="bg-gradient-to-r from-gray-800/40 to-gray-700/30 rounded-xl p-6 mb-4 border border-gray-600/20"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-white">Template #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("startCode", index)}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-1 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-300 text-sm font-medium mb-2">Language</label>
                          <select
                            value={template.language}
                            onChange={(e) => handleArrayFieldChange("startCode", index, "language", e.target.value)}
                            className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Initial Code</label>
                          <textarea
                            value={template.initialCode}
                            onChange={(e) => handleArrayFieldChange("startCode", index, "initialCode", e.target.value)}
                            placeholder="Starter code for this language"
                            className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none font-mono text-sm"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reference Solutions */}
                  <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Reference Solutions</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("referenceSolution", {
                            language: "javascript",
                            completeCode: "// Complete solution here",
                          })
                        }
                        className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Solution</span>
                      </button>
                    </div>

                    {formData.referenceSolution.map((solution, index) => (
                      <div
                        key={`solution-${index}`}
                        className="bg-gradient-to-r from-gray-800/40 to-gray-700/30 rounded-xl p-6 mb-4 border border-gray-600/20"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-white">Solution #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("referenceSolution", index)}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-1 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-300 text-sm font-medium mb-2">Language</label>
                          <select
                            value={solution.language}
                            onChange={(e) =>
                              handleArrayFieldChange("referenceSolution", index, "language", e.target.value)
                            }
                            className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="c++">C++</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="c">C</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Complete Solution</label>
                          <textarea
                            value={solution.completeCode}
                            onChange={(e) =>
                              handleArrayFieldChange("referenceSolution", index, "completeCode", e.target.value)
                            }
                            placeholder="Complete working solution"
                            className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-48 resize-none font-mono text-sm"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6">
                    {editMode && (
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={formSubmitting}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className={`bg-gradient-to-r from-blue-600 via-pink-600 to-blue-600 hover:from-blue-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-2xl relative overflow-hidden ${
                        formSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-blue-500/25"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      {formSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{editMode ? "Updating..." : "Creating..."}</span>
                        </>
                      ) : (
                        <>
                          {editMode ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                          <span>{editMode ? "Update Problem" : "Create Problem"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Manage Problems */}
          {activeTab === "manage" && (
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-3xl"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Manage Problems</h2>
                    <p className="text-gray-400">View, edit, and delete existing problems</p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : problems.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-gray-600/30">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-700/50 to-gray-600/30">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">#</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Difficulty</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tags</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
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
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    problem.difficulty === "easy"
                                      ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-blue-400 border border-blue-500/30"
                                      : problem.difficulty === "medium"
                                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                                        : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30"
                                  }`}
                                >
                                  {problem.difficulty}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold">
                                  {problem.tags}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => navigate(`/problem/${problem._id}`)}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View</span>
                                  </button>
                                  <button
                                    onClick={() => handleEditProblem(problem._id)}
                                    className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProblem(problem._id)}
                                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                  <button
                                    onClick={() => navigate("/admin/video")}
                                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1"
                                  >
                                    <Video className="w-3 h-3" />
                                    <span>Videos</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Problems Found</h3>
                    <p className="text-gray-400 mb-6">Create some problems to get started!</p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create First Problem</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </animated.div>
      </div>
    </div>
  )
}

export default AdminPanel

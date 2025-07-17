/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useSelector } from "react-redux"
import axiosClient from "../utils/axiosClient"
import CollaborativeEditor from "../components/CollaborativeEditor"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from "../components/ChatAi"
import Editorial from "../components/Editorial"
import {
  FileText,
  Users,
  ArrowLeft,
  Share2,
  AlertCircle,
  CheckCircle,
  Clock,
  Trophy,
  BookOpen,
  Code,
  History,
  MessageSquare,
  TestTube,
  XCircle,
  MemoryStickIcon as Memory,
  Zap,
} from "lucide-react"

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
}

const CollaborativeProblemPage = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [runResult, setRunResult] = useState(null)
  const [submitResult, setSubmitResult] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [activeLeftTab, setActiveLeftTab] = useState("description")
  const [activeRightTab, setActiveRightTab] = useState("code")
  const [code, setCode] = useState("")

  // Fetch room and problem data
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true)

        // Get room information
        const roomResponse = await axiosClient.get(`/collaboration/rooms/${roomId}`)
        const roomData = roomResponse.data.room

        if (!roomData) {
          setError("Room not found")
          return
        }

        // Get problem data
        const problemResponse = await axiosClient.get(`/problem/${roomData.problemId}`)
        const problemData = problemResponse.data
        setProblem(problemData)

        // Set initial code
        const initialCode =
          problemData.startCode.find((sc) => sc.language.toLowerCase() === langMap[selectedLanguage].toLowerCase())
            ?.initialCode || "// Your code here"
        setCode(initialCode)
      } catch (err) {
        console.error("Error fetching room data:", err)
        setError(err.response?.data?.message || "Failed to load collaboration room")
      } finally {
        setLoading(false)
      }
    }

    if (roomId) {
      fetchRoomData()
    }
  }, [roomId, selectedLanguage])

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode =
        problem.startCode.find((sc) => sc.language.toLowerCase() === langMap[selectedLanguage].toLowerCase())
          ?.initialCode || "// Your code here"
      setCode(initialCode)
    }
  }, [selectedLanguage, problem])

  // Handle code execution
  const handleRunCode = async (currentCode) => {
    if (!problem) return null

    setLoading(true)
    setRunResult(null)

    try {
      const response = await axiosClient.post(`/submission/run/${problem._id}`, {
        code: currentCode,
        language: selectedLanguage,
      })

      setRunResult(response.data)
      setActiveRightTab("testcase")
      return response.data
    } catch (error) {
      console.error("Error running code:", error)
      const errorResult = {
        success: false,
        error: "Internal server error",
      }
      setRunResult(errorResult)
      setActiveRightTab("testcase")
      return errorResult
    } finally {
      setLoading(false)
    }
  }

  // Handle code submission
  const handleSubmitCode = async (currentCode) => {
    if (!problem) return null

    setLoading(true)
    setSubmitResult(null)

    try {
      const response = await axiosClient.post(`/submission/submit/${problem._id}`, {
        code: currentCode,
        language: selectedLanguage,
      })

      setSubmitResult(response.data)
      setActiveRightTab("result")
      return response.data
    } catch (error) {
      console.error("Error submitting code:", error)
      const errorResult = {
        accepted: false,
        error: "Submission failed",
      }
      setSubmitResult(errorResult)
      setActiveRightTab("result")
      return errorResult
    } finally {
      setLoading(false)
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "hard":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  const leftTabs = [
    { id: "description", label: "Description", icon: FileText },
    { id: "editorial", label: "Editorial", icon: BookOpen },
    { id: "solutions", label: "Solutions", icon: Code },
    { id: "submissions", label: "Submissions", icon: History },
    { id: "chatAI", label: "AI Assistant", icon: MessageSquare },
  ]

  const rightTabs = [
    { id: "code", label: "Code", icon: Code },
    { id: "testcase", label: "Test Cases", icon: TestTube },
    { id: "result", label: "Result", icon: Trophy },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading collaboration room...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 p-8 shadow-2xl relative overflow-hidden max-w-md w-full mx-4">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Room Not Found</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Left Panel - Problem Description */}
      <div className="w-1/2 flex flex-col border-r border-gray-700/50 bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Collaborative Session</h1>
                <p className="text-gray-400 text-sm">Room: {roomId.slice(0, 8)}...</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium flex items-center space-x-1">
              <Share2 className="w-3 h-3" />
              <span>Live</span>
            </div>
          </div>
        </div>

        {/* Left Tabs */}
        <div className="flex border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          {leftTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeLeftTab === tab.id
                    ? "text-blue-400 border-blue-400 bg-blue-500/10"
                    : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/30"
                }`}
                onClick={() => setActiveLeftTab(tab.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto">
          {problem && (
            <>
              {activeLeftTab === "description" && (
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}
                    >
                      {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                    </div>
                    <div className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                      {problem.tags}
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-8">{problem.description}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-400" />
                      Examples
                    </h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases?.map((example, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-5 rounded-xl border border-gray-600/30 backdrop-blur-sm"
                        >
                          <h4 className="font-semibold text-blue-300 mb-3">Example {index + 1}:</h4>
                          <div className="space-y-3 text-sm font-mono">
                            <div className="flex">
                              <span className="text-blue-400 font-semibold min-w-20">Input:</span>
                              <span className="text-gray-200 bg-gray-900/50 px-2 py-1 rounded">{example.input}</span>
                            </div>
                            <div className="flex">
                              <span className="text-blue-400 font-semibold min-w-20">Output:</span>
                              <span className="text-gray-200 bg-gray-900/50 px-2 py-1 rounded">{example.output}</span>
                            </div>
                            <div className="flex">
                              <span className="text-yellow-400 font-semibold min-w-20">Explanation:</span>
                              <span className="text-gray-300">{example.explanation}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === "editorial" && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                      <BookOpen className="w-6 h-6 mr-2 text-blue-400" />
                      Editorial Solution
                    </h2>
                    <p className="text-gray-400">Watch the comprehensive explanation and walkthrough</p>
                  </div>
                  <Editorial
                    secureUrl={problem.secureUrl}
                    thumbnailUrl={problem.thumbnailUrl}
                    duration={problem.duration}
                  />
                </div>
              )}

              {activeLeftTab === "solutions" && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Code className="w-6 h-6 mr-2 text-blue-400" />
                    Reference Solutions
                  </h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-600/30 backdrop-blur-sm overflow-hidden"
                      >
                        <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-600/30">
                          <h3 className="font-semibold text-white flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full mr-3"></div>
                            {problem?.title} - {solution?.language}
                          </h3>
                        </div>
                        <div className="p-6">
                          <pre className="bg-gray-900/80 p-4 rounded-lg text-sm overflow-x-auto border border-gray-700/50">
                            <code className="text-gray-200">{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Solutions will be available after you solve the problem.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === "submissions" && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <History className="w-6 h-6 mr-2 text-blue-400" />
                    My Submissions
                  </h2>
                  <SubmissionHistory problemId={problem._id} />
                </div>
              )}

              {activeLeftTab === "chatAI" && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-blue-400" />
                    AI Assistant
                  </h2>
                  <ChatAi problem={problem} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm relative z-10">
        {/* Right Tabs */}
        <div className="flex border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          {rightTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeRightTab === tab.id
                    ? "text-blue-400 border-blue-400 bg-blue-500/10"
                    : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/30"
                }`}
                onClick={() => setActiveRightTab(tab.id)}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === "code" && problem && (
            <CollaborativeEditor
              problemId={problem._id}
              roomId={roomId}
              initialCode={
                problem.startCode?.find((sc) => sc.language.toLowerCase() === langMap[selectedLanguage].toLowerCase())
                  ?.initialCode || "// Your code here"
              }
              initialLanguage={selectedLanguage}
              onCodeChange={(newCode) => {
                setCode(newCode)
              }}
              onLanguageChange={(language) => {
                setSelectedLanguage(language)
              }}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
            />
          )}

          {activeRightTab === "testcase" && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="font-semibold text-white mb-6 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-blue-400" />
                Test Results
              </h3>
              {runResult ? (
                <div
                  className={`p-6 rounded-xl border backdrop-blur-sm ${
                    runResult.success
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {runResult.success ? (
                    <div>
                      <div className="flex items-center mb-4">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        <h4 className="font-bold text-lg">All test cases passed!</h4>
                      </div>
                      <div className="flex gap-6 mb-6 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Runtime: {runResult.runtime} sec</span>
                        </div>
                        <div className="flex items-center">
                          <Memory className="w-4 h-4 mr-1" />
                          <span>Memory: {runResult.memory} KB</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {runResult.testCases.map((tc, i) => (
                          <div key={i} className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                            <div className="font-mono text-sm space-y-2">
                              <div className="flex">
                                <span className="text-blue-400 font-semibold min-w-20">Input:</span>
                                <span className="text-gray-200">{tc.stdin}</span>
                              </div>
                              <div className="flex">
                                <span className="text-yellow-400 font-semibold min-w-20">Expected:</span>
                                <span className="text-gray-200">{tc.expected_output}</span>
                              </div>
                              <div className="flex">
                                <span className="text-blue-400 font-semibold min-w-20">Output:</span>
                                <span className="text-gray-200">{tc.stdout}</span>
                              </div>
                              <div className="flex items-center text-blue-400">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="font-semibold">Passed</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-4">
                        <XCircle className="w-6 h-6 mr-2" />
                        <h4 className="font-bold text-lg">Test Failed</h4>
                      </div>
                      <div className="space-y-3">
                        {runResult.testCases?.map((tc, i) => (
                          <div key={i} className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                            <div className="font-mono text-sm space-y-2">
                              <div className="flex">
                                <span className="text-blue-400 font-semibold min-w-20">Input:</span>
                                <span className="text-gray-200">{tc.stdin}</span>
                              </div>
                              <div className="flex">
                                <span className="text-yellow-400 font-semibold min-w-20">Expected:</span>
                                <span className="text-gray-200">{tc.expected_output}</span>
                              </div>
                              <div className="flex">
                                <span className="text-blue-400 font-semibold min-w-20">Output:</span>
                                <span className="text-gray-200">{tc.stdout}</span>
                              </div>
                              <div
                                className={`flex items-center ${tc.status_id == 3 ? "text-blue-400" : "text-red-400"}`}
                              >
                                {tc.status_id == 3 ? (
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                ) : (
                                  <XCircle className="w-4 h-4 mr-1" />
                                )}
                                <span className="font-semibold">{tc.status_id == 3 ? "Passed" : "Failed"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TestTube className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Click "Run" to test your code with the example test cases.</p>
                </div>
              )}
            </div>
          )}

          {activeRightTab === "result" && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="font-semibold text-white mb-6 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-blue-400" />
                Submission Result
              </h3>
              {submitResult ? (
                <div
                  className={`p-6 rounded-xl border backdrop-blur-sm ${
                    submitResult.accepted ? "bg-blue-500/10 border-blue-500/20" : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  {submitResult.accepted ? (
                    <div>
                      <div className="flex items-center mb-4">
                        <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                        <h4 className="font-bold text-2xl text-blue-400">Accepted!</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                          <div className="flex items-center mb-2">
                            <CheckCircle className="w-5 h-5 mr-2 text-blue-400" />
                            <span className="text-gray-300 font-medium">Test Cases</span>
                          </div>
                          <p className="text-xl font-bold text-white">
                            {submitResult.passedTestCases}/{submitResult.totalTestCases}
                          </p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                          <div className="flex items-center mb-2">
                            <Clock className="w-5 h-5 mr-2 text-blue-400" />
                            <span className="text-gray-300 font-medium">Runtime</span>
                          </div>
                          <p className="text-xl font-bold text-white">{submitResult.runtime} sec</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                          <div className="flex items-center mb-2">
                            <Zap className="w-5 h-5 mr-2 text-blue-400" />
                            <span className="text-gray-300 font-medium">Memory</span>
                          </div>
                          <p className="text-xl font-bold text-white">{submitResult.memory} KB</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-4">
                        <XCircle className="w-8 h-8 mr-3 text-red-400" />
                        <h4 className="font-bold text-2xl text-red-400">{submitResult.error}</h4>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30 mt-6">
                        <p className="text-gray-300">
                          Test Cases Passed:{" "}
                          <span className="font-bold text-white">
                            {submitResult.passedTestCases}/{submitResult.totalTestCases}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Click "Submit" to submit your solution for evaluation.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollaborativeProblemPage

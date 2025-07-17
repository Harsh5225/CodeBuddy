import { useState } from "react"
import { useNavigate } from "react-router"
import axiosClient from "../utils/axiosClient"
import { X, Users, Code, Share2, Copy, Check, Sparkles, ArrowRight, AlertCircle, LogIn } from "lucide-react"

const CreateCollaborationModal = ({ isOpen, onClose, problemId, problemTitle }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [roomLink, setRoomLink] = useState("")
  const [roomId, setRoomId] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")

  // State for the new tabbed functionality
  const [activeTab, setActiveTab] = useState("create")
  const [joinInput, setJoinInput] = useState("")

  const createRoom = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await axiosClient.post("/collaboration/rooms/create", { problemId })
      if (response.data.success) {
        const newRoomId = response.data.roomId
        const link = `${window.location.origin}/collaborate/${newRoomId}`
        setRoomId(newRoomId)
        setRoomLink(link)
        setStep(2)
      } else {
        setError(response.data.message || "Failed to create room")
      }
    } catch (error) {
      console.error("Error creating room:", error)
      setError(error.response?.data?.message || "Failed to create collaboration room")
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }
  
  const handleJoinWithCode = () => {
    setError("")
    const input = joinInput.trim()
    if (!input) {
      setError("Please enter a room code or link.")
      return
    }
    let extractedRoomId = input
    if (input.includes("/")) {
      const parts = input.split("/")
      extractedRoomId = parts.pop() || parts.pop()
    }
    if (!extractedRoomId) {
      setError("Invalid link or code provided.")
      return
    }
    navigate(`/collaborate/${extractedRoomId}`)
    handleClose()
  }

  const joinRoom = () => {
    navigate(`/collaborate/${roomId}`)
    handleClose()
  }

  const handleClose = () => {
    setStep(1)
    setRoomLink("")
    setRoomId("")
    setLinkCopied(false)
    setError("")
    setActiveTab("create")
    setJoinInput("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-xl rounded-2xl border border-gray-600/40 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto relative">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Collaboration</h2>
                <p className="text-gray-400">Create or join a real-time coding session.</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex border-b border-gray-700">
            <button
              onClick={() => { setActiveTab("create"); setError(""); }}
              className={`flex-1 py-2 font-medium text-sm transition-colors ${
                activeTab === 'create'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Room
            </button>
            <button
              onClick={() => { setActiveTab("join"); setError(""); }}
              className={`flex-1 py-2 font-medium text-sm transition-colors ${
                activeTab === 'join'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Join Room
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Conditional Content */}
          {activeTab === 'create' ? (
            step === 1 ? (
              // Step 1: Create Room
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center mb-3">
                    <Code className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">Problem</h3>
                  </div>
                  <p className="text-gray-300 font-medium">{problemTitle}</p>
                </div>
                <button onClick={createRoom} disabled={loading} className={`w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"}`}>
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Room...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>Create Collaboration Room</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Step 2: Share Link
              <div className="space-y-6">
                <div className="text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Check className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-white">Room Created!</h3>
                   <p className="text-gray-300">Share the link below with your partner.</p>
                 </div>
                <div className="flex items-center space-x-2">
                  <input type="text" value={roomLink} readOnly className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={copyLink} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-lg transition-all duration-200 flex items-center space-x-2">
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{linkCopied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button onClick={handleClose} className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium rounded-xl transition-all duration-200 border border-gray-600/30">Close</button>
                  <button onClick={joinRoom} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Join Room</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            // Join Room Tab
            <div className="space-y-6">
              <div>
                <label htmlFor="room-code-input" className="block text-white font-semibold mb-2">Enter Room Code or Link</label>
                <input
                  id="room-code-input"
                  type="text"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  placeholder="Paste the link or code here..."
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleJoinWithCode}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <LogIn className="w-5 h-5" />
                <span>Join with Code</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateCollaborationModal;
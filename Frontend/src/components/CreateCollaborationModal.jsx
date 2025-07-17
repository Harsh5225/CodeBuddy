

import { useState } from "react"
import { useNavigate } from "react-router"
import axiosClient from "../utils/axiosClient"
import { X, Users, Code, Share2, Copy, Check, Sparkles, ArrowRight, AlertCircle } from "lucide-react"

const CreateCollaborationModal = ({ isOpen, onClose, problemId, problemTitle }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [roomLink, setRoomLink] = useState("")
  const [roomId, setRoomId] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [step, setStep] = useState(1) // 1: Create, 2: Share Link
  const [error, setError] = useState("")

  const createRoom = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await axiosClient.post("/collaboration/rooms/create", {
        problemId,
      })

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

  const joinRoom = () => {
    navigate(`/collaborate/${roomId}`)
    onClose()
  }

  const handleClose = () => {
    setStep(1)
    setRoomLink("")
    setRoomId("")
    setLinkCopied(false)
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-10 ">
     <div className=" overflow-auto bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-xl rounded-2xl border border-gray-600/40 shadow-2xl min-w-1/2  max-h-[90vh] relative">
        <div className="z-10 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {step === 1 ? "Start Collaboration" : "Room Created!"}
                </h2>
                <p className="text-gray-400">
                  {step === 1 ? "Code together in real-time" : "Share the link to collaborate"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {step === 1 ? (
            // Step 1: Create Room
            <div className="space-y-6">
              {/* Problem Info */}
              <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center mb-3">
                  <Code className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Problem</h3>
                </div>
                <p className="text-gray-300 font-medium">{problemTitle}</p>
                <p className="text-gray-400 text-sm mt-1">
                  You and your collaborators will work on this problem together
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                  Collaboration Features
                </h3>

                <div className="space-y-2">
                  {[
                    "Real-time code editing",
                    "Live chat while coding",
                    "Shared code execution",
                    "Typing indicators & cursors",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={createRoom}
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl relative overflow-hidden ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-blue-500/25"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Room...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span>Create Collaboration Room</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            // Step 2: Share Link
            <div className="space-y-6">
              {/* Success Message */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300 text-lg">
                  Your collaboration room is ready! Share the link below with your coding partner.
                </p>
              </div>

              {/* Room Link */}
              <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold flex items-center">
                    <Share2 className="w-4 h-4 mr-2 text-blue-400" />
                    Room Link
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                    Room ID: {roomId.slice(0, 8)}...
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={roomLink}
                    readOnly
                    className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{linkCopied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-300 font-semibold mb-2 text-sm">How to collaborate:</h4>
                <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
                  <li>Share the room link with your coding partner</li>
                  <li>Both join the room to start coding together</li>
                  <li>Use the chat to communicate while solving</li>
                  <li>Run and submit code together in real-time</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium rounded-xl transition-all duration-200 border border-gray-600/30"
                >
                  Close
                </button>
                <button
                  onClick={joinRoom}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Join Room</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateCollaborationModal

"use client"

/* eslint-disable no-unused-vars */
import { useParams } from "react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import axiosClient from "../utils/axiosClient"
import { Upload, Video, CheckCircle, AlertCircle, FileVideo, Clock } from "lucide-react"

function AdminUpload() {
  const { problemId } = useParams()

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedVideo, setUploadedVideo] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm()

  const selectedFile = watch("videoFile")?.[0]

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0]

    setUploading(true)
    setUploadProgress(0)
    clearErrors()

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`)
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("signature", signature)
      formData.append("timestamp", timestamp)
      formData.append("public_id", public_id)
      formData.append("api_key", api_key)

      console.log("formadata in adminUpload", formData)
      // Step 3: Upload directly to Cloudinary

      // axios.post ?==>
      // 1. content type is multipart-form data
      // 2. we have to send to cloudinary i.e uploadUrl , axiosClient is already have target base url 3000
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(progress)
        },
      })

      const cloudinaryResult = uploadResponse.data

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post("/video/save", {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      })

      setUploadedVideo(metadataResponse.data.videoSolution)
      reset() // Reset form after successful upload
    } catch (err) {
      console.error("Upload error:", err)
      setError("root", {
        type: "manual",
        message: err.response?.data?.message || "Upload failed. Please try again.",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
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

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl"></div>

          <div className="relative z-10 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Upload Video
              </h2>
              <p className="text-gray-400">Upload educational content for this problem</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* File Input */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FileVideo className="w-4 h-4 mr-2" />
                  Choose video file
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    {...register("videoFile", {
                      required: "Please select a video file",
                      validate: {
                        isVideo: (files) => {
                          if (!files || !files[0]) return "Please select a video file"
                          const file = files[0]
                          return file.type.startsWith("video/") || "Please select a valid video file"
                        },
                        fileSize: (files) => {
                          if (!files || !files[0]) return true
                          const file = files[0]
                          const maxSize = 100 * 1024 * 1024 // 100MB
                          return file.size <= maxSize || "File size must be less than 100MB"
                        },
                      },
                    })}
                    className={`w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 ${
                      errors.videoFile ? "border-red-500/60" : ""
                    }`}
                    disabled={uploading}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                </div>
                {errors.videoFile && (
                  <p className="text-red-400 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.videoFile.message}
                  </p>
                )}
              </div>

              {/* Selected File Info */}
              {selectedFile && (
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <FileVideo className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-blue-300 mb-1">Selected File:</h3>
                      <p className="text-sm text-gray-300">{selectedFile.name}</p>
                      <p className="text-sm text-gray-400">Size: {formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 flex items-center">
                      <Upload className="w-4 h-4 mr-1" />
                      Uploading...
                    </span>
                    <span className="text-purple-400 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.root && (
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">{errors.root.message}</span>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadedVideo && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-green-300 mb-2">Upload Successful!</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Duration: {formatDuration(uploadedVideo.duration)}
                        </p>
                        <p className="text-gray-400">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                type="submit"
                disabled={uploading}
                className={`w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl relative overflow-hidden ${
                  uploading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-purple-500/25"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                {uploading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-lg">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-lg">Upload Video</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUpload

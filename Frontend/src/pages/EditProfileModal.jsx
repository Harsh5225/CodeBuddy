/* eslint-disable no-unused-vars */
"use client";

import { useState, useRef } from "react";
import {
  Edit3,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  User,
  Save,
  Upload,
  Camera,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";

const EditProfileModal = ({ isOpen, onClose, currentUser, onUserUpdate }) => {
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);
  const [editFormData, setEditFormData] = useState({
    location: currentUser?.location || "",
    jobTitle: currentUser?.jobTitle || "",
    level: currentUser?.level || "",
    streak: currentUser?.streak || 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Reset form when modal opens/closes or user changes
  useState(() => {
    if (isOpen && currentUser) {
      setEditFormData({
        location: currentUser.location || "",
        jobTitle: currentUser.jobTitle || "",
        level: currentUser.level || "",
        streak: currentUser.streak || 0,
      });
      setEditError("");
      setEditSuccess(false);
    }
  }, [isOpen, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (editError) setEditError("");
  };

  const validateForm = () => {
    const { location, jobTitle, level, streak } = editFormData;

    // Location validation (optional)
    if (location.trim() && location.trim().length > 50) {
      return "Location must be less than 50 characters";
    }

    // Job title validation (optional)
    if (jobTitle.trim() && jobTitle.trim().length > 100) {
      return "Job title must be less than 100 characters";
    }

    // Level validation (optional)
    if (level.trim() && level.trim().length > 30) {
      return "Level must be less than 30 characters";
    }

    // Streak validation (optional but if provided, must be positive)
    if (streak && (isNaN(streak) || streak < 0)) {
      return "Streak must be a positive number";
    }

    return null;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setEditError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setEditError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any existing errors
      if (editError) setEditError("");
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    const validationError = validateForm();
    if (validationError) {
      setEditError(validationError);
      return;
    }

    setEditLoading(true);
    setEditError("");

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add text fields
      if (editFormData.location.trim())
        formData.append("location", editFormData.location.trim());
      if (editFormData.jobTitle.trim())
        formData.append("jobTitle", editFormData.jobTitle.trim());
      if (editFormData.level.trim())
        formData.append("level", editFormData.level.trim());
      if (editFormData.streak)
        formData.append("streak", editFormData.streak.toString());

      // Add image file if selected
      if (imageFile) {
        formData.append("profilePhoto", imageFile);
      }

      // Use your existing controller endpoint with FormData
      const response = await axiosClient.put("/user/edit-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile update response:", response.data);
      // Your controller returns the user directly
      if (response.data && response.data.success) {
        const updatedUser = response.data.user;
        onUserUpdate(updatedUser);

        setEditSuccess(true);
        setTimeout(() => {
          onClose();
          setEditSuccess(false);
        }, 1500);
      } else {
        setEditError("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setEditError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleClose = () => {
    setEditError("");
    setEditSuccess(false);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Reset form data to current user data
    setEditFormData({
      location: currentUser?.location || "",
      jobTitle: currentUser?.jobTitle || "",
      level: currentUser?.level || "",
      streak: currentUser?.streak || 0,
    });
    onClose();
  };

  const getUserRole = () => {
    return currentUser?.role === "admin" ? "Administrator" : "Developer";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-xl rounded-3xl border border-gray-600/40 shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl"></div>

        <div className="relative z-10 p-8">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <p className="text-gray-400">
                  Update your profile information and preferences
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

          {/* Profile Photo Upload Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl border border-gray-600/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-purple-400" />
              Profile Photo
            </h3>

            <div className="flex items-center space-x-6">
              {/* Current/Preview Image */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-600/50">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : currentUser?.photoUrl ? (
                    <img
                      src={currentUser.photoUrl || "/placeholder.svg"}
                      alt="Current profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {currentUser?.firstName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>

                {imagePreview && (
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={imageUploadLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200 text-purple-300 hover:text-purple-200"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {imageUploadLoading ? "Uploading..." : "Choose Photo"}
                    </span>
                  </button>

                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>

                  {imageFile && (
                    <p className="text-xs text-green-400 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {imageFile.name} selected
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {editSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <span className="text-green-400 font-medium">
                Profile updated successfully!
              </span>
            </div>
          )}

          {/* Error Message */}
          {editError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <span className="text-red-400 font-medium">{editError}</span>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  placeholder="Enter your location (e.g., San Francisco, CA)"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Where are you based? (Optional)
                </p>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editFormData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Enter your job title (e.g., Software Engineer)"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your current role or profession (Optional)
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-green-400" />
                  Skill Level
                </label>
                <select
                  name="level"
                  value={editFormData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                >
                  <option value="">Select your level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Your coding skill level (Optional)
                </p>
              </div>

              {/* Streak */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-400" />
                  Current Streak
                </label>
                <input
                  type="number"
                  name="streak"
                  value={editFormData.streak}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
                  placeholder="Enter your current streak"
                  min={0}
                  max={365}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Days of consecutive problem solving (Optional)
                </p>
              </div>
            </div>
          </div>

          {/* User Info Display */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-700/30 to-gray-600/20 rounded-2xl border border-gray-600/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-400" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">
                  {currentUser?.firstName || "User"}{" "}
                  {currentUser?.lastName || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium">
                  {currentUser?.emailId || currentUser?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role:</span>
                <span className="text-white font-medium">{getUserRole()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Member Since:</span>
                <span className="text-white font-medium">
                  {currentUser?.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium rounded-xl transition-all duration-200 border border-gray-600/30 flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={editLoading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

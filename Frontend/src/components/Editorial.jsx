/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useSubscription } from "../hooks/useSubscription";
import SubscriptionBanner from "./SubscriptionBanner";
import SubscriptionModal from "./SubscriptionModal";
import {
  Pause,
  Play,
  Volume2,
  Maximize,
  SkipBack,
  SkipForward,
  Lock,
} from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const { hasVideoAccess } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(!hasVideoAccess());

  console.log("secure url in Editorial:", secureUrl);
  console.log("thumbnail url in Editorial:", thumbnailUrl);
  console.log("duration in Editorial:", duration);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Clean thumbnail URL if it contains HTML tags
  const cleanThumbnailUrl =
    thumbnailUrl?.replace(/<[^>]*>/g, "").replace(/'/g, "") || "";

  const handleSubscriptionUpdate = (newSubscription) => {
    setShowUpgradeBanner(false);
    setShowSubscriptionModal(false);
    // Refresh video access
  };

  // Show upgrade banner if no video access
  useEffect(() => {
    setShowUpgradeBanner(!hasVideoAccess());
  }, [hasVideoAccess]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    if (!hasVideoAccess()) {
      setShowSubscriptionModal(true);
      return;
    }
    
    if (videoRef.current) {
      setIsLoading(true);
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + seconds)
      );
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadstart", handleLoadStart);
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadstart", handleLoadStart);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, []);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Subscription Banner */}
      <SubscriptionBanner
        show={showUpgradeBanner}
        onClose={() => setShowUpgradeBanner(false)}
        onUpgrade={() => setShowSubscriptionModal(true)}
        feature="video"
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscriptionUpdate={handleSubscriptionUpdate}
      />

      {/* Video Container */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black ring-1 ring-blue-500/20"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Video Element */}
        <div className="relative aspect-video bg-black">
          {!hasVideoAccess() && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Premium Content</h3>
                <p className="text-gray-300 mb-4">Upgrade to Premium to watch video solutions</p>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Unlock Videos
                </button>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            src={secureUrl}
            poster={cleanThumbnailUrl}
            onClick={togglePlayPause}
            className={`w-full h-full object-cover cursor-pointer ${!hasVideoAccess() ? 'blur-sm' : ''}`}
          />

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Play Button Overlay (when paused) */}
          {!isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-sm ring-2 ring-white/20"
              >
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </button>
            </div>
          )}
        </div>

        {/* Video Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-gray-900/80 to-transparent transition-all duration-300 ${
            isHovering || !isPlaying
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="relative group">
              <div className="h-1.5 bg-gray-600/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-500 transition-all duration-150 rounded-full shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Number(e.target.value);
                  }
                }}
                className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
              {/* Skip Back */}
              <button
                onClick={() => skipTime(-10)}
                className="w-10 h-10 bg-gray-800/60 hover:bg-gray-700/80 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-gray-600/30"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack className="w-4 h-4 text-gray-200" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg ring-2 ring-white/10"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play
                    className="w-5 h-5 text-white ml-0.5"
                    fill="currentColor"
                  />
                )}
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skipTime(10)}
                className="w-10 h-10 bg-gray-800/60 hover:bg-gray-700/80 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-gray-600/30"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward className="w-4 h-4 text-gray-200" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2 ml-4">
                <Volume2 className="w-4 h-4 text-gray-300" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1.5 bg-gray-600/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Display */}
              <div className="flex items-center space-x-1 text-gray-200 text-sm font-medium">
                <span className="tabular-nums">{formatTime(currentTime)}</span>
                <span className="text-gray-400">/</span>
                <span className="tabular-nums text-gray-300">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 bg-gray-800/60 hover:bg-gray-700/80 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-gray-600/30"
                aria-label="Enter fullscreen"
              >
                <Maximize className="w-4 h-4 text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="mt-6 p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700/50 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
              Editorial Solution
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Watch this comprehensive explanation of the problem solution with
              step-by-step walkthrough and implementation details.
            </p>
          </div>
          <div className="ml-6 flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium">{formatTime(duration)} duration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;

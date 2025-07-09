import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Problem } from "../models/problem.js";
import { SolutionVideo } from "../models/solutionVideo.js";
dotenv.config();

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// Client-side (browser/mobile app) se directly Cloudinary par video upload karne ke liye secure credentials generate karna. Server Cloudinary ke secret key ko expose kiye bina signature bnata hai.
export const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;

    const userId = req.result._id;
    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;

    // Upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    // This signature is a security measure to ensure that the upload request is authorized.

    //  Server-side signature generate karne se API secret secure rehta hai, client ko nahi bhejna padta.

    // Videos organized rehte hain problem aur user ke hisaab se. leetcode-solutions/ → <problem-id> → <user-id>_<timestamp>.mp4

    // Client direct Cloudinary par upload kar sakta hai, jisse server par load kam hota hai aur upload fast ho sakta hai.

    // Direct Upload:
    // Client sidha Cloudinary par upload karta hai (server bandwidth bachti hai).
    // Upload fast hota hai (Cloudinary CDN use karta hai).

    // [Client] ---(Request Signature)---> [Server]
    // [Server] <---(Credentials)--------- [Cloudinary]
    // [Client] ---(Upload Video)--------> [Cloudinary]
    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,

      // V1_1  VIDEO KA VERSION BATATE HAI, CLOUDINARY KE API MEIN
      
      // DIFFERENT VERSION USE KARNE SE UPLOAD URL CHANGE HO JATA HAI

    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ error: "Failed to generate upload credentials" });
  }
};

// Client se video upload hone ke baad, us video ki metadata (like Cloudinary public ID, URL, duration, etc.) ko database mein save karna, aur kuch validations karna.

export const saveVideoMetadata = async (req, res) => {
  try {
    const { problemId, cloudinaryPublicId, secureUrl, duration } = req.body;

    const userId = req.result._id;
    console.log("userId in saveVideoMetadata:", userId);
    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: "video" }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: "Video not found on Cloudinary" });
    }

    // Check if video already exists for this problem and user
    const existingVideo = await SolutionVideo.findOne({
      problemId,
      userId,
      cloudinaryPublicId,
    });

    if (existingVideo) {
      return res.status(409).json({ error: "Video already exists" });
    }

    // const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
    // resource_type: 'image',
    // transformation: [
    // { width: 400, height: 225, crop: 'fill' },
    // { quality: 'auto' },
    // { start_offset: 'auto' }
    // ],
    // format: 'jpg'
    // });

    const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id, {
      resource_type: "video",
    });

    // https://cloudinary.com/documentation/video_effects_and_enhancements#video_thumbnails
    // Create video solution record
    const videoSolution = await SolutionVideo.create({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl,
    });

    res.status(201).json({
      message: "Video solution saved successfully",
      videoSolution: {
        id: videoSolution._id,
        thumbnailUrl: videoSolution.thumbnailUrl,
        duration: videoSolution.duration,
        uploadedAt: videoSolution.createdAt,
      },
    });
  } catch (error) {
    console.error("Error saving video metadata:", error);
    res.status(500).json({ error: "Failed to save video metadata" });
  }
};

// deleteVideo function ko implement karna, jo ki video ko Cloudinary se delete karega aur database se bhi remove karega.
export const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.result._id;

    const video = await SolutionVideo.findOneAndDelete({
      problemId: problemId,
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
      resource_type: "video",
      invalidate: true,
    });

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
};

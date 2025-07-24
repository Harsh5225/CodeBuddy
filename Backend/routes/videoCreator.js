import express from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { checkVideoAccess } from "../middlewares/subscriptionMiddleware.js";

const videoRouter = express.Router();

import {
  generateUploadSignature,
  saveVideoMetadata,
  deleteVideo,
  getVideoForUser,
} from "../controllers/videoSection.controller.js";

// Admin routes (no subscription check needed)
videoRouter.get("/create/:problemId", adminMiddleware, generateUploadSignature);
videoRouter.post("/save", adminMiddleware, saveVideoMetadata);
videoRouter.delete("/delete/:problemId", adminMiddleware, deleteVideo);

// User routes (require subscription check)
videoRouter.get("/watch/:problemId", checkVideoAccess, getVideoForUser);

export default videoRouter;

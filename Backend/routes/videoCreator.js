import express from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
const videoRouter = express.Router();
// const {
//   generateUploadSignature,
//   saveVideoMetadata,
//   deleteVideo,
// } = require("../controllers/videoSection");

import {
  generateUploadSignature,
  saveVideoMetadata,
  deleteVideo,
} from "../controllers/videoSection.controller.js";
videoRouter.get("/create/:problemId", adminMiddleware, generateUploadSignature);
videoRouter.post("/save", adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId", adminMiddleware, deleteVideo);

export default videoRouter;

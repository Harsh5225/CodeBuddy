import express from "express";
import { getRecentSubmissions } from "../controllers/submission.controller.js";
import { isAuthenticate } from "../middlewares/isAuthenticate.js";

const router = express.Router();

// Get recent submissions for the logged-in user
router.get("/recent", isAuthenticate, getRecentSubmissions);

export default router;

import express from "express";
import { getRecentSubmissions } from "../controllers/submission.controller.js";
import { isAuthenticate } from "../middlewares/isAuthenticate.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { submit,runcode } from "../controllers/submission.controller.js";
const router = express.Router();

// Get recent submissions for the logged-in user
router.get("/recent", isAuthenticate, getRecentSubmissions);
router.post("/submit/:id", userMiddleware, submit);
router.post("/run/:id", userMiddleware, runcode);

export default router;

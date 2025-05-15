import express from "express";
import { runcode, submit } from "../controllers/userSubmission.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/submit/:id", userMiddleware, submit);
router.post("/run/:id", userMiddleware, runcode);

export default router;

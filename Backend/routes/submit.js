import express from "express";
import { submit } from "../controllers/userSubmission.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/submit/:id", userMiddleware, submit);

export default router;

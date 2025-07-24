import express from "express";
import solveDoubt from "../controllers/solveDoubt.controller.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { checkAIAccess, incrementAIUsage } from "../middlewares/subscriptionMiddleware.js";

const router = express.Router();

router.post("/chat", userMiddleware, checkAIAccess, solveDoubt);

export default router;
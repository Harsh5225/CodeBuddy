import express from "express";
import solveDoubt from "../controllers/solveDoubt.controller.js";
const router = express.Router();

router.post("/chat", solveDoubt);

export default router;
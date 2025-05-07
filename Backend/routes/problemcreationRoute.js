// create
//fetch
// update
// delete

import express from "express";
const problemRouter = express.Router();
import { Problem } from "../models/problem.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { createProblem } from "../controllers/userProblem.controller.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

problemRouter.post("/create", userMiddleware, adminMiddleware, createProblem);
// problemRouter.patch("/:id", problemUpdate);
// problemRouter.delete("/:id", problemDelete);

// //* above three needs to be admin protected

// problemRouter.get("/", getAllProblems);
// problemRouter.get("/:id", getAllProblemsById);
// problemRouter.get("/user", solvedAllProblemByUser);

export default problemRouter;

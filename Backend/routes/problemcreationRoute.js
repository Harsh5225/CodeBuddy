// create
//fetch
// update
// delete

import express from "express";
const problemRouter = express.Router();
import { Problem } from "../models/problem.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import {
  allsolvedProblemByUser,
  createProblem,
  deleteProblem,
  getAllproblem,
  getProblem,
  updateProblem,
} from "../controllers/userProblem.controller.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

problemRouter.get("/userSolvedProblem", userMiddleware, allsolvedProblemByUser);
problemRouter.post("/create", userMiddleware, adminMiddleware, createProblem);
problemRouter.patch("/:id", updateProblem);
problemRouter.delete("/:id", deleteProblem);
problemRouter.get("/:id", getProblem);
problemRouter.get("/", getAllproblem);

// //* above three needs to be admin protected

export default problemRouter;

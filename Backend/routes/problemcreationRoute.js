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
  createManyProblems,
  createProblem,
  deleteProblem,
  getAllproblem,
  getProblem,
  submittedProblem,
  updateProblem,
} from "../controllers/userProblem.controller.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

problemRouter.get("/userSolvedProblem", userMiddleware, allsolvedProblemByUser);
problemRouter.post("/create", userMiddleware, adminMiddleware, createProblem);
problemRouter.post(
  "/createMany",
  userMiddleware,
  adminMiddleware,
  createManyProblems
);
problemRouter.patch("/:id", userMiddleware, adminMiddleware, updateProblem);
problemRouter.delete("/:id", userMiddleware, adminMiddleware, deleteProblem);
problemRouter.get("/:id", getProblem);
problemRouter.get("/", getAllproblem);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);

export default problemRouter;

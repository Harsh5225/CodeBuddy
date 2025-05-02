// create
//fetch
// update
// delete

import express from "express";
const problemRouter = express.Router();
import { Problem } from "../models/problem";

problemRouter.post("/create", createProblem);
problemRouter.patch("/:id", problemUpdate);
problemRouter.delete("/:id", problemDelete);

//* above three needs to be admin protected

problemRouter.get("/", getAllProblems);
problemRouter.get("/:id", problemFetch);
problemRouter.get("/user", solvedProblem);

export default problemRouter;

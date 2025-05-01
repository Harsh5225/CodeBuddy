import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { isAuthenticate } from "../middlewares/isAuthenticate.js";

const authRouter = express.Router();

// register
//login
//logout
// get profile
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", isAuthenticate, getProfile);

export default authRouter;

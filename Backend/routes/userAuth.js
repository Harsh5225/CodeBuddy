import express from "express";
import {
  adminRegister,
  getProfile,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { isAuthenticate } from "../middlewares/isAuthenticate.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
const authRouter = express.Router();

// register
//login
//logout
// get profile
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.get("/profile", isAuthenticate, getProfile);
authRouter.post("/adminRegister", userMiddleware, adminRegister);

export default authRouter;

import express from "express";
import {
  adminRegister,
  deleteProfile,
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
authRouter.delete("/delete-profile", userMiddleware, deleteProfile);
authRouter.get("/check", userMiddleware, (req, res) => {
  const reply = {
    firstName: req.userInfo.firstName,
    emailId: req.userInfo.emailId,
    _id: req.userInfo._id,
  };
  res.status(200).json({
    user: reply,
    message: "validUser",
  });
});

export default authRouter;

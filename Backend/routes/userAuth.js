import express from "express";
import {
  adminRegister,
  deleteProfile,
  getProfile,
  login,
  logout,
  register,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { isAuthenticate } from "../middlewares/isAuthenticate.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import upload from "../utils/multer.js";
const authRouter = express.Router();

// register
//login
//logout
// get profile
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", userMiddleware, logout);
authRouter.get("/profile", isAuthenticate, getProfile);
authRouter.post("/adminRegister", userMiddleware, adminRegister);
authRouter.delete("/delete-profile", userMiddleware, deleteProfile);
authRouter.put(
  "/edit-profile",
  userMiddleware,
  upload.single("profilePhoto"),
  updateUserProfile
);
authRouter.get("/check", userMiddleware, (req, res) => {
  const reply = {
    firstName: req.userInfo.firstName,
    emailId: req.userInfo.emailId,
    _id: req.userInfo._id,
    role: req.userInfo.role,
  };
  res.status(200).json({
    user: reply,
    message: "validUser",
  });
});

export default authRouter;

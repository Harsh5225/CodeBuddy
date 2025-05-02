import jwt from "jsonwebtoken";
import client from "../database/redis.js";
import { User } from "../models/user.js";
export const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }

    // Check if token is blocked in Redis
    const isBlocked = await client.exists(`token:${token}`);

    if (isBlocked) {
      throw new Error("Token has been revoked or is invalid");
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = decode;
    console.log(decode, "decode in userMiddleware");
    const result = await User.findById(id);

    console.log(result, "result in userMiddleware");
    req.userInfo = result;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

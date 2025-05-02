import jwt from "jsonwebtoken";
import client from "../database/redis.js";
export const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token)
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }
    const isBlocked = await client.exists(`token:${token}`);
    if (isBlocked) {
      throw new Error("Token has been revoked or is invalid");
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userInfo = decode;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};






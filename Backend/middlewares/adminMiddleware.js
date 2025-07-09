import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import redisClient from "../database/redis.js";
export const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("token in adminMiddleware:", token);
    if (!token) throw new Error("Token is not persent");
    console.log("jwt secret in adminMiddleware",process.env.JWT_SECRET)
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload in admin middleware",payload)
    const { id } = payload;
    if (!id) {
      throw new Error("Invalid token");
    }
    const result = await User.findById(id);
    if (payload.role != "admin") throw new Error("Invalid Token");
    if (!result) {
      throw new Error("User Doesn't Exist");
    }

    // Redis ke blockList mein persent toh nahi hai

    const IsBlocked = await redisClient.exists(`token:${token}`);
    if (IsBlocked) throw new Error("Invalid Token");
    req.result = result;
    next();
  } catch (err) {
    res
      .status(401)
      .send("Error: " + err.message + "error in adminMiddleware.js");
  }
};

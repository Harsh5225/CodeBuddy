import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/userAuth.js";
import client from "./database/redis.js";
import problemRouter from "./routes/problemcreationRoute.js";
import submitRouter from "./routes/submit.js";
import cors from "cors";

const app = express();

dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/problem-submit", submitRouter);

const main = async () => {
  try {
    // await client.connect();
    // await connectDB();
    // then connectDB() wouldn't even start until client.connect() finishes.

    // means both client.connect() and connectDB() will start executing at the same time, in parallel.
    await Promise.all([client.connect(), connectDB()]);

    console.log("mongoDb is connected");
    console.log("Redis is connected");
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Connection issue with db");
  }
};

main();
"// Updated configuration" 

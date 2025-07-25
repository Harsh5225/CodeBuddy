import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/userAuth.js";
import client from "./database/redis.js";
import problemRouter from "./routes/problemcreationRoute.js";
import doubtRouter from "./routes/aiChatRoute.js";
import collaborationRouter from "./routes/collaboration.routes.js";
import { initializeSocket } from "./socket/socketHandlers.js";

import http from "http";
import { Server } from "socket.io";

// import submitRouter from "./routes/submit.js";
import cors from "cors";
import submissionRoutes from "./routes/submission.routes.js";
import videoRouter from "./routes/videoCreator.js";
import subscriptionRouter from "./routes/subscription.routes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
console.log("Using Frontend URL:", process.env.FRONTEND_URL);
app.use(
  cors({
    // 'http://localhost:3000',
    origin: process.env.FRONTEND_URL, // or your frontend domain
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});

app.use(express.json()); // Needed to parse JSON bodies

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/user", authRouter);
app.use("/problem", problemRouter);
// app.use("/problem-submit", submitRouter);
app.use("/submission", submissionRoutes);
app.use("/ai", doubtRouter);
app.use("/video", videoRouter);
app.use("/collaboration", collaborationRouter);
app.use("/subscription", subscriptionRouter);

// Initialize Socket.io
const io = initializeSocket(server);

const main = async () => {
  try {
    // await client.connect();
    // await connectDB();
    // then connectDB() wouldn't even start until client.connect() finishes.

    // means both client.connect() and connectDB() will start executing at the same time, in parallel.
    await Promise.all([client.connect(), connectDB()]);

    console.log("mongoDb is connected");
    console.log("Redis is connected");
    server.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
      console.log("Socket.io server initialized");
    });
  } catch (error) {
    console.log(error);
    console.log("Connection issue with db");
  }
};

main();
("// Updated configuration");

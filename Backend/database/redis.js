import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,

  socket: {
    host: process.env.REDIS_HOST,
    port: 19735,
  },
});

export default client;

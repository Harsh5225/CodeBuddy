import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const client = createClient(
  process.env.REDIS_URL
    ? {
      url: process.env.REDIS_URL,
    }
    : {
      username: "default",
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 17998,
      },
    }
);

export default client;

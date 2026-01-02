import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
// const client = createClient({
//   username: "default",
//   password: process.env.REDIS_PASSWORD,

//   socket: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT || 17998,
//   },
// });

// Temporary Mock for Redis (Disabled)
const client = {
  connect: async () => console.log('Redis (Mock): Connected (Skipped)'),
  on: () => { },
  get: async () => null,
  set: async () => 'OK',
  exists: async () => 0,
  expire: async () => 1,
  expireAt: async () => 1,
  incr: async () => 1,
  decr: async () => 0,
  ttl: async () => -1,
  del: async () => 1,
  json: {
    get: async () => null,
    set: async () => 'OK'
  }
};

export default client;

// lib/redis.js
// import Redis from "ioredis";

// const redis = new Redis(process.env.REDIS_URL);

// export default redis;

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export default redis;

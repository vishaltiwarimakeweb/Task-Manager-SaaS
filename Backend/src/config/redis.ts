import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const redis = createClient({
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
  },
});
redis.on("error", (error) => {
  console.error("Redis connection error : ", error);
});
redis.on("connect", () => {
  console.log("Redis connected");
});
async function shutDown() {
  console.log("Closing redis connection...");
  await redis.quit();
  process.exit(0);
}
process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
export default redis;

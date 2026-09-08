import dotenv from "dotenv";
import { connectToDB } from "./db/db.js";
import { app } from "./app.js";
import redis from "./config/redis.js";
dotenv.config();
const PORT = process.env.PORT || 7000;
const startServer = async () => {
  await connectToDB();
  await redis.connect();
  app.listen(PORT, () => {
    console.log(`Server is running on : ${PORT}`);
  });
};
startServer();

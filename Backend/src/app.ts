import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { taskRouter } from "./routes/task.routes.js";
export const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL!],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/task", taskRouter);

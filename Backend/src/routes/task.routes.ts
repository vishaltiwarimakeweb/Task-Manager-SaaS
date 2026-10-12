import express from "express";
import { verifyUser } from "../middleware/user.middleware.js";
import {
  getTaskController,
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  updateTaskController,
  getAllUpcomingTasksController,
  searchTaskController,
  toggleTaskController,
  getAllFilteredTasksController,
} from "../controllers/task.controller.js";
import { upload } from "../config/multer.js";

export const taskRouter = express.Router();

taskRouter.get("/alltasks/:page/:limit", verifyUser, getAllTasksController);
taskRouter.get(
  "/allfiltertasks/:page/:limit/:filter",
  verifyUser,
  getAllFilteredTasksController,
);
taskRouter.get("/searchtask", verifyUser, searchTaskController);
taskRouter.get(
  "/allupcomingtasks/:page/:limit",
  verifyUser,
  getAllUpcomingTasksController,
);
taskRouter.get("/gettask/:taskId", verifyUser, getTaskController);
taskRouter.post(
  "/createtask",
  verifyUser,
  upload.array("attachments", 5),
  createTaskController,
);
taskRouter.patch(
  "/updatetask/:taskId",
  verifyUser,
  upload.array("attachments", 5),
  updateTaskController,
);
taskRouter.patch("/toggletask/:taskId", verifyUser, toggleTaskController);
taskRouter.delete("/deletetask/:taskId", verifyUser, deleteTaskController);

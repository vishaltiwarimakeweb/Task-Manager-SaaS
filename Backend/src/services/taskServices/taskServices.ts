import type { ObjectIdQueryTypeCasting } from "mongoose";
import { taskModel } from "../../models/task.model.js";
import type { Task } from "../../types/types.js";

export const createTaskService = async (taskData: Task) => {
  const newTask = await taskModel.create(taskData);
  return newTask;
};

export const toggleStatusService = async (
  taskId: ObjectIdQueryTypeCasting,
  status: "pending" | "completed" | "working" | "upcoming",
) => {
  const toggledTask = await taskModel.findByIdAndUpdate(
    taskId,
    { status, addedMs: Date.now() },
    { new: true },
  );
  return toggledTask;
};

export const getTaskService = async (taskId: ObjectIdQueryTypeCasting) => {
  const task = await taskModel.findById(taskId);
  return task;
};

export const deleteTaskService = async (taskId: ObjectIdQueryTypeCasting) => {
  const deletedTask = await taskModel.findByIdAndDelete(taskId);
  return deletedTask;
};

export const updateTaskService = async (
  taskId: ObjectIdQueryTypeCasting,
  data: any,
) => {
  const updatedTask = await taskModel.findByIdAndUpdate(taskId, data, {
    new: true,
  });
  return updatedTask;
};

export const getAllTasksDashboardService = async (
  userId: ObjectIdQueryTypeCasting,
  page: number,
  limit: number,
) => {
  const totalDocs = await taskModel.countDocuments({
    createdBy: userId,
    status: { $ne: "upcoming" },
  });
  const skip = (page - 1) * limit;
  const allTasks = await taskModel
    .find({
      createdBy: userId as any,
      status: { $ne: "upcoming" },
    })
    .limit(limit)
    .skip(skip)
    .sort({ addedMs: -1 });
  return { allTasks, totalDocs };
};

export const getAllFilteredTasksDashboardService = async (
  userId: ObjectIdQueryTypeCasting,
  page: number,
  limit: number,
  filter: string,
) => {
  const totalDocs = await taskModel.countDocuments({
    createdBy: userId,
    status: filter as "pending" | "working" | "completed",
  });
  const skip = (page - 1) * limit;
  const allTasks = await taskModel
    .find({
      createdBy: userId as any,
      status: filter as "pending" | "working" | "completed",
    })
    .limit(limit)
    .skip(skip)
    .sort({ addedMs: -1 });
  return { allTasks, totalDocs };
};

export const getAllUpcomingTasksService = async (
  userId: ObjectIdQueryTypeCasting,
  page: number,
  limit: number,
) => {
  const totalDocs = await taskModel.countDocuments({
    createdBy: userId,
    status: "upcoming",
  });
  const skip = (page - 1) * limit;
  const allTasks = await taskModel
    .find({
      createdBy: userId as any,
      status: "upcoming",
    })
    .limit(limit)
    .skip(skip)
    .sort({ addedMs: -1 });
  return { allTasks, totalDocs };
};

export const upTaskListingService = async (
  userId: ObjectIdQueryTypeCasting,
) => {
  const totalDocs = await taskModel
    .countDocuments({
      createdBy: userId,
      status: "upcoming",
    })
    .select("status");

  return { totalDocs };
};

export const taskListingService = async (userId: ObjectIdQueryTypeCasting) => {
  const totalDocs = await taskModel
    .countDocuments({
      createdBy: userId,
      status: { $ne: "upcoming" },
    })
    .select("status");

  return { totalDocs };
};

export const getSearchTasksService = async (
  userId: ObjectIdQueryTypeCasting,
  keyword: string,
) => {
  const allTasks = await taskModel.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  });
  return allTasks;
};

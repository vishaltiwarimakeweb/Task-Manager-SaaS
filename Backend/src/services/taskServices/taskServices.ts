import type { ObjectIdQueryTypeCasting } from "mongoose";
import { taskModel } from "../../models/task.model.js";
import type { Task } from "../../types/types.js";
import { attachmentModel } from "../../models/attachment.model.js";

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

export const getAttachmentService = async (
  attachmentId: ObjectIdQueryTypeCasting,
) => {
  const attachment = await attachmentModel.findById(attachmentId).lean();
  return attachment;
};

export const createAttachmentService = async (
  key: string,
  originalName: string,
  size: number,
  taskId: ObjectIdQueryTypeCasting,
  contentType: string,
) => {
  const attachment = await attachmentModel.create({
    key,
    originalName,
    size,
    taskId,
    contentType,
  });
  return attachment;
};

export const getAttachmentsByTaskIdService = async (
  taskId: ObjectIdQueryTypeCasting,
) => {
  const allAttachments = await attachmentModel.find({ taskId });
  return allAttachments;
};

export const deleteAttachmentsByTaskIdService = async (
  taskId: ObjectIdQueryTypeCasting,
) => {
  const allAttachments = await attachmentModel.deleteMany({ taskId });
  return allAttachments;
};

export const deleteAttachmentService = async (
  attachmentId: ObjectIdQueryTypeCasting,
) => {
  const deletedAttachment =
    await attachmentModel.findByIdAndDelete(attachmentId);
  return deletedAttachment;
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
  let allTasks = await taskModel
    .find({
      createdBy: userId as any,
      status: { $ne: "upcoming" },
    })
    .limit(limit)
    .skip(skip)
    .sort({ addedMs: -1 })
    .lean();
  const sendTasks: any[] = await Promise.all(
    allTasks.map(async (task) => {
      const attachments = await attachmentModel.find({ taskId: task._id });
      return { ...task, attachments };
    }),
  );
  return { allTasks: sendTasks, totalDocs };
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
    .sort({ addedMs: -1 })
    .lean();
  const sendTasks = await Promise.all(
    allTasks.map(async (task) => {
      const attachments = await attachmentModel.find({ taskId: task._id });

      return { ...task, attachments };
    }),
  );
  console.log("Filtered alltasks : ", sendTasks);
  return { allTasks: sendTasks, totalDocs };
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
    .sort({ addedMs: -1 })
    .lean();
  const sendTasks = await Promise.all(
    allTasks.map(async (task) => {
      const attachments = await attachmentModel.find({ taskId: task._id });

      return { ...task, attachments };
    }),
  );
  return { allTasks: sendTasks, totalDocs };
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

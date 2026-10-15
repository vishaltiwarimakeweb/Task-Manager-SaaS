import { Readable } from "node:stream";
import type { Request, Response } from "express";
import {
  createTaskService,
  deleteTaskService,
  getAllTasksDashboardService,
  getAllUpcomingTasksService,
  getSearchTasksService,
  getTaskService,
  taskListingService,
  toggleStatusService,
  updateTaskService,
  upTaskListingService,
  getAllFilteredTasksDashboardService,
  getAttachmentService,
  deleteAttachmentService,
  createAttachmentService,
  getAttachmentsByTaskIdService,
  deleteAttachmentsByTaskIdService,
} from "../services/taskServices/taskServices.js";
import mongoose, { type ObjectIdQueryTypeCasting } from "mongoose";
import type { Attachment, Task } from "../types/types.js";
import {
  getAllTasksache,
  getAllUpcomingTasksCache,
  getLastPage,
  getUpLastPage,
  setAllTasks,
  setLastPage,
  setAllUpcomingTasks,
  setUpLastPage,
  invalidateAllTasks,
  invalidateLastUpPage,
  invalidateUpcomingAllTasks,
  invalidateLastPage,
} from "../cache/task.cache.js";
import {
  deleteS3Object,
  getS3Object,
  uploadFileToS3,
} from "../config/s3service.js";
import { pipeline } from "node:stream/promises";

export const getAllTasksController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const { page, limit } = req.params;
    const cachedTasks: Task[] | null = await getAllTasksache(
      req.userId as ObjectIdQueryTypeCasting,
      page,
    );
    const lastPageCached = await getLastPage(
      req.userId as ObjectIdQueryTypeCasting,
    );
    if (cachedTasks && lastPageCached) {
      return res.status(200).json({
        message: "All tasks found from cache",
        success: true,
        allTasks: cachedTasks,
        lastPage: lastPageCached,
      });
    }
    const allTasksResponse = await getAllTasksDashboardService(
      req.userId,
      page,
      limit,
    );
    if (!allTasksResponse.allTasks) {
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
    const lastPage = Math.ceil(allTasksResponse.totalDocs / limit);

    if (page <= 0 || (lastPage > 1 && page > lastPage)) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
      });
    }
    await setAllTasks(allTasksResponse.allTasks as Task[], req.userId, page);
    await setLastPage(req.userId, lastPage);
    return res.status(200).json({
      message: "All tasks found",
      success: true,
      allTasks: allTasksResponse.allTasks,
      lastPage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAllFilteredTasksController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const { page, limit, filter } = req.params;
    if (
      filter !== "pending" &&
      filter !== "working" &&
      filter !== "upcoming" &&
      filter !== "completed"
    ) {
      return res.status(400).json({
        message: "Invalid filter type",
        success: false,
      });
    }
    const allTasksResponse = await getAllFilteredTasksDashboardService(
      req.userId,
      page,
      limit,
      filter,
    );
    console.log("Filtered : ", allTasksResponse);
    if (!allTasksResponse.allTasks) {
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
    const lastPage = Math.ceil(allTasksResponse.totalDocs / limit);

    if (page <= 0 || (lastPage > 1 && page > lastPage)) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "All tasks found",
      success: true,
      allTasks: allTasksResponse.allTasks,
      lastPage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAllUpcomingTasksController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const { page, limit } = req.params;
    const cachedUpTasks: Task[] | null = await getAllUpcomingTasksCache(
      req.userId as ObjectIdQueryTypeCasting,
      page,
    );
    const lastUpPageCached = await getUpLastPage(
      req.userId as ObjectIdQueryTypeCasting,
    );

    if (cachedUpTasks && lastUpPageCached) {
      return res.status(200).json({
        message: "All tasks found from cache",
        success: true,
        allTasks: cachedUpTasks,
        lastPage: lastUpPageCached,
      });
    }
    const allTasksResponse = await getAllUpcomingTasksService(
      req.userId,
      page,
      limit,
    );
    if (!allTasksResponse.allTasks) {
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
    const lastPage = Math.ceil(allTasksResponse.totalDocs / limit);
    if (page <= 0 || (lastPage > 1 && page > lastPage)) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
      });
    }

    await setAllUpcomingTasks(
      allTasksResponse.allTasks as any[],
      req.userId,
      page,
    );

    await setUpLastPage(req.userId, lastPage);
    return res.status(200).json({
      message: "All upcoming tasks found",
      success: true,
      allTasks: allTasksResponse.allTasks,
      lastPage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getTaskController = async (req: Request | any, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await getTaskService(taskId as ObjectIdQueryTypeCasting);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }
    if (task.createdBy != req.userId) {
      return res.status(401).json({
        message: "Cannot fetch others's tasks",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Task found",
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const toggleTaskController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({
        message: "Task ID is required",
        success: false,
      });
    }

    const { status } = req.body;
    const actualStatus: string = String(status).trim() as string;
    if (!actualStatus || actualStatus.length === 0) {
      return res.status(400).json({
        message: "Invalid status",
        success: false,
      });
    }
    const task = await toggleStatusService(
      taskId as ObjectIdQueryTypeCasting,
      status,
    );
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }
    if (task.createdBy != req.userId) {
      return res.status(401).json({
        message: "Cannot change other's tasks status",
        success: false,
      });
    }
    if (task.status === "upcoming") {
      const allTasksResponse = await upTaskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateUpcomingAllTasks(req.userId, i);
        await invalidateLastUpPage(req.userId);
      }
    } else {
      const allTasksResponse = await taskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateAllTasks(req.userId as ObjectIdQueryTypeCasting, i);
        await invalidateLastPage(req.userId);
      }
    }
    return res.status(200).json({
      message: `Task marked as ${status}`,
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0],
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      sucess: false,
    });
  }
};

export const searchTaskController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const { keyword } = req.query;
    const actualKeyword = String(keyword).trim();
    if (actualKeyword.length === 0) {
      return res.status(400).json({
        message: "Invalid keyword",
        success: false,
      });
    }
    const allTasks = await getSearchTasksService(req.userId, actualKeyword);
    if (allTasks.length === 0) {
      return res.status(404).json({
        message: `No tasks matched ${actualKeyword}`,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Tasks that contain ${actualKeyword} found`,
      success: true,
      allTasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const createTaskController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const body = req.body;
    const files = (req.files || []) as Express.Multer.File[];
    const { title, description, status, dueDate } = body;
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
        success: false,
      });
    }
    const actualTitle = String(title).trim();
    if (actualTitle.length < 5) {
      return res.status(400).json({
        message: "Title must be atleast 5 characters long",
        success: false,
      });
    }
    const taskData: Task = {
      title: actualTitle,
      description,
      status,
      addedMs: Date.now(),
      createdBy: req.userId,
      dueDate,
    };
    const newTask = await createTaskService(taskData);
    if (files && files.length > 0) {
      await Promise.allSettled(
        files.map(async (file: any) => {
          const key = `tasks/${newTask._id}/${Math.random() * 10000 + Date.now()}-${file.originalname}`;
          const uploadResponse = await uploadFileToS3(
            key,
            file.buffer,
            file.mimetype,
          );
          await createAttachmentService(
            key,
            file.originalname,
            file.size,
            newTask._id,
            file.mimetype,
          );
        }),
      );
    }
    if (newTask.status === "upcoming") {
      const allTasksResponse = await upTaskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateUpcomingAllTasks(req.userId, i);
        await invalidateLastUpPage(req.userId);
      }
    } else {
      const allTasksResponse = await taskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateAllTasks(req.userId as ObjectIdQueryTypeCasting, i);
        await invalidateLastPage(req.userId);
      }
    }

    return res.status(201).json({
      message: "Task created successfully",
      success: true,
      task: newTask,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0],
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateTaskController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const body = req.body;
    const files = (req.files || []) as Express.Multer.File[];
    const { taskId } = req.params;
    const { title, description, status, dueDate, page } = body;
    if (!taskId) {
      return res.status(400).json({
        message: "Task ID is required",
        success: false,
      });
    }
    const task = await getTaskService(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }
    if (task.createdBy != req.userId) {
      return res.status(401).json({
        message: "Cannot update others's tasks",
        success: false,
      });
    }
    const taskData: any = {};
    if (title) taskData.title = title;
    if (description) taskData.description = description;
    if (status) taskData.status = status;
    if (dueDate) taskData.dueDate = dueDate;
    const attachments: Attachment[] = [];
    if (files && files.length > 0) {
      await Promise.allSettled(
        files.map(async (file: any) => {
          const key = `tasks/${task._id}/${Date.now() + Math.random() * 1000}-${file.originalname}`;
          await uploadFileToS3(key, file.buffer, file.mimetype);
          const attachment = await createAttachmentService(
            key,
            file.originalname,
            file.size,
            task._id,
            file.mimetype,
          );
          attachments.push(attachment);
        }),
      );
    }
    taskData.addedMs = Date.now();
    const updatedTask = await updateTaskService(task._id, taskData);
    if (!updatedTask) {
      return res.status(500).json({
        message: "Something went wrong",
        success: false,
      });
    }
    if (task.status !== updatedTask.status) {
      const allUpTasksResponse = await upTaskListingService(req.userId);
      const lastUpPage = Math.ceil(allUpTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastUpPage; i++) {
        await invalidateUpcomingAllTasks(req.userId, i);
        await invalidateLastUpPage(req.userId);
      }
      const allTasksResponse = await taskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateAllTasks(req.userId as ObjectIdQueryTypeCasting, i);
        await invalidateLastPage(req.userId);
      }
    } else if (
      updatedTask.status === "upcoming" &&
      task.status === "upcoming"
    ) {
      const allTasksResponse = await upTaskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateUpcomingAllTasks(req.userId, i);
        await invalidateLastUpPage(req.userId);
      }
    } else if (
      task.status !== "upcoming" &&
      updatedTask.status !== "upcoming"
    ) {
      const allTasksResponse = await taskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateAllTasks(req.userId as ObjectIdQueryTypeCasting, i);
        await invalidateLastPage(req.userId);
      }
    }
    return res.status(200).json({
      message: "Task updated successfully",
      success: true,
      task: updatedTask,
      attachments: attachments.length > 0 ? attachments : null,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0],
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const deleteTaskController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const { taskId } = req.params;
    const { page } = req.body;
    const task = await getTaskService(taskId as ObjectIdQueryTypeCasting);
    if (!task) {
      return res.status(404).json({
        message: "Task not found or alrady deleted",
        succes: false,
      });
    }
    if (task.createdBy != req.userId) {
      return res.status(401).json({
        message: "Cannot delete others's tasks",
        success: false,
      });
    }
    const deletedTask = await deleteTaskService(taskId);
    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found or already deleted",
        success: false,
      });
    }
    if (task.status !== deletedTask.status) {
      const allUpTasksResponse = await upTaskListingService(req.userId);
      const lastUpPage = Math.ceil(allUpTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastUpPage; i++) {
        await invalidateUpcomingAllTasks(req.userId, i);
        await invalidateLastUpPage(req.userId);
      }
      const allTasksResponse = await taskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);
      const allAttachments = await getAttachmentsByTaskIdService(taskId);
      await Promise.all(
        allAttachments.map(async (attachment) => {
          await deleteS3Object(attachment.key);
        }),
      );
      await deleteAttachmentsByTaskIdService(taskId);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateAllTasks(req.userId as ObjectIdQueryTypeCasting, i);
        await invalidateLastPage(req.userId);
      }
    } else if (
      deletedTask.status === "upcoming" &&
      task.status === "upcoming"
    ) {
      const allTasksResponse = await upTaskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateUpcomingAllTasks(req.userId, i);
        await invalidateLastUpPage(req.userId);
      }
    } else if (
      task.status !== "upcoming" &&
      deletedTask.status !== "upcoming"
    ) {
      const allTasksResponse = await taskListingService(req.userId);
      const lastPage = Math.ceil(allTasksResponse.totalDocs / 5);

      for (let i = 1; i <= lastPage; i++) {
        await invalidateAllTasks(req.userId as ObjectIdQueryTypeCasting, i);
        await invalidateLastPage(req.userId);
      }
    }
    return res.status(200).json({
      message: "Task deleted successfully",
      success: true,
      task: deletedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const downloadAttachmentController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const { attachmentId } = req.params;
    if (!attachmentId) {
      return res.status(400).json({
        message: "Attachment ID not found",
        success: false,
      });
    }
    const attachment = await getAttachmentService(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        message: "Attachment not found",
        success: false,
      });
    }
    const task = await getTaskService(attachment.taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    if (!task.createdBy !== req.userId) {
      return res.status(403).json({
        message: "Cannot download other's attachments",
        success: false,
      });
    }
    const s3Response = await getS3Object(attachment.key);
    const body = s3Response.Body;

    if (!body) {
      return res.status(404).json({
        success: false,
        message: "File content not found",
      });
    }

    const nodeStream = Readable.fromWeb(
      body.transformToWebStream() as import("node:stream/web").ReadableStream,
    );

    await pipeline(nodeStream, res);
  } catch (error) {
    console.error(error);
    if (res.headersSent) {
      res.destroy(error instanceof Error ? error : undefined);
      return;
    }
    return res.status(500).json({
      message: "Error while downloading the file",
      success: false,
    });
  }
};

export const deleteAttachmentController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const { attachmentId } = req.params;
    const attachment = await getAttachmentService(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        message: "Attachment not found or already deleted",
        success: false,
      });
    }
    const task = await getTaskService(attachment.taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }
    if (task.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        message: "Cannot delete other's attachments",
        success: false,
      });
    }
    await deleteS3Object(attachment.key);
    const deletedAttachment = await deleteAttachmentService(attachmentId);
    const lastPage = await getLastPage(req.userId);
    if (lastPage) {
      for (let i = 1; i <= lastPage; i++)
        await invalidateAllTasks(req.userId as ObjectIdQueryTypeCasting, i);
    }

    return res.status(200).json({
      message: "Attachment deleted",
      success: true,
      attachment: deletedAttachment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

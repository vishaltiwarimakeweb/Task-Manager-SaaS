import type { ObjectIdQueryTypeCasting } from "mongoose";
import redis from "../config/redis.js";
import type { Task } from "../types/types.js";

export const getAllTasksache = async (
  userId: ObjectIdQueryTypeCasting,
  page: number,
): Promise<Task[] | null> => {
  const cachedTasks = await redis.get(`allTasks:${userId}:${page}`);
  return cachedTasks ? JSON.parse(cachedTasks) : null;
};

export const getLastPage = async (
  userId: ObjectIdQueryTypeCasting,
): Promise<null | number> => {
  const lastPage = await redis.get(`lastPage:${userId}`);
  return lastPage ? JSON.parse(lastPage) : null;
};

export const getUpLastPage = async (
  userId: ObjectIdQueryTypeCasting,
): Promise<null | number> => {
  const lastPage = await redis.get(`lastUpPage:${userId}`);
  return lastPage ? JSON.parse(lastPage) : null;
};

export const getAllUpcomingTasksCache = async (
  userId: ObjectIdQueryTypeCasting,
  page: number,
): Promise<Task[] | null> => {
  const cachedTasks = await redis.get(`allUpcomingTasks:${userId}:${page}`);
  return cachedTasks ? JSON.parse(cachedTasks) : null;
};

export const setAllTasks = async (
  tasks: Task[],
  userId: ObjectIdQueryTypeCasting,
  page: number,
) => {
  await redis.set(`allTasks:${userId}:${page}`, JSON.stringify(tasks));
};

export const setLastPage = async (
  userId: ObjectIdQueryTypeCasting,
  lastPage: number,
) => {
  await redis.set(`lastPage:${userId}`, JSON.stringify(lastPage));
};

export const setUpLastPage = async (
  userId: ObjectIdQueryTypeCasting,
  lastPage: number,
) => {
  await redis.set(`lastUpPage:${userId}`, JSON.stringify(lastPage));
};

export const setAllUpcomingTasks = async (
  tasks: Task[],
  userId: ObjectIdQueryTypeCasting,
  page: number,
) => {
  await redis.set(`allUpcomingTasks:${userId}:${page}`, JSON.stringify(tasks));
};

export const invalidateAllTasks = async (
  userId: ObjectIdQueryTypeCasting,
  page: number,
) => {
  await redis.del(`allTasks:${userId}:${page}`);
};

export const invalidateLastPage = async (userId: ObjectIdQueryTypeCasting) => {
  await redis.del(`lastPage:${userId}`);
};

export const invalidateUpcomingAllTasks = async (
  userId: ObjectIdQueryTypeCasting,
  page: number,
) => {
  await redis.del(`allUpcomingTasks:${userId}:${page}`);
};

export const invalidateLastUpPage = async (
  userId: ObjectIdQueryTypeCasting,
) => {
  await redis.del(`lastUpPage:${userId}`);
};

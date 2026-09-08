import type { ObjectId, ObjectIdQueryTypeCasting } from "mongoose";

export type User = {
  email: string;
  name: string;
  avatar: string;
  password: string;
};
export type MongoUser = {
  _id: ObjectIdQueryTypeCasting;
  email: string;
  name: string;
  avatar: string;
  password: string;
};
export type LoginUser = {
  email: string;
  password: string;
};
export type Task = {
  title: string;
  description: string | null;
  status: "pending" | "completed" | "working" | "upcoming";
  addedMs: number;
  createdBy: ObjectIdQueryTypeCasting;
  dueDate: string | null;
};
export type MongoTask = {
  _id: ObjectIdQueryTypeCasting;
  title: string;
  description: string | null;
  status: "pending" | "completed" | "working" | "upcoming";
  addedMs: number;
  createdBy: ObjectIdQueryTypeCasting;
};

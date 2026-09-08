import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be atleast 5 characters long"],
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "working", "upcoming"],
      required: [true, "Status is required"],
    },
    dueDate: {
      type: String,
      default: null,
    },
    addedMs: {
      type: Number,
      required: [true, "Timestamp is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Task author's reference is required"],
    },
  },
  { timestamps: true, strict: true },
);
export const taskModel = mongoose.model("task", taskSchema);

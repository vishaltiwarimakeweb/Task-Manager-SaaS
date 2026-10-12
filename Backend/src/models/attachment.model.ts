import mongoose from "mongoose";
const attachmentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Attachment's key is required"],
    },
    originalName: {
      type: String,
      required: [true, "Attachment's name is required"],
    },
    contentType: {
      type: String,
      required: [true, "Attachment's type is required"],
    },
    size: {
      type: Number,
      required: [true, "Attachment size is required"],
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      required: [true, "Task ID is required"],
    },
  },
  { timestamps: true, strict: true },
);
attachmentSchema.index({ taskId: 1 });
export const attachmentModel = mongoose.model("attachment", attachmentSchema);

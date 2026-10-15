import {
  CalendarDays,
  Pencil,
  X,
  Paperclip,
  FileText,
  Trash2,
} from "lucide-react";
import {
  AttachmentResponse,
  Task,
  TaskAndAttachmentsResponse,
  TaskForm,
  TaskResponse,
} from "../types/types";
import { Dispatch, SetStateAction, useState } from "react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addAttachmentReducer,
  addTask,
  addUpcomingTask,
  deleteAttachmentReducer,
  deleteTask,
  deleteUpcomingTask,
  updateAttachments,
  updateTask,
  updateUpcomingTask,
} from "../redux/slices/taskSlice";
import ButtonLoader from "./ButtonLoader";
interface EditTaskProps {
  task: Task;
  openEditModal: boolean;
  openModal: boolean;
  page: number;
  upPage: number;
  setOpenEditModal: React.Dispatch<SetStateAction<boolean>>;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
  showTasks: Task[];
  setShowTasks: Dispatch<SetStateAction<Task[]>>;
  showUpTasks: Task[];
  setShowUpTasks: Dispatch<SetStateAction<Task[]>>;
}
function EditTaskModal({
  task,
  openEditModal,
  setOpenEditModal,
  page,
  upPage,
  openModal,
  setOpenModal,
  showTasks,
  setShowTasks,
  showUpTasks,
  setShowUpTasks,
}: EditTaskProps) {
  const dispatch = useAppDispatch();
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [delBtn, setDelBtn] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [vanishTask, setVanishTask] = useState<boolean>(false);
  const [form, setForm] = useState<TaskForm>({
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
  });
  const onChangeFunc = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const editTask = async () => {
    try {
      setBtnLoading(true);
      const response = await fetch(
        `${baseURL}/api/task/updatetask/${task._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...form, page }),
        },
      );
      const editData: TaskResponse = await response.json();
      if (editData.success) {
        // successEmitter(editData.message, toasterTheme);
        setOpenEditModal(false);
        setOpenModal(!openModal);
        if (editData.task.status === "upcoming") {
          dispatch(addUpcomingTask(editData));
          dispatch(deleteTask(editData));
          setShowUpTasks((prev) => [...prev, editData.task]);
          setShowTasks((prev) =>
            prev.filter((t) => t._id !== editData.task._id),
          );
        } else {
          dispatch(updateTask(editData));
          setShowTasks((prev) =>
            prev.map((t) => (t._id === editData.task._id ? editData.task : t)),
          );
        }
      } else errorEmitter(editData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };
  const editUpcomingTask = async () => {
    try {
      setBtnLoading(true);
      const formData = new FormData();
      if (form.title) {
        formData.append("title", form.title);
      }
      if (form.description) {
        formData.append("description", form.description);
      }
      if (form.dueDate) {
        formData.append("dueDate", form.dueDate);
      }
      if (form.status) {
        formData.append("status", form.status);
      }
      formData.append("page", String(upPage));
      if (attachments.length > 0) {
        attachments.map((file) => formData.append("attachments", file));
      }
      const response = await fetch(
        `${baseURL}/api/task/updatetask/${task._id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        },
      );
      const editData: TaskAndAttachmentsResponse = await response.json();
      if (editData.success) {
        //successEmitter(editData.message, toasterTheme);
        setOpenEditModal(false);
        setOpenModal(!openModal);
        if (editData.task.status === "upcoming") {
          dispatch(updateUpcomingTask(editData));
          setShowUpTasks((prev) =>
            prev.map((t) => (t._id === editData.task._id ? editData.task : t)),
          );
        } else {
          dispatch(deleteUpcomingTask(editData));
          dispatch(addTask(editData));
          if (editData.attachments) updateAttachments(editData);
          setShowUpTasks((prev) =>
            prev.filter((t) => t._id !== editData.task._id),
          );
          setShowTasks((prev) => [...prev, editData.task]);
        }
      } else errorEmitter(editData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteAttachment = async (attachmentId: string) => {
    try {
      setDelBtn(true);
      const response = await fetch(
        `${baseURL}/api/task/deleteattachment/${attachmentId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const deleteData: AttachmentResponse = await response.json();
      // console.log("Delete data : ", deleteData);
      if (deleteData.success) {
        setVanishTask(!vanishTask);
        dispatch(deleteAttachmentReducer(deleteData));
      } else errorEmitter(deleteData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setDelBtn(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Pencil className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Edit task
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Update the details of your task.
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={() => setOpenEditModal(!openEditModal)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 px-6 py-6">
          {/* Title */}
          <div>
            <label
              htmlFor="edit-title"
              className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Task title
            </label>

            <input
              id="edit-title"
              type="text"
              name="title"
              value={form.title}
              onChange={onChangeFunc}
              defaultValue="Design the landing page"
              placeholder="Enter task title"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-description"
              className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Description
            </label>

            <textarea
              id="edit-description"
              rows={4}
              value={form.description}
              onChange={onChangeFunc}
              name="description"
              defaultValue="Create a modern and responsive landing page for the new product."
              placeholder="Describe the task..."
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          {/* Status + Due Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Status */}
            <div>
              <label
                htmlFor="edit-status"
                className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Status
              </label>

              <select
                id="edit-status"
                name="status"
                value={form.status}
                onChange={onChangeFunc}
                defaultValue="working"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="working">Working</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="edit-due-date"
                className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Due date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="edit-due-date"
                  name="dueDate"
                  value={form.dueDate as string}
                  onChange={onChangeFunc}
                  type="date"
                  defaultValue="2026-09-15"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Attachments */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="edit-attachments"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Attachments
            </label>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              Optional
            </span>
          </div>
          <label
            htmlFor="edit-attachments"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Paperclip className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Add attachments
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Choose files related to this task
              </p>
            </div>

            <span className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
              Choose files
            </span>

            <input
              id="edit-attachments"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setAttachments(Array.from(e.target.files));
                }
              }}
            />
          </label>
          {/* Selected files */}
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      setAttachments((prev) =>
                        prev.filter((_, fileIndex) => fileIndex !== index),
                      );
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Existing Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div
              style={{
                animation: vanishTask
                  ? `vanishTask 0.5s linear forwards`
                  : `none`,
              }}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                <Paperclip className="h-4 w-4 text-indigo-500" />
                Existing attachments ({task.attachments.length})
              </div>

              <div className="space-y-2">
                {task.attachments.map((attachment) => (
                  <div
                    key={attachment._id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      <FileText className="h-4 w-4" />
                    </div>

                    <p
                      title={attachment.originalName}
                      className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      {attachment.originalName}
                    </p>

                    <button
                      type="button"
                      disabled={delBtn}
                      aria-label={`Delete ${attachment.originalName}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    >
                      <Trash2
                        onClick={async () => {
                          await deleteAttachment(attachment._id);
                        }}
                        className="h-4 w-4"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            disabled={btnLoading}
            onClick={() => setOpenEditModal(!openEditModal)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={btnLoading}
            onClick={async () =>
              task.status === "upcoming"
                ? await editUpcomingTask()
                : await editTask()
            }
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {btnLoading ? (
              <ButtonLoader buttonMessage="Saving Changes..." />
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;

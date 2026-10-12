"use client";
import {
  CalendarDays,
  ChevronDown,
  Plus,
  Paperclip,
  FileText,
  X,
} from "lucide-react";
import { useState } from "react";
import { TaskForm, TaskResponse } from "../types/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { addTask, addUpcomingTask } from "../redux/slices/taskSlice";
import ButtonLoader from "../components/ButtonLoader";
import { useRouter } from "next/navigation";

export default function CreateTaskPage() {
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const onChangeFunc = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const router = useRouter();
  const addTaskFunc = async () => {
    try {
      setBtnLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("status", form.status);
      if (form.dueDate) {
        formData.append("dueDate", form.dueDate);
      }
      attachments.map((file) => formData.append(`attachments`, file));
      const response = await fetch(`${baseURL}/api/task/createtask`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const addData: TaskResponse = await response.json();
      if (addData.success) {
        successEmitter(addData.message, toasterTheme);
        if (addData.task.status === "upcoming") {
          dispatch(addUpcomingTask(addData));
        } else dispatch(addTask(addData));
        router.push("/dashboard");
      } else errorEmitter(addData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Plus size={22} strokeWidth={2.2} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Create a new task
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add the details below to create and organize your task.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await addTaskFunc();
          }}
        >
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800 sm:px-8">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Task details
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Provide the basic information for your task.
              </p>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Task title
                </label>

                <input
                  id="title"
                  value={form.title}
                  name="title"
                  onChange={onChangeFunc}
                  type="text"
                  required
                  placeholder="e.g. Design the landing page"
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={form.description}
                  onChange={onChangeFunc}
                  placeholder="Describe what needs to be done..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-500"
                />
              </div>

              {/* Status + Due Date */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    Status
                  </label>

                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={onChangeFunc}
                      defaultValue="pending"
                      className="h-11 w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="working">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="upcoming">Upcoming</option>
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label
                    htmlFor="dueDate"
                    className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    Due date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="dueDate"
                      name="dueDate"
                      onChange={onChangeFunc}
                      type="date"
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              {/* Attachments */}
              <div>
                {attachments.length > 5 && (
                  <p className="text-red-600">
                    You cannot upload more than 5 files per task
                  </p>
                )}
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="attachments"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    Attachments
                  </label>

                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Optional
                  </span>
                </div>

                <label
                  htmlFor="attachments"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-7 text-center transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-blue-500 dark:hover:bg-blue-950/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Paperclip size={19} />
                  </div>

                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Add attachments
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Upload files related to this task
                  </p>

                  <span className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                    <Paperclip size={14} />
                    Choose files
                  </span>

                  <input
                    id="attachments"
                    type="file"
                    disabled={attachments.length > 5}
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
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          <FileText size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                            {file.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setAttachments((prev) =>
                              prev.filter(
                                (_, fileIndex) => fileIndex !== index,
                              ),
                            );
                          }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-end sm:px-8">
              <button
                type="reset"
                onClick={() => router.push("/dashboard")}
                className="h-10 rounded-xl border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={btnLoading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <Plus size={17} />
                {btnLoading ? (
                  <ButtonLoader buttonMessage="Creating task..." />
                ) : (
                  "Create task"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

import {
  CheckCircle2,
  Circle,
  Icon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Task, TaskCardProps, TaskResponse } from "../types/types";
import { dateFormatter } from "../utils/dateFormatter";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateTask } from "../redux/slices/taskSlice";
import ButtonLoader from "./ButtonLoader";
import { useState } from "react";
import DeleteTaskModal from "./DeleteTaskModal";
import { timeCalc } from "../utils/timeCalculator";
import EditTaskModal from "./EditTaskModal";

function TaskCard({
  task,
  page,
  upPage,
  showTasks,
  setShowTasks,
  showUpTasks,
  setShowUpTasks,
}: TaskCardProps) {
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const toggleStatus = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/task/toggletask/${task._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: task.status === "completed" ? "pending" : "completed",
          }),
        },
      );
      const toggleData: TaskResponse = await response.json();
      if (toggleData.success) {
        //  successEmitter(toggleData.message, toasterTheme);
        dispatch(updateTask(toggleData));
        setShowTasks((prev) =>
          prev.map((t) => (t._id === toggleData.task._id ? toggleData.task : t)),
        );
      } else errorEmitter(toggleData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div
        key={task.title}
        className="flex items-start gap-4 px-5 py-5 sm:px-6"
      >
        {/* Checkbox visual */}
        <button
          type="button"
          aria-label={`Mark ${task.title} as complete`}
          className="mt-0.5 shrink-0 text-slate-300 transition-colors hover:text-indigo-500 dark:text-slate-600 dark:hover:text-indigo-400"
        >
          {task.status === "completed" ? (
            <CheckCircle2
              onClick={toggleStatus}
              className="h-5 w-5 text-emerald-500"
            />
          ) : (
            <Circle onClick={toggleStatus} className="h-5 w-5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3
              className={`text-sm font-semibold ${
                task.status === "completed"
                  ? "text-slate-400 line-through dark:text-slate-500"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {task.title}
            </h3>
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-500">
            {task.description}
          </p>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            Updated{" "}
            {task.addedMs ? (
              timeCalc(task.addedMs)
            ) : (
              <ButtonLoader buttonMessage="Loading last updated..." />
            )}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`text-xs font-medium ${
                task.status === "completed"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : task.status === "working"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-yellow-600 dark:text-yellow-500"
              }`}
            >
              {task.status ? (
                task.status.slice(0, 1).toUpperCase() + task.status.slice(1)
              ) : (
                <ButtonLoader buttonMessage="Loading status..." />
              )}
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <span className="text-xs text-slate-500 dark:text-slate-500">
              Due :{" "}
              {task.dueDate
                ? dateFormatter(task.dueDate as string)
                : "( No due date )"}
            </span>
          </div>
        </div>

        {/* Task actions */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenModal(!openModal)}
            aria-label={`More options for ${task.title}`}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Task action modal */}
          {openModal && (
            <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-indigo-800">
              <button
                type="button"
                onClick={() => setOpenEditModal(!openEditModal)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Edit task
              </button>
              {openEditModal && (
                <EditTaskModal
                  page={page}
                  upPage={upPage}
                  task={task}
                  openModal
                  setOpenModal={setOpenModal}
                  openEditModal
                  setOpenEditModal={setOpenEditModal}
                  showTasks={showTasks}
                  setShowTasks={setShowTasks}
                  showUpTasks={showUpTasks}
                  setShowUpTasks={setShowUpTasks}
                />
              )}
              <button
                type="button"
                onClick={() => setOpenDeleteModal(!openDeleteModal)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-4 w-4" />
                Delete task
              </button>

              {openDeleteModal && (
                <DeleteTaskModal
                  task={task}
                  page={page}
                  setOpenModal={setOpenModal}
                  openModal
                  openDeleteModal
                  setOpenDeleteModal={setOpenDeleteModal}
                  showTasks={showTasks}
                  setShowTasks={setShowTasks}
                  showUpTasks={showUpTasks}
                  setShowUpTasks={setShowUpTasks}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TaskCard;

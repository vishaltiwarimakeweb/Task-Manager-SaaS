import React, { useState } from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { TaskResponse, UpcomingTaskCardProps } from "../types/types";
import { dateFormatter } from "../utils/dateFormatter";
import EditTaskModal from "./EditTaskModal";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteUpcomingTask } from "../redux/slices/taskSlice";

function UpcomingTaskCard({
  task,
  page,
  upPage,
  showTasks,
  setShowTasks,
  showUpTasks,
  setShowUpTasks,
}: UpcomingTaskCardProps) {
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showAnim, setShowAnim] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const deleteTaskHandler = async () => {
    try {
      setBtnLoading(true);
      const response = await fetch(
        `${baseURL}/api/task/deletetask/${task._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            page,
          }),
        },
      );
      const deleteData: TaskResponse = await response.json();
      if (deleteData.success) {
        successEmitter(deleteData.message, toasterTheme);
        dispatch(deleteUpcomingTask(deleteData));
        setShowUpTasks((prev) =>
          prev.filter((t) => t._id !== deleteData.task._id),
        );
        setOpenModal(!openModal);
      } else errorEmitter(deleteData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div
      style={{
        animation: showAnim ? `vanishTask 0.6s linear forwards` : `none`,
      }}
      className="group rounded-lg p-3 overflow-x-hidden transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {/* Title + Actions */}
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-200">
          {task.title}
        </p>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Edit */}
          <button
            type="button"
            disabled={btnLoading}
            onClick={() => setOpenEditModal(!openEditModal)}
            aria-label="Edit task"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            disabled={btnLoading}
            onClick={async () => {
              setShowAnim(!showAnim);
              await deleteTaskHandler();
            }}
            aria-label="Delete task"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Due date */}
      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />

        <span>
          Due : {task.dueDate ? dateFormatter(task.dueDate) : "No due date"}
        </span>
      </div>
      {openEditModal && !btnLoading && (
        <EditTaskModal
          task={task}
          openEditModal
          page={page}
          upPage={upPage}
          openModal
          setOpenEditModal={setOpenEditModal}
          setOpenModal={setOpenModal}
          showTasks={showTasks}
          setShowTasks={setShowTasks}
          showUpTasks={showUpTasks}
          setShowUpTasks={setShowUpTasks}
        />
      )}
    </div>
  );
}

export default UpcomingTaskCard;

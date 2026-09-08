import { AlertTriangle, X } from "lucide-react";
import { Task, TaskResponse } from "../types/types";
import { SetStateAction, useState } from "react";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteTask } from "../redux/slices/taskSlice";
import ButtonLoader from "./ButtonLoader";

interface DeleteTaskModalProps {
  task: Task;
  openDeleteModal: boolean;
  setOpenDeleteModal: React.Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
  page: number;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
}

function DeleteTaskModal({
  task,
  openDeleteModal,
  setOpenDeleteModal,
  openModal,
  page,
  setOpenModal,
}: DeleteTaskModalProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const dispatch = useAppDispatch();
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
        dispatch(deleteTask(deleteData));
        setOpenDeleteModal(!openDeleteModal);
        setOpenModal(!openModal);
      } else errorEmitter(deleteData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <button
            type="button"
            aria-label="Close modal"
            onClick={() => setOpenDeleteModal(!openDeleteModal)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Content */}
        <div className="px-5 pb-5 pt-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Delete task?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Are you sure you want to delete this task{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              &quot;{task.title}&quot;
            </span>
            ?
          </p>

          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            This action cannot be undone.
          </p>
        </div>
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            disabled={btnLoading}
            onClick={() => setOpenDeleteModal(!openDeleteModal)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={btnLoading}
            onClick={deleteTaskHandler}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          >
            {btnLoading ? (
              <ButtonLoader buttonMessage="Deleting Task..." />
            ) : (
              "Delete task"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;

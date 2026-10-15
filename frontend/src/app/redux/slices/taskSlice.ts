import {
  AttachmentResponse,
  MultipleTasksResponse,
  Task,
  TaskAndAttachmentsResponse,
  TaskResponse,
} from "@/app/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface InititalState {
  tasks: Task[];
  lastPage: number;
  upcomingTasks: Task[];
  upLastPage: number;
  fetchTasks: boolean;
}
const initialState: InititalState = {
  tasks: [],
  lastPage: 1,
  upcomingTasks: [],
  upLastPage: 1,
  fetchTasks: true,
};
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setAllApiTasks(state, action: PayloadAction<MultipleTasksResponse>) {
      state.tasks = action.payload.allTasks;
      state.lastPage = action.payload.lastPage;
    },
    setAllApiUpcomingTasks(
      state,
      action: PayloadAction<MultipleTasksResponse>,
    ) {
      state.upcomingTasks = action.payload.allTasks;
      state.upLastPage = action.payload.lastPage;
    },
    setLastPageReducer(state, action: PayloadAction<number>) {
      state.lastPage = action.payload;
    },
    setAllTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    setAllUpcomingTasks(state, action: PayloadAction<Task[]>) {
      state.upcomingTasks = action.payload;
    },
    updateTask(state, action: PayloadAction<TaskResponse>) {
      state.tasks = state.tasks.map((task) => {
        if (task._id === action.payload.task._id) {
          task = action.payload.task;
        }
        return task;
      });
    },
    updateUpcomingTask(state, action: PayloadAction<TaskResponse>) {
      state.upcomingTasks = state.upcomingTasks.map((task) => {
        if (task._id === action.payload.task._id) {
          task = action.payload.task;
        }
        return task;
      });
    },
    addTask(state, action: PayloadAction<TaskResponse>) {
      state.tasks.push(action.payload.task);
    },
    addUpcomingTask(state, action: PayloadAction<TaskResponse>) {
      state.upcomingTasks.push(action.payload.task);
    },
    deleteTask(state, action: PayloadAction<TaskResponse>) {
      state.tasks = state.tasks.filter(
        (task) => task._id !== action.payload.task._id,
      );
    },
    deleteUpcomingTask(state, action: PayloadAction<TaskResponse>) {
      state.upcomingTasks = state.upcomingTasks.filter(
        (task) => task._id !== action.payload.task._id,
      );
    },
    modifyReFetch(state) {
      state.fetchTasks = !state.fetchTasks;
    },
    addAttachmentReducer(state, action: PayloadAction<AttachmentResponse>) {
      state.tasks = state.tasks.map((task) => {
        if (action.payload.attachment.taskId === task._id) {
          task.attachments.push(action.payload.attachment);
        }
        return task;
      });
    },
    deleteAttachmentReducer(state, action: PayloadAction<AttachmentResponse>) {
      state.tasks = state.tasks.map((task) => {
        if (action.payload.attachment.taskId === task._id) {
          task.attachments = task.attachments.filter(
            (attachment) => attachment._id !== action.payload.attachment._id,
          );
        }
        return task;
      });
    },
    updateAttachments(
      state,
      action: PayloadAction<TaskAndAttachmentsResponse>,
    ) {
      state.tasks = state.tasks.map((task) => {
        if (task._id === action.payload.task._id) {
          task.attachments = [
            ...task.attachments,
            ...action.payload.attachments,
          ];
        }
        return task;
      });
    },
  },
});
export const {
  setAllTasks,
  setAllApiTasks,
  deleteTask,
  updateTask,
  addTask,
  setAllApiUpcomingTasks,
  setAllUpcomingTasks,
  addUpcomingTask,
  updateUpcomingTask,
  deleteUpcomingTask,
  setLastPageReducer,
  modifyReFetch,
  addAttachmentReducer,
  deleteAttachmentReducer,
  updateAttachments,
} = taskSlice.actions;
export default taskSlice.reducer;

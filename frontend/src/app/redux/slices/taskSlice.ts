import { MultipleTasksResponse, Task, TaskResponse } from "@/app/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface InititalState {
  tasks: Task[];
  lastPage: number;
  upcomingTasks: Task[];
  upLastPage: number;
}
const initialState: InititalState = {
  tasks: [],
  lastPage: 1,
  upcomingTasks: [],
  upLastPage: 1,
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
} = taskSlice.actions;
export default taskSlice.reducer;

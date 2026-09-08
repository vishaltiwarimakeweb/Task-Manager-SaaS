import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectAllTasks = (state: RootState) => state.task.tasks;

export const selectPendingTasks = createSelector([selectAllTasks], (allTasks) =>
  allTasks.filter((task) => task.status === "pending"),
);

export const selectCompletedTasks = createSelector(
  [selectAllTasks],
  (allTasks) => allTasks.filter((task) => task.status === "completed"),
);

export const selectProgressTasks = createSelector(
  [selectAllTasks],
  (allTasks) => allTasks.filter((task) => task.status === "working"),
);

export const selectUpcomingTasks = createSelector(
  [selectAllTasks],
  (allTasks) => allTasks.filter((task) => task.status === "upcoming"),
);

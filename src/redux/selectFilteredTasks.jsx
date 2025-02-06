import { createSelector } from "@reduxjs/toolkit";

export const selectTasks = (state) => state.tasks?.tasks || [];

export const selectFilteredTasks = createSelector(
  [selectTasks],
  (tasks) =>
    tasks.filter((task) => {
      // Add filtering logic here if required
      return task;
    })
);

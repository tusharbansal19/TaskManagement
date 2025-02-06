import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    weeklyStats: [
    ],
    searchQuery: "",
  },
  reducers: {
    getAllTask: (state, action) => {
      state.tasks=action.payload.tasks;
      // state.tasks.push({ ...action.payload, id: Date.now(), status: "incomplete" });
      console.log("neiofcnhoehfciawhdc", state.tasks)
      
    },

    addTask: (state, action) => {
      state.tasks.push({ ...action.payload, id: Date.now(), status: "incomplete" });
    },
    editTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedTask };
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) task.status = task.status === "completed" ? "incomplete" : "completed";
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    reorderTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  getAllTask,
  toggleTaskCompletion,
  setSearchQuery,
  reorderTasks,
} = taskSlice.actions;

export default taskSlice.reducer;

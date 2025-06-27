import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './redux/TaskDetails';
import dashboardReducer from './redux/dashboardSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    dashboard: dashboardReducer,
  },
});

export default store;

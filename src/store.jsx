import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './redux/TaskDetails';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

export default store;

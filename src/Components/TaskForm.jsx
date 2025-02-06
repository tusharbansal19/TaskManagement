import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const TaskForm = ({ onSubmit }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    setTask({ title: '', description: '', dueDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '10px' }}>
      <TextField
        name="title"
        label="Task Title"
        value={task.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="description"
        label="Task Description"
        value={task.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="dueDate"
        label="Due Date"
        type="date"
        value={task.dueDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Add Task
      </Button>
    </form>
  );
};

export default TaskForm;

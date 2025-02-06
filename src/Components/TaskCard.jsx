import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const TaskCard = ({ task, onDelete, onToggle }) => {
  return (
    <Card className='w-md' style={{ margin: '10px', background: '#2e2e3c', color: '#fff' }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
        <Typography variant="body2">Due: {task.dueDate}</Typography>
        <Typography variant="body2">
          Status: {task.completed ? 'Completed' : 'Pending'}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => onToggle(task.id)}>
          {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
        </Button>
        <Button variant="contained" color="secondary" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

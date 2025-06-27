import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, IconButton, Divider } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Delete, Schedule } from '@mui/icons-material';

const TaskCard = ({ task, onDelete, onToggle }) => {
  const isCompleted = task.completed;
  
  return (
    <Card 
      sx={{ 
        margin: '12px 0',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
          borderColor: '#d1d5db'
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: isCompleted ? '#10b981' : '#3b82f6',
          transition: 'background-color 0.2s ease'
        }
      }}
    >
      <CardContent sx={{ padding: '20px !important' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          {/* Completion Toggle Icon */}
          <IconButton
            onClick={() => onToggle(task.id)}
            sx={{
              padding: '4px',
              marginTop: '-2px',
              color: isCompleted ? '#10b981' : '#9ca3af',
              '&:hover': {
                backgroundColor: isCompleted ? '#ecfdf5' : '#f3f4f6',
                color: isCompleted ? '#059669' : '#6b7280'
              }
            }}
          >
            {isCompleted ? <CheckCircle /> : <RadioButtonUnchecked />}
          </IconButton>
          
          {/* Task Title and Status */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: isCompleted ? '#6b7280' : '#111827',
                  textDecoration: isCompleted ? 'line-through' : 'none',
                  lineHeight: 1.3,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {task.title}
              </Typography>
              <Chip 
                label={isCompleted ? 'Completed' : 'In Progress'} 
                size="small"
                sx={{
                  backgroundColor: isCompleted ? '#ecfdf5' : '#eff6ff',
                  color: isCompleted ? '#065f46' : '#1d4ed8',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: '24px',
                  borderRadius: '6px',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            </Box>
            
            {/* Task Description */}
            <Typography 
              variant="body2" 
              sx={{ 
                color: isCompleted ? '#9ca3af' : '#6b7280',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {task.description}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#f3f4f6' }} />
        
        {/* Footer Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Due Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ fontSize: '16px', color: '#9ca3af' }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280',
                fontSize: '0.8125rem',
                fontWeight: 500
              }}
            >
              Due: {task.dueDate}
            </Typography>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined"
              size="small"
              onClick={() => onToggle(task.id)}
              sx={{
                borderColor: isCompleted ? '#d1d5db' : '#3b82f6',
                color: isCompleted ? '#6b7280' : '#3b82f6',
                backgroundColor: 'transparent',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                borderRadius: '8px',
                px: 2,
                py: 0.5,
                minWidth: 'auto',
                height: '32px',
                '&:hover': {
                  backgroundColor: isCompleted ? '#f9fafb' : '#eff6ff',
                  borderColor: isCompleted ? '#9ca3af' : '#2563eb'
                }
              }}
            >
              {isCompleted ? 'Restore' : 'Complete'}
            </Button>
            
            <IconButton
              onClick={() => onDelete(task.id)}
              size="small"
              sx={{
                color: '#ef4444',
                backgroundColor: 'transparent',
                width: '32px',
                height: '32px',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                  color: '#dc2626'
                }
              }}
            >
              <Delete sx={{ fontSize: '18px' }} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
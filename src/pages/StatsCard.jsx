import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { CheckCircle, Warning } from "@mui/icons-material";

const StatsCard = () => {
  const totalTasks = 20; // Example value
  const completedTasks = 14; // Example value
  const pendingTasks = totalTasks - completedTasks;

  return (
    <Card
      sx={{
        backgroundColor: "#2C2B5A",
        color: "#FFFFFF",
        "&:hover": {
          transform: "scale(1.05)",
          transition: "transform 0.3s",
          boxShadow: 6,
          cursor: "pointer",
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Task Completion Stats
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <Box>
            <Typography variant="h6">Completed Tasks</Typography>
            <IconButton color="primary">
              <CheckCircle />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="h6">Pending Tasks</Typography>
            <IconButton color="secondary">
              <Warning />
            </IconButton>
          </Box>
        </Box>
        <Typography>
          Total Tasks: {totalTasks} | Completed: {completedTasks} | Pending: {pendingTasks}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

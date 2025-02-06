import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const CompletionProgressCard = () => {
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
          Task Completion Progress
        </Typography>
        <Typography>
          Percentage of tasks completed vs total tasks:
        </Typography>
        <Box
          sx={{
            height: "20px",
            backgroundColor: "#3498DB",
            width: "100%",
            margin: "10px auto",
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "70%", // Adjust dynamically based on completion percentage
              backgroundColor: "#8E44AD",
              borderRadius: "10px",
            }}
          />
        </Box>
        <Typography align="center">70% Completed</Typography>
      </CardContent>
    </Card>
  );
};

export default CompletionProgressCard;

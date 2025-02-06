import React from "react";

const TaskCompletionProgressCard = ({ tasks }) => {
  // Calculate completed and incomplete tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const incompleteTasks = tasks.filter(task => task.status === "incomplete").length;

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-[#2C2B5A] text-white p-4 rounded-lg max-w-[80%] mx-auto md:max-w-full pb-4 shadow-md hover:scale-105 transition-transform duration-300 flex flex-col">
      <h2 className="text-xl font-bold mb-4  underline mx-auto">Task Completion Progress</h2>
      <p className="mb-2">Percentage of tasks completed vs total tasks:</p>
      <div className="w-4/5 mx-auto bg-blue-500 h-5 rounded-full relative mb-4">
        <div
          className="bg-purple-600 h-full rounded-full"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className="text-center">{Math.round(completionPercentage)}% Completed</p>
    </div>
  );
};

export default TaskCompletionProgressCard;

import React from "react";
import { TrendingUp, TaskAlt } from "@mui/icons-material";

const PerformanceHighlightsCard = () => {
  return (
    <div className="bg-[#2C2B5A] text-white p-4 rounded-lg max-w-[80%]  mt-4  md:mt-0 mx-auto md:max-w-full shadow-md hover:scale-105 transition-transform duration-300 flex flex-col">
      <h2 className="text-xl font-bold mb-4  underline mx-auto">Performance Highlights</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center sm:gap-0 gap-4 mb-4">
        <div className="flex flex-col items-center">
          <p className="text-lg text-center">Task Trends</p>
          <div className="text-green-500">
            <TrendingUp />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg text-center">Completed Tasks</p>
          <div className="text-blue-500">
            <TaskAlt />
          </div>
        </div>
      </div>
      <p className="text-center">
        Task completion rates are improving, with a steady upward trend over the
        week.
      </p>
    </div>
  );
};

export default PerformanceHighlightsCard;

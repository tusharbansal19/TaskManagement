import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const BarChartCard = ({taskPerformanceData}) => {
  return (
    <div className="bg-[#2C2B5A] text-white pr-2 py-3  max-w-[80%] mx-auto md:max-w-full p-3 sm:p-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 w-full flex flex-col">
      <h2 className="text-xl sm:text-lg font-bold mb-4 sm:mb-2 pl-3 mx-auto underline">
        Task Performance (Daily)
      </h2>
      <div className="flex justify-center w-full ">
        {/* Responsive Container for dynamic sizing */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={taskPerformanceData}>
            <XAxis dataKey="name" stroke="#FFFFFF" />
            <YAxis stroke="#FFFFFF" />
            <Tooltip />
            <Bar dataKey="Completed" fill="#8E44AD" />
            <Bar dataKey="Incomplete" fill="#3498DB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend for bar colors */}
      <div className="flex justify-center mt-4 space-x-4">
        <div className="flex items-center">
          <span
            className="w-4 h-4 bg-[#8E44AD] inline-block rounded-full mr-2"
            aria-hidden="true"
          ></span>
          <span className="text-sm sm:text-base">Completed</span>
        </div>
        <div className="flex items-center">
          <span
            className="w-4 h-4 bg-[#3498DB] inline-block rounded-full mr-2"
            aria-hidden="true"
          ></span>
          <span className="text-sm sm:text-base">Incomplete</span>
        </div>
      </div>
      <p className="text-center mt-4 text-sm sm:text-base">
        The bar chart highlights completed and incomplete tasks on a daily
        basis.
      </p>
    </div>
  );
};

export default BarChartCard;

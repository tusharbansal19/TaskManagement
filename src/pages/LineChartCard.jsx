import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



const LineChartCard = ({taskPerformanceData}) => {
  return (
    <div className="bg-[#2C2B5A] text-white p-4 sm:p-3 rounded-lg  max-w-[90%] mx-auto md:max-w-full shadow-md hover:scale-102 transition-transform duration-300 w-full flex flex-col">
      <h2 className="text-xl sm:text-lg font-bold mb-4 sm:mb-2 mx-auto underline">
        Weekly Task Trends
      </h2>
      <div className="flex justify-center w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={taskPerformanceData}>
            <XAxis dataKey="name" stroke="#FFFFFF" />
            <YAxis stroke="#FFFFFF" />
            <CartesianGrid stroke="#555555" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Completed"
              stroke="#8E44AD"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Incomplete"
              stroke="#3498DB"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center mt-4 text-sm sm:text-base">
        The line chart tracks the trend of tasks completed and incomplete over
        the week.
      </p>
    </div>
  );
};

export default LineChartCard;

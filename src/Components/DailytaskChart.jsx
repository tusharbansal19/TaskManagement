import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer as LineResponsiveContainer } from "recharts";

const DailyLineChart = ({ tasks }) => {
  // Calculate total time and consumed time
  const totalTime = tasks.reduce((acc, task) => {
    const taskStartTime = new Date(task.important.startTime).getTime();
    const taskEndTime = new Date(task.important.endTime).getTime();
    return acc + (taskEndTime - taskStartTime);
  }, 0);

  const consumedTime = tasks.reduce((acc, task) => {
    const taskStartTime = new Date(task.important.startTime).getTime();
    const taskEndTime = new Date(task.important.endTime).getTime();
    // We assume that the consumed time is based on completed tasks
    if (task.status === "completed" || task.status === "in-progress") {
      return acc + (taskEndTime - taskStartTime);
    }
    return acc;
  }, 0);

  const remainingTime = totalTime - consumedTime;

  // Pie chart data
  const pieData = [
    { name: "Consumed Time", value: consumedTime },
    { name: "Remaining Time", value: remainingTime },
  ];

  // Line chart data (Task Duration)
  const labels = tasks.map((task) => task.title);
  const lineData = tasks.map((task) => {
    const startTime = new Date(task.important.startTime).getTime();
    const endTime = new Date(task.important.endTime).getTime();
    return { name: task.title, duration: endTime - startTime }; // Duration in milliseconds
  });

  return (
    <div className="p-4 sm:p-8 w-full bg-[#2C2B5A] text-white rounded-lg shadow-lg max-w-4xl mx-auto  flex  justify-between items-center ">
      {/* Line Chart for Task Duration */}
      <div className="mb-8 w-full ">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Task Duration vs Time</h3>
        <div className="bg-white p-4 rounded-lg shadow-md flex">
          <LineResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#FF5733"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </LineResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart for Time Consumption */}
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold mb-4  min-w-[40%] text-center">Time Consumption</h3>
        <div className="  rounded-lg shadow-md ">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={5} fill="#8884d8" label>
                <Cell fill="#FF5733" />
                <Cell fill="#4CAF50" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Details Below the Charts */}
      <div className="mt-8 space-y-4 ">
        <div className="text-center">
          <h4 className="text-lg font-semibold">Total Time</h4>
          <p className="text-md text-gray-200">{(totalTime / (1000 * 60 * 60)).toFixed(2)} hours</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-semibold">Consumed Time</h4>
          <p className="text-md text-gray-200">{(consumedTime / (1000 * 60 * 60)).toFixed(2)} hours</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-semibold">Remaining Time</h4>
          <p className="text-md text-gray-200">{(remainingTime / (1000 * 60 * 60)).toFixed(2)} hours</p>
        </div>
      </div>
    </div>
  );
};

export default DailyLineChart;

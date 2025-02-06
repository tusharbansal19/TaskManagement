import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

const Calendar = ({tasks}) => {
   // Assuming tasks are stored in Redux
  const [showCompleted, setShowCompleted] = useState(false);

  const today = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const filteredTasks = (day) =>
    tasks.filter(
      (task) =>
        isSameDay(new Date(task.dueDate), day) &&
        (showCompleted ? task.status === "completed" : task.status !== "completed")
    );

  return (
    <div className="bg-[#2C2B5A] text-white p-6 rounded-lg shadow-md w-full   max-w-[80%]  md:max-w-full mx-auto">
      {/* Month Display */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold  underline mx-auto">Calender-{format(today, "MMMM yyyy")}</h2>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg font-medium transition-colors text-[10px] sm:text-[20px] ${
            !showCompleted ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setShowCompleted(false)}
        >
          Incomplete Tasks
        </button>
        <button
          className={`px-2 py-2 rounded-r-lg font-medium transition-colors text-[10px] sm:text-[20px] ${
            showCompleted ? "bg-green-500 text-white" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setShowCompleted(true)}
        >
          Completed Tasks
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-xs sm:text-base">
        {/* Render Day Names */}
        {["Su", "Mn", "Tu", "Wd", "Th", "Fr", "St"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}

        {daysInMonth.map((day) => {
          const dayTasks = filteredTasks(day);
          const hasCompletedTasks = dayTasks.some((task) => task.status === "completed");
          const hasIncompleteTasks = dayTasks.some((task) => task.status !== "completed");

          return (
            <div
              key={format(day, "d")}
              className={` w-fit h-fit p-0.5 sm:p-2  flex items-center justify-center text-lg font-semibold text-[0.4rem] sm:text-[1rem] rounded-full
                 ${hasCompletedTasks ? "bg-green-700" : hasIncompleteTasks ? "bg-red-700" : "bg-gray-700"}`}
            >
              <div className="text-white">{format(day, "d")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

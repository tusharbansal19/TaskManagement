import React, { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-toastify";

import PieChartCard from "./PieChartCard";
import BarChartCard from "./BarChartCard";
import LineChartCard from "./LineChartCard";
import TaskCompletionProgressCard from "./TaskCompletionProgressCard";
import PerformanceHighlightsCard from "./PerformanceHighlightsCard";
import TaskManager from "./Taskmanager";
import BackToTopButton from "../Components/tButton";
import ScrollToTaskManagerButton from "./taskbarscrooling";
import ReactCalender from "./Calander";

const Dashboard = () => {
 
  const [loading, setLoading] = useState(false);
  const [taskUpdateLoading, setTaskUpdateLoading] = useState(null);
  const [tasks, setTasks] = useState([]);
 
  // ✅ Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://taskserver-ts96.onrender.com/api/tasks/get",
          { token: localStorage.getItem("token") },
          { headers: { "Content-Type": "application/json" } }
        );

        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks!", { theme: "dark" });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [taskUpdateLoading]);

  // ✅ Count Completed & Incomplete Tasks
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const incompleteTasks = tasks.filter((task) => task.status !== "completed").length;

  // ✅ Pie Chart Data
  const pieData = [
    { name: "Completed", value: completedTasks },
    { name: "Incomplete", value: incompleteTasks },
  ];

  // ✅ Function to convert full weekday names to short forms
  const getShortDayName = (dateString) => {
    const dayMapping = {
      
      "sunday": "Su",
      
      "monday": "M",
      
      "tuesday": "Tu",
      
      "wednesday": "W",
      
      "thursday": "Th",
      
      "friday": "F",
      
      "saturday": "S",
    };
  
  
    // Get full name
    console.log(dateString, "→ Converted to:", dayMapping[dateString]); // Debugging
    return dayMapping[dateString] ; // Return short name or full name if missing
  };
  

  // ✅ Generate Task Performance Data dynamically
  const generateTaskPerformanceData = () => {
    const dayWiseData = {};

    tasks.forEach((task) => {
      const day = getShortDayName(task.day); // Convert task date to short day name
      if (!dayWiseData[day]) {
        dayWiseData[day] = { Completed: 0, Incomplete: 0 };
      }
      if (task.status === "completed") {
        dayWiseData[day].Completed += 1;
      } else {
        dayWiseData[day].Incomplete += 1;
      }
    });

    // Ensure all days are represented
    const allDays = ["M", "Tu", "W", "Th", "F", "S", "Su"];
    return allDays.map((day) => ({
      name: day,
      Completed: dayWiseData[day]?.Completed || 0,
      Incomplete: dayWiseData[day]?.Incomplete || 0,
    }));
  };

  const taskPerformanceData = generateTaskPerformanceData();

  return (
    <div className="sm:p-6 md:pl-40 bg-gray-900 min-h-screen pt-16">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8">
        Task Performance Dashboard
      </h1>

      {/* Show Loader if tasks are loading */}
      {loading ? (
       <div className="w-full flex justify-center mt-4 h-full items-center  fixed  top-0 left-0  bg-black bg-opacity-30 z-[110]">
       <div className="w-12 h-12 border-4 border-dotted border-red-600 border-t-transparent rounded-full animate-spin"></div>
     </div>
      ) : (
        <div className="flex flex-col gap-y-3 sm:gap-6">
          {/* Row 1: Pie and Bar Charts */}
          <div className="flex flex-col md:flex-row gap-y-4 sm:gap-6">
            <div className="flex-1">
              <PieChartCard pieData={pieData} />
            </div>
            <div className="flex-1">
              <BarChartCard taskPerformanceData={taskPerformanceData} />
            </div>
          </div>

          {/* Row 2: Line Chart */}
          <div className="w-full">
            <LineChartCard taskPerformanceData={taskPerformanceData} />
          </div>

          {/* Row 3: Calendar */}
          <div className="w-full">
            <ReactCalender tasks={tasks}/>
          </div>

          {/* Row 4: Task Completion & Performance Highlights */}
          <div className="flex flex-col md:flex-row gap-1 sm:gap-6">
            <div className="flex-1 min-w-[250px]">
              <TaskCompletionProgressCard tasks={tasks} incompleteTasks={incompleteTasks} />
            </div>
            <div className="flex-1 min-w-[250px]">
              <PerformanceHighlightsCard taskPerformanceData={taskPerformanceData} />
            </div>
          </div>
        </div>
      )}

      {/* Back-to-Top Button */}
      <div className="fixed right-4 bottom-4 z-50">
        <BackToTopButton />
        <ScrollToTaskManagerButton />
      </div>

      {/* Task Manager Section */}
      <div id="task-manager" className="mt-10 w-full border-t-4 border-[#2C2B5A]">
        <div className="flex gap-x-3 p-4">
          <div className="rounded-full h-2 w-full bg-[#2C2B5A]"></div>
          <div className="rounded-full h-2 w-full bg-[#2C2B5A]"></div>
        </div>
        <TaskManager setTaskUpdateLoading={setTaskUpdateLoading} />
      </div>

      {/* Show Loader if tasks are updating */}
      {taskUpdateLoading && <div className="text-center text-white">Updating tasks...</div>}
    </div>
  );
};

export default Dashboard;

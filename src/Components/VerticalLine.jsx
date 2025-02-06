import React, { useState, useEffect, useRef } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const TaskTimeline = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const timelineRef = useRef(null);
  

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePointClick = (task) => {
    setSelectedTask(task);
  };

  const isOverdue = (dueDate) => new Date(dueDate) < currentTime;

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const formatTaskTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const calculateTimerPosition = () => {
    if (!tasks || tasks.length === 0 || !timelineRef.current) {
      return 0;
    }

    const firstTaskStartTime = new Date(tasks[0].important.startTime).getTime();
    const lastTaskEndTime = new Date(tasks[tasks.length - 1].important.endTime).getTime();
    const now = currentTime.getTime();

    if (now <= firstTaskStartTime) {
      return 0;
    }
    if (now >= lastTaskEndTime) {
      return timelineRef.current.offsetHeight;
    }

    const progress = (now - firstTaskStartTime) / (lastTaskEndTime - firstTaskStartTime);
    return progress * timelineRef.current.offsetHeight;
  };

  const timerPosition = calculateTimerPosition();

  return (
    <div
      className="bg-[#2C2B5A] text-white p-4 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto relative"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6">
        Task Timeline
      </h2>

      <div
        className="relative"
        ref={timelineRef}
        style={{ position: "relative", height: "100%" }}
      >
        {/* Floating Time Display */}
        <div
          className="absolute left-0 w-full h-1 bg-red-600"
          style={{
            top: `${timerPosition + 30}px`,
            zIndex: 1000,
          }}
        >
          <div
            className="absolute left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Vertical Timeline */}
        <VerticalTimeline>
          {tasks.map((task, index) => (
            <VerticalTimelineElement
              key={task.id}
              className={`vertical-timeline-element--work hover:shadow-xl transition duration-300 ease-in-out ${
                index % 2 === 0 ? "vertical-timeline-element-left" : "vertical-timeline-element-right"
              }`}
              date={<span className="text-sm sm:text-base">{task.dueDate}</span>}
              iconStyle={{
                background: index % 2 === 0 ? "rgb(33, 150, 243)" : "rgb(233, 30, 99)",
                color: "#fff",
              }}
              contentStyle={{
                borderTop: `4px solid ${isOverdue(task.dueDate) ? "red" : "#4caf50"}`,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                color: "#fff",
              }}
              contentArrowStyle={{ borderRight: "7px solid rgba(255, 255, 255, 0.1)" }}
              icon={index % 2 === 0 ? <FaHourglassHalf /> : <FaCheckCircle />}
              onClick={() => handlePointClick(task)}
            >
              <h3 className="vertical-timeline-element-title text-lg sm:text-xl font-semibold hover:text-yellow-300">
                {task.title}
              </h3>
              <p className="vertical-timeline-element-description text-sm sm:text-base text-gray-300">
              </p>

              {/* Display task time range */}
              {task.important && task.important.startTime && task.important.endTime && (
                <p className="text-sm sm:text-base text-gray-400 mt-2">
                  <strong>Time:</strong> {formatTaskTime(task.important.startTime, task.important.endTime)}
                </p>
              )}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="mt-8 bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 hover:underline">{selectedTask.title}</h3>
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            <strong>Description:</strong> {selectedTask.description}
          </p>
          <p className="text-base sm:text-lg font-semibold text-gray-700">
            <strong>Due Date:</strong> {selectedTask.dueDate}
          </p>
          {selectedTask.important && selectedTask.important.startTime && selectedTask.important.endTime && (
            <p className="text-base sm:text-lg font-semibold text-gray-700 mt-2">
              <strong>Time:</strong> {formatTaskTime(selectedTask.important.startTime, selectedTask.important.endTime)}
            </p>
          )}
        </div>
      )}




    </div>





  );
};

export default TaskTimeline;

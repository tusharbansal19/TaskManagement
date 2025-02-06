import React from "react";

const ScrollToTaskManagerButton = () => {
  const scrollToTaskManager = () => {
    const taskManagerElement = document.getElementById("task-manager");
    taskManagerElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTaskManager}
      className="bg-[#8E44AD] text-white fixed z-[90] top-20 right-0 p-2 rounded-l-full shadow-lg hover:bg-[#9b59b6] transition duration-300"
    >
      Go to Task Manager
    </button>
  );
};

export default ScrollToTaskManagerButton;

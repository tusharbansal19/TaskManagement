import React from "react";

const Recommendations = ({ recommendations, onSelect }) => {
  if (!recommendations.length) return null;

  return (
    <div className="absolute bg-white text-black rounded shadow-lg p-2 w-full">
      {recommendations.map((task) => (
        <div
          key={task.id}
          onClick={() => onSelect(task)}
          className="p-2 hover:bg-gray-200 cursor-pointer"
        >
          {task.title}
        </div>
      ))}
    </div>
  );
};

export default Recommendations;

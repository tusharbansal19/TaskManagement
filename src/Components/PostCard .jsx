import React, { useState } from "react";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskCard = ({ task }) => {
  const [filteredTasks, setFilteredTasks] = useState([task]);

  // Handle the drag-and-drop functionality
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(filteredTasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setFilteredTasks(reorderedTasks);
  };

  // Handle task completion toggle
  const handleToggleCompletion = (id) => {
    const updatedTasks = filteredTasks.map((task) =>
      task.id === id ? { ...task, status: task.status === "completed" ? "incomplete" : "completed" } : task
    );
    setFilteredTasks(updatedTasks);
  };

  // Handle task deletion
  const handleDeleteTask = (id) => {
    const updatedTasks = filteredTasks.filter((task) => task.id !== id);
    setFilteredTasks(updatedTasks);
  };

  // Handle task editing (Placeholder for edit functionality)
  const handleEditTask = (id) => {
    console.log(`Editing task with id: ${id}`);
    // Add logic for editing task
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full mx-4 text-black shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col md:flex-row">
        <div className="w-full">
          <h1
            className="text-2xl font-bold mb-4 p-4"
            style={{
              background: "purple",
            }}
          >
            {task.title}
          </h1>

          <div className="flex pt-0 pb-6 ml-3">
            {/* Description */}
            <p className="text-sm mt-2">
              <span className="bold text-[0.5rem]">Description:</span>
              <div className="h-20 overflow-y-scroll p-2 min-w-[100px] text-amber-800 rounded-lg bg-gray-50">
                <p>{task.description}</p>
              </div>
            </p>

            {/* Due Date */}
            <p className="text-sm mt-2">
              <span className="bold text-[0.5rem]">Due Date:</span>
    
                <p>{task.dueDate}</p>
           
            </p>

            {/* Status */}
            <p className="text-sm mt-2">
              <span className="bold text-[0.5rem]">Status:</span>
              <div className="h-10 overflow-y-scroll p-2 text-amber-800 rounded-lg bg-gray-50">
                <p>{task.status}</p>
              </div>
            </p>

            <div className="flex items-center space-x-4 mt-4 text-gray-600 transition-all duration-300 justify-between w-full pr-20">
              {/* Task Actions */}
              <div className="flex gap-2">
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleEditTask(task.id)}
                />
                <FaCheck
                  className="text-green-500 cursor-pointer"
                  onClick={() => handleToggleCompletion(task.id)}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </div>

            {/* Drag-and-Drop Task Section */}
            <Droppable droppableId="tasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`shadow-md rounded-lg p-4 border ${
                            task.dueDate === new Date().toISOString().split("T")[0] ? "bg-red-100" : ""
                          }`}
                        >
                          <div className="flex justify-between">
                            <h2 className="text-lg font-semibold">{task.title}</h2>
                            <div className="flex gap-2">
                              <FaEdit
                                className="text-blue-500 cursor-pointer"
                                onClick={() => handleEditTask(task.id)}
                              />
                              <FaCheck
                                className="text-green-500 cursor-pointer"
                                onClick={() => handleToggleCompletion(task.id)}
                              />
                              <FaTrash
                                className="text-red-500 cursor-pointer"
                                onClick={() => handleDeleteTask(task.id)}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TaskCard;

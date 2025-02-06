import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaCheck, FaTrash, FaPlus } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskCard = ({
  task,
  setEditingTask,
  setModalOpen,
  handleToggleCompletion,
  setTaskToDelete,
  setDeleteModalOpen,
}) => {
  const [filteredTasks, setFilteredTasks] = useState([task]);
  const [remainingTime, setRemainingTime] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Calculate remaining time
  useEffect(() => {
    //////////console.log(task,"lwnmdwiafcaeh")
    const calculateRemainingTime = () => {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      const diff = dueDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setRemainingTime(`${days}d ${hours}h ${minutes}m`);
      } else {
        setRemainingTime("Overdue");
      }
    };

    calculateRemainingTime();
    const timer = setInterval(calculateRemainingTime, 60000); // Update every minute
    return () => clearInterval(timer); // Cleanup on unmount
  }, [task.dueDate]);

  // Handle drag-and-drop functionality
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(filteredTasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setFilteredTasks(reorderedTasks);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd} className="p-0 m-0">
      <div className="w-full p-1 md:p-4 bg-[#2C2B5A] text-white shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 relative"    onMouseLeave={() => setDropdownOpen((prev) => !prev)}>
        {/* Title */}
        <h1 className="text-xl mt-4 sm:text-2xl font-bold bg-[#8E44AD] p-2 rounded-md mb-1">
          {task.title}
        </h1>

        {/* Description */}
        <div className="flex gap-1 flex-col sm:flex-row w-full gap-x-1">
        <p className="text-xs sm:text-sm my-1 sm:my-4 w-[70%]">
            <span className="text-[#AFAFDF]">Due Date :</span>
            <div className=" overflow-y-scroll p-2 w-full rounded-lg bg-[#3B3B80] text-white">
              <p>{task.dueDate}</p>
            </div>
          </p>
        </div>

        {/* Status */}
        <div className="flex gap-1 flex-row w-full">
          <p className="text-[0.7rem] sm:text-xs mb-1 w-full">
            <span className="text-[#AFAFDF]">Status:</span>
            <div
              className={`p-2 rounded-md mt-1 ${
                task.status === "completed" ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {task.status}
            </div>
          </p>

          {/* Remaining Time */}
          <p className="text-[0.7rem] sm:text-xs mb-1 w-full">
            <span className="text-[#AFAFDF]">Time Remaining:</span>
            <div
              className={`p-2 rounded-md mt-1 ${
                remainingTime === "Overdue" ? "bg-red-500" : "bg-[#3B3B80]"
              }`}
            >
              {remainingTime}
            </div>
          </p>
        </div>

        {/* Actions */}
        

        {/* Dropdown */}
        <div className="" ref={dropdownRef}>
          <button
            onMouseEnter={() => setDropdownOpen((prev) => !prev)}
          
            className=" text-white p-1 text-sm italic font-bold  rounded-md mt-1 shadow-md hover:bg-[#8E44AD]"
          >
            More Options
          </button>
          {isDropdownOpen && (
            <div className="absolute top-0 h-full  py-3 p-3  right-0 bg-[#3B3B80] bg-opacity-95 text-black shadow-lg rounded-r-lg w-32 z-[70]">
            <p className="text-xs sm:text-sm my-1 sm:my-4 w-full">
            <span className="text-[#AFAFDF]">Description:</span>
            <div className="h-20 overflow-y-scroll p-2 w-full rounded-lg bg-[#3B3B80] text-white">
              <p>{task.description} </p>
            </div>
          </p>
          <div className="flex justify-around  gap-y-3 flex-col mb-1 mt-1">
            <div className="flex  items-center text-white gap-x-4 w-full "   onClick={() => {
              setEditingTask(task);
              setModalOpen(true);
            }}>

          <FaEdit
            className="text-blue-400 cursor-pointer hover:text-blue-600 transition duration-200"
          
            />
          <span>Edit</span>
            </div>

             <div className="flex  items-center text-white gap-x-4 w-full " onClick={() =>{
              
              handleToggleCompletion(task._id)
            }
          }>

          <FaCheck
            className="text-green-400 cursor-pointer hover:text-green-600 transition duration-200"
            
          />
           <span>Done</span>
          </div>
           <div className="flex  items-center text-white gap-x-4 w-full " onClick={() => {
              setTaskToDelete(task._id);
              setDeleteModalOpen(true);
            }}>

          <FaTrash
            className="text-red-400 cursor-pointer hover:text-red-600 transition duration-200"
            
            />
             <span>Delete</span>
            </div>
        </div>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default TaskCard;

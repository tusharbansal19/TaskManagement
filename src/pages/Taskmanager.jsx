// TaskManager.js (Main Component)
import React, { useState, useEffect, useRef } from "react";
// Ensure 'react-redux' is installed (npm install react-redux)
import { useSelector, useDispatch } from "react-redux";
// Ensure correct path to your Redux TaskDetails file
import { addTask, editTask, deleteTask, toggleTaskCompletion, getAllTask } from "../redux/TaskDetails";
// Ensure correct path to your Redux selectFilteredTasks file
import { selectFilteredTasks } from "../redux/selectFilteredTasks";
// Removed DragDropContext, Droppable, Draggable imports as per request
// If 'react-beautiful-dnd' is still causing errors, ensure it's not accidentally imported elsewhere
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// --- TaskFormModal Component ---
// import { Mic, MicOff, X } from 'lucide-react';
import { Search, PlusCircle, Mic, MicOff, X, CalendarDays, ChevronDown, ListChecks, CheckCircle2, CircleOff } from 'lucide-react'; // Add ListChecks, CheckCircle2, CircleOff for filter icons
// Ensure 'react-simple-typewriter' is installed (npm install react-simple-typewriter)
import { Typewriter } from "react-simple-typewriter";
// Ensure 'react-toastify' is installed (npm install react-toastify)
import { ToastContainer, toast } from "react-toastify";
// The CSS import for react-toastify might need to be handled globally in your App.jsx or index.js
import 'react-toastify/dist/ReactToastify.css';
// Ensure 'axios' is installed (npm install axios)
import axios from "axios";
// Ensure 'react-router-dom' is installed (npm install react-router-dom)
import { useNavigate } from "react-router-dom";
// Ensure correct path to your AuthProtectComponents file
import { useAuth } from "../Auth/AuthProtectComponents";
// Ensure 'react-icons/fa' is installed (npm install react-icons/fa)
import { FaEdit, FaCheck, FaTrash, FaClock, FaCalendarAlt, FaEllipsisV, FaArrowDown } from "react-icons/fa";
import { useTheme } from '../ThemeContext';
import PageLoader from '../Components/PageLoader';

// --- Reusable Button Component (for consistency) ---
const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, icon: Icon = null, type = 'button' }) => {
  const baseStyle = "px-4 py-3 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center min-h-[44px] touch-manipulation";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg active:scale-95",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 active:scale-95",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 active:scale-95",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 active:scale-95",
    link: "text-blue-600 hover:underline dark:text-blue-400",
    danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95",
    success: "bg-green-500 text-white hover:bg-green-600 active:scale-95",
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      disabled={disabled}
    >
      {Icon && <Icon size={18} className={children ? "mr-2" : ""} />}
      {children}
    </button>
  );
};

// --- Modal Component (for consistency) ---
const Modal = ({ isOpen, onClose, title, children, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className={`rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in
        ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-500 dark:text-gray-100">{title}</h3>
          <Button variant="ghost" onClick={onClose} className="text-gray-600 dark:text-gray-300">
            <X size={20} className="sm:w-6 sm:h-6" />
          </Button>
        </div>
        <div className="text-gray-700 dark:text-gray-200">
          {children}
        </div>
        
      </div>
    </div>
  );
};

// --- TaskCard Component (Updated UI for compact, table-like display) ---
const TaskCard = ({ task, setEditingTask, setModalOpen, handleToggleCompletion, setTaskToDelete, setDeleteModalOpen, isDarkMode }) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const dropdownRef = useRef();

  // Calculate remaining time
  useEffect(() => {
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
    const timer = setInterval(calculateRemainingTime, 60000);
    return () => clearInterval(timer);
  }, [task.dueDate]);

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

  const getStatusColorClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "incomplete":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Success";
      case "incomplete":
        return "Unfinished";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-emerald-500 to-green-600";
      case "incomplete":
        return "bg-gradient-to-r from-blue-500 to-purple-600";
      case "pending":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Mock progress for tasks, as it's not in the original task object
  const mockProgress = task.status === 'completed' ? 100 : (task.status === 'incomplete' ? 50 : 20);

  return (
    <div className={`relative ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow-sm transition-all duration-300 hover:shadow-md`}>
      {/* Mobile Layout - Compact */}
      <div className="block md:hidden">
        {/* Mobile Header - Compact */}
        <div className="flex items-center justify-between p-3">
          {/* Task Info */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <input 
              type="checkbox" 
              className={`h-4 w-4 rounded border-gray-300 ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'text-blue-600'}`} 
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-1 leading-tight">{task.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
                <span className={`text-xs ${remainingTime === "Overdue" ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {remainingTime === "Overdue" ? "Overdue" : remainingTime}
                </span>
              </div>
            </div>
          </div>
          
         
          <button
  variant="ghost"
  onClick={() => setIsMobileDetailsOpen(!isMobileDetailsOpen)}
  className={`p-1 min-h-[28px] w-7 h-7 rounded-lg transition-all duration-300 transform
    ${isDarkMode ? 'text-blue-400 hover:bg-gray-600' : 'text-blue-600 hover:bg-gray-200'}
    ${isMobileDetailsOpen ? 'rotate-180' : ''}
    bg-red-500 text-white`}
>
  <FaArrowDown size={16} className="mx-auto" />
  {/* <ChevronDown size={18} className="mx-auto" /> */}
</button>
        </div>

        {/* Mobile Details - Collapsible */}
        {isMobileDetailsOpen && (
          <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-600 animate-slide-down">
            {/* Description */}
            <div className="py-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{task.description}</p>
            </div>

            {/* Progress and Date */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Progress</span>
                  <span className="font-semibold text-xs">{mockProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-600">
                  <div className={`h-1.5 rounded-full ${getProgressBarColor(task.status)} transition-all duration-500`} style={{ width: `${mockProgress}%` }}></div>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium`}>Due Date</span>
                <div className="flex items-center">
                  <FaCalendarAlt size={12} className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className="text-xs font-medium">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5">
              <Button
                variant="primary"
                onClick={() => {
                  setEditingTask(task);
                  setModalOpen(true);
                }}
                className="flex-1 py-1.5 text-xs font-medium"
              >
                <FaEdit size={10} className="mr-1" />
                Edit
              </Button>
              
              <Button
                variant="success"
                onClick={() => handleToggleCompletion(task._id)}
                className="flex-1 py-1.5 text-xs font-medium"
              >
                <FaCheck size={10} className="mr-1" />
                Complete
              </Button>
              
              <Button
                variant="danger"
                onClick={() => {
                  setTaskToDelete(task._id);
                  setDeleteModalOpen(true);
                }}
                className="flex-1 py-1.5 text-xs font-medium"
              >
                <FaTrash size={10} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center py-4 px-4">
        {/* Checkbox */}
        <input type="checkbox" className={`mr-4 h-5 w-5 rounded border-gray-300 ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'text-blue-600'}`} />

        {/* Task Name */}
        <div className="flex-1 min-w-[150px] mr-4">
          <h4 className="font-semibold text-lg line-clamp-1">{task.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 min-w-[100px] max-w-[150px] mr-4 hidden lg:block">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
            <div className={`h-2.5 rounded-full ${getProgressBarColor(task.status)} transition-all duration-500`} style={{ width: `${mockProgress}%` }}></div>
          </div>
          <span className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{mockProgress}%</span>
        </div>

        {/* Time Remaining / Due Date */}
        <div className="flex-1 min-w-[100px] mr-4 hidden xl:block">
          <div className="flex items-center text-sm">
            <FaClock size={14} className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`${remainingTime === "Overdue" ? 'text-red-500 font-semibold' : ''}`}>
              {remainingTime === "Overdue" ? "Overdue" : remainingTime}
            </span>
          </div>
          <div className="flex items-center text-sm mt-1">
            <FaCalendarAlt size={14} className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-1 min-w-[80px] mr-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColorClass(task.status)}`}>
            {getStatusText(task.status)}
          </span>
        </div>

        {/* Dropdown Menu for Actions */}
        <div className="relative ml-auto" ref={dropdownRef}>
          <Button
            variant="ghost"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className={`p-2 min-h-[44px] w-12 h-12 rounded-lg transition-all duration-300
              ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <FaEllipsisV size={16} />
          </Button>

          {isDropdownOpen && (
            <div className={`absolute top-12 right-0 w-48 border rounded-xl shadow-xl z-[9999] overflow-hidden
              ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="p-2 space-y-1">
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingTask(task);
                    setModalOpen(true);
                    setDropdownOpen(false);
                  }}
                  className={`w-full justify-start text-sm py-4 px-4 rounded-lg transition-all duration-200
                    ${isDarkMode ? 'text-gray-200 hover:bg-blue-600/20 hover:text-white' : 'text-gray-700 hover:bg-blue-100/50 hover:text-blue-700'}`}
                  >
                    <FaEdit size={16} className="mr-3" />
                    <span >Edit Task</span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleCompletion(task._id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full justify-start text-sm py-4 px-4 rounded-lg transition-all duration-200
                      ${isDarkMode ? 'text-gray-200 hover:bg-green-600/20 hover:text-white' : 'text-gray-700 hover:bg-green-100/50 hover:text-green-700'}`}
                  >
                    <FaCheck size={16} className="mr-3" />
                    <span>Mark Complete</span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setTaskToDelete(task._id);
                      setDeleteModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className={`w-full justify-start text-sm py-4 px-4 rounded-lg transition-all duration-200
                      ${isDarkMode ? 'text-gray-200 hover:bg-red-600/20 hover:text-white' : 'text-gray-700 hover:bg-red-100/50 hover:text-red-700'}`}
                  >
                    <FaTrash size={16} className="mr-3" />
                    <span>Delete Task</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    // </div>
  );
};

// --- TaskHeader Component ---
const TaskHeader = ({
  searchQuery,
  handleSearchChange,
  isDropdownOpen,
  filteredTasks,
  handleSelectTask,
  setModalOpen,
  setEditingTask,
  isDarkMode,
}) => {
  const handleClearSearch = () => {
    // This function needs to be passed down from the parent
    // to clear the searchQuery state.
    handleSearchChange({ target: { value: '' } });
  };

  return (
    <div className="flex flex-col space-y-4 mb-8 p-4">
      {/* Title */}
     
      
      {/* Search Input with Integrated Icons */}
      <div className="relative flex-1 max-w-2xl mx-auto w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search tasks or add a new one..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`
              peer border-2 p-3 pl-12 pr-12 rounded-full w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
              ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'}
              shadow-md hover:shadow-lg
            `}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className={`absolute right-12 p-1 rounded-full transition-colors duration-200
                ${isDarkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {/* Add Task Icon Button */}
          <button
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
            className={`absolute right-2 p-2 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95
              ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} focus:ring-blue-500
            `}
            aria-label="Add new task"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        {/* Search Dropdown */}
        {isDropdownOpen && searchQuery && (
          <ul className={`absolute left-0 w-full mt-2 max-h-60 overflow-y-auto z-20 rounded-xl shadow-2xl border
            ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}
            divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}
            overscroll-contain
          `}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                  `}
                  onClick={() => handleSelectTask(task.title)}
                >
                  <div className="font-semibold text-base">{task.title}</div>
                  <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description.substring(0, 70)}{task.description.length > 70 ? '...' : ''}
                  </div>
                </li>
              ))
            ) : (
              <li className={`px-4 py-3 text-center italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No tasks found.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- TaskFilterHeader Component ---
const FILTERS = [
  { key: 'all', icon: ListChecks, label: 'All', color: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400' },
  { key: 'completed', icon: CheckCircle2, label: 'Completed', color: 'bg-green-500 hover:bg-green-600 text-white border-green-400' },
  { key: 'incomplete', icon: CircleOff, label: 'Incomplete', color: 'bg-red-500 hover:bg-red-600 text-white border-red-400' },
];

const TaskFilterHeader = ({ setFilter, filter, isDarkMode }) => {
  const [fabOpen, setFabOpen] = React.useState(false);
  // Close dropdown on scroll or route change
  React.useEffect(() => {
    if (!fabOpen) return;
    const close = () => setFabOpen(false);
    window.addEventListener('scroll', close);
    return () => window.removeEventListener('scroll', close);
  }, [fabOpen]);

  return (
    <>
      {/* Desktop/Tablet Tab View */}
      <div className={`hidden sm:flex flex-row justify-center items-center mb-6 p-2 rounded-lg shadow-inner gap-2
        ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {FILTERS.map(({ key, icon: Icon, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl font-semibold transition-all duration-300 text-xs
              ${filter === key
                ? `${color} shadow-md scale-105`
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-blue-700'}
            `}
            aria-label={label}
            style={{ minWidth: 48 }}
          >
            <Icon size={18} className="mb-0.5" />
            <span className="text-[10px] font-medium mt-0.5">{label}</span>
          </button>
        ))}
      </div>

      {/* Mobile FAB + Dropdown */}
      <div className="sm:hidden mb-6">
        {/* Fixed FAB */}
        <div className="fixed bottom-20 right-4 z-[99] flex flex-col items-end">
          <div className={`relative transition-all duration-300 ${fabOpen ? 'mb-1' : ''}`}>
            {/* Dropdown options */}
            <div className={`flex flex-col items-center space-y-1 mb-1 transition-all duration-300
              ${fabOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}
              style={{ minWidth: '40px' }}
            >
              {FILTERS.map(({ key, icon: Icon, label, color }) => (
                <button
                  key={key}
                  onClick={() => { setFilter(key); setFabOpen(false); }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg border-2 transition-all duration-200 text-xs
                    ${filter === key
                      ? `${color} scale-110`
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-blue-700 hover:text-white'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-100 hover:text-blue-700'}
                  `}
                  aria-label={label}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
            {/* FAB Button */}
            <button
              onClick={() => setFabOpen((v) => !v)}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900
                bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl transition-all duration-300
                hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400/30
                ${fabOpen ? 'rotate-45' : ''}`}
              aria-label="Show filters"
            >
              <PlusCircle size={22} className={`transition-transform duration-300 ${fabOpen ? 'rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- TaskList Component (Removed Drag and Drop, Updated to list-like UI) ---
const TaskList = ({ filteredTasks, setEditingTask, setModalOpen, handleToggleCompletion, setTaskToDelete, setDeleteModalOpen, isDarkMode, arrayOfTitle }) => (
  <div className="text-gray-800 dark:text-gray-100 font-extrabold my-3 text-base sm:text-lg">
   

    <div className="w-full">
      {filteredTasks.length === 0 ? (
        <div className={`flex justify-center items-center w-full h-40 rounded-md mt-8
          ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <p className="text-xl sm:text-2xl font-semibold">
            No Tasks Found for this filter
          </p>
        </div>
      ) : (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          {/* Desktop Table Header */}
          <div className={`hidden md:flex items-center py-3 px-4 font-semibold text-sm uppercase border-b
            ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            <div className="w-5 h-5 mr-4"></div> {/* Placeholder for checkbox */}
            <div className="flex-1 min-w-[150px] mr-4">Task Name</div>
            <div className="flex-1 min-w-[100px] max-w-[150px] mr-4 hidden lg:block">Progress</div>
            <div className="flex-1 min-w-[100px] mr-4 hidden xl:block">Time / Due Date</div>
            <div className="flex-1 min-w-[80px] mr-4">Status</div>
            <div className="w-10 ml-auto">Actions</div> {/* Placeholder for dropdown */}
          </div>

          {/* Mobile Header */}
          <div className={`md:hidden px-4 py-3 font-semibold text-sm uppercase border-b
            ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span>Tasks ({filteredTasks.length})</span>
              <span className="text-xs font-normal text-red-500">Tap arrow for details</span>
            </div>
          </div>

          {/* Task List Items */}
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                setEditingTask={setEditingTask}
                setModalOpen={setModalOpen}
                handleToggleCompletion={handleToggleCompletion}
                setTaskToDelete={setTaskToDelete}
                setDeleteModalOpen={setDeleteModalOpen}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const TaskFormModal = ({
  isOpen,
  onClose,
  title,
  editingTask,
  handleAddTask,
  handleEditTask,
  speechTitle,
  setSpeechTitle,
  isListening,
  toggleListening,
  speechLang,
  setSpeechLang,
  speechDesc,
  setSpeechDesc,
  isDescListening,
  toggleDescListening,
  descLang,
  setDescLang,
  selectedDay,
  handleDateChange,
  isDarkMode,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} isDarkMode={isDarkMode}>
    {/* <h1 className="text-2xl font-bold">{title}</h1> */}
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const task = {
          title: speechTitle || formData.get("title"),
          day: selectedDay,
          description: speechDesc || formData.get("description"),
          dueDate: formData.get("dueDate"),
        };

        if (editingTask) {
          handleEditTask(editingTask._id, task);
        } else {
          handleAddTask(task);
        }
      }}
      className="space-y-8 p-4 md:p-6"
    >
      {/* Title Input */}
      <div className="relative group">
        <label htmlFor="title" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200 pointer-events-none z-10
          ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
        `}>
          Title
        </label>
        <div className="relative flex items-center">
          <input
            id="title"
            type="text"
            name="title"
            value={speechTitle || editingTask?.title || ""}
            onChange={e => setSpeechTitle(e.target.value)}
            className={`
              peer border-2 p-3 pr-24 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
              ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-transparent' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-transparent'}
              shadow-sm hover:shadow-md
            `}
            placeholder=" "
            required
            aria-label="Task Title"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95
                ${isListening ? 'bg-red-500 text-white' : (isDarkMode ? 'bg-gray-600 text-gray-100 hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} focus:ring-blue-500
              `}
              aria-label={isListening ? "Stop listening for title" : "Start listening for title"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <select
              value={speechLang}
              onChange={e => setSpeechLang(e.target.value)}
              className={`p-2 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
              `}
              aria-label="Select language for title speech input"
            >
              <option value="en-US">EN</option>
              <option value="hi-IN">HI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Description Input */}
      <div className="relative group">
        <label htmlFor="description" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200 pointer-events-none z-10
          ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
        `}>
          Description
        </label>
        <div className="relative flex items-end">
          <textarea
            id="description"
            name="description"
            value={speechDesc || editingTask?.description || ""}
            onChange={e => setSpeechDesc(e.target.value)}
            className={`
              peer border-2 p-3 pr-24 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 h-32 resize-y
              ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-transparent' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-transparent'}
              shadow-sm hover:shadow-md
            `}
            placeholder=" "
            required
            aria-label="Task Description"
          />
          <div className="absolute right-2 bottom-2 flex flex-col gap-1">
            <button
              type="button"
              onClick={toggleDescListening}
              className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95
                ${isDescListening ? 'bg-red-500 text-white' : (isDarkMode ? 'bg-gray-600 text-gray-100 hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')}
                focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} focus:ring-blue-500
              `}
              aria-label={isDescListening ? "Stop listening for description" : "Start listening for description"}
            >
              {isDescListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <select
              value={descLang}
              onChange={e => setDescLang(e.target.value)}
              className={`p-2 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
              `}
              aria-label="Select language for description speech input"
            >
              <option value="en-US">EN</option>
              <option value="hi-IN">HI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Due Date Input */}
      <div className="relative group">
        <label htmlFor="dueDate" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200 pointer-events-none z-10
          ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
        `}>
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          defaultValue={editingTask?.dueDate || ""}
          className={`
            peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
            shadow-sm hover:shadow-md
          `}
          required
          onChange={handleDateChange}
          aria-label="Due Date"
        />
      </div>

      {/* Due Day Select (Read-only) */}
      <div className="relative group">
        <label htmlFor="dueDay" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200 pointer-events-none z-10
          ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
        `}>
          Due Day
        </label>
        <select
          id="dueDay"
          name="day"
          value={selectedDay}
          className={`
            peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
            shadow-sm hover:shadow-md cursor-not-allowed
          `}
          required
          readOnly
          disabled // Disable the select to prevent user interaction
          aria-label="Due Day"
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="w-full sm:w-auto p-3 text-base font-semibold transition-transform duration-200 transform hover:scale-105 active:scale-95"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto p-3 text-base font-semibold transition-transform duration-200 transform hover:scale-105 active:scale-95"
        >
          {editingTask ? "Save Changes" : "Add Task"}
        </Button>
      </div>
    </form>
  </Modal>
);

// --- DeleteConfirmationModal Component ---
const DeleteConfirmationModal = ({ isOpen, onClose, handleDeleteTask, isDarkMode }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" isDarkMode={isDarkMode}>
    <p className="mb-6 text-gray-700 dark:text-gray-200">Are you sure you want to delete this task? This action cannot be undone.</p>
    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
      <Button
        variant="secondary"
        onClick={onClose}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>
      <Button
        variant="danger"
        onClick={handleDeleteTask}
        className="w-full sm:w-auto"
      >
        Delete Task
      </Button>
    </div>
  </Modal>
);

// --- Main TaskManager Component ---
const TaskManager = () => {
  const navigator = useNavigate();
  const { logout } = useAuth();
  const dispatch = useDispatch();
  
  // Use theme context instead of props
  const { isDarkMode } = useTheme();

  const tasks = useSelector(selectFilteredTasks); // Tasks from Redux store
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [arrayOfTitle, setArrayOfTitle] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]); // This will be updated based on Redux tasks and local filter/search
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reload, setReload] = useState(false);

  // Speech-to-text states and refs
  const [isListening, setIsListening] = useState(false);
  const [speechTitle, setSpeechTitle] = useState("");
  const [speechLang, setSpeechLang] = useState("en-US");
  const recognitionRef = useRef(null);

  const [isDescListening, setIsDescListening] = useState(false);
  const [speechDesc, setSpeechDesc] = useState("");
  const [descLang, setDescLang] = useState("en-US");
  const descRecognitionRef = useRef(null);

  const [selectedDay, setSelectedDay] = useState("Monday");

  // Handle input change to toggle the dropdown
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownOpen(query.length > 0);
  };

  // Handle selection of a task from the dropdown
  const handleSelectTask = (taskTitle) => {
    setSearchQuery(taskTitle);
    setIsDropdownOpen(false);
  };

  // Effect to filter tasks based on Redux tasks, search query, and filter
  useEffect(() => {
    let currentFiltered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filter === "completed") {
      currentFiltered = currentFiltered.filter((task) => task.status === "completed");
    } else if (filter === "incomplete") {
      currentFiltered = currentFiltered.filter((task) => task.status !== "completed");
    }
    // Keeping 'pending' and 'overdue' logic for completeness, though not directly exposed by new header buttons
    else if (filter === "pending") {
      currentFiltered = currentFiltered.filter((task) => task.status === "pending");
    } else if (filter === "overdue") {
      const currentDate = new Date().toISOString().split("T")[0];
      currentFiltered = currentFiltered.filter((task) => task.dueDate < currentDate && task.status !== "completed");
    }

    setFilteredTasks(currentFiltered);
  }, [searchQuery, tasks, filter]);

  // Effect to fetch tasks from API and dispatch to Redux
  useEffect(() => {
    const fetchTasks = async () => {
      if (!localStorage.getItem("token")) {
        navigator("/login");
        return;
      }
  
      setLoading(true);
      try {
        const response = await axios.post(
          "https://taskserver-v7qf.onrender.com/api/tasks/get",
          { token: localStorage.getItem("token") },
          { headers: { "Content-Type": "application/json" } }
        );
  
        console.log(response.data.tasks, "tasks");
        dispatch(getAllTask({ tasks: response.data.tasks })); // Dispatch fetched tasks to Redux
    // Propagate task update status to parent
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks. Please try again!", {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        // You might want to uncomment logout/redirect if API fetch failure should force re-login
        // logout();
        // localStorage.clear("token", "email");
        // navigator("/login");
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [reload, isDarkMode, navigator, logout, dispatch]);
  
  const handleAddTask = async (task) => {
    setLoading(true);
    try {
      const response = await axios.post("https://taskserver-v7qf.onrender.com/api/tasks/create", {
        token: localStorage.getItem("token"),
        ...task, status: "incomplete", startingDate: new Date().toISOString()
      }, {
        headers: { "Content-Type": "application/json" },
      });

      setReload(prev => !prev);
      dispatch(addTask({ ...task, _id: response.data.taskId, status: "incomplete" }));
      toast.success("Task added successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
    } finally {
      setLoading(false);
      setModalOpen(false);
      setSpeechTitle("");
      setSpeechDesc("");
    }
  };

  const handleEditTask = async (id, updatedTask) => {
    setLoading(true);
    try {
      const response = await axios.put(
        "https://taskserver-v7qf.onrender.com/api/tasks/update",
        {
          token: localStorage.getItem("token"),
          taskId: id,
          ...updatedTask,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setReload(prev => !prev);
      dispatch(editTask({ taskId: id, updatedTask: updatedTask }));
      toast.success("Task updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
    } finally {
      setLoading(false);
      setModalOpen(false);
      setEditingTask(null);
      setSpeechTitle("");
      setSpeechDesc("");
    }
  };
  
  const handleDeleteTask = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`https://taskserver-v7qf.onrender.com/api/tasks/delete`, {
        headers: { "Content-Type": "application/json" },
        data: { token: localStorage.getItem("token"), taskId: taskToDelete }
      });
      
      toast.success("Task deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
      setReload(prev => !prev);
      dispatch(deleteTask(taskToDelete));
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleToggleCompletion = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(
        "https://taskserver-v7qf.onrender.com/api/tasks/toggle-completion",
        { token: localStorage.getItem("token"), taskId: id },
        { headers: { "Content-Type": "application/json" } }
      );
  
      toast.success("Task status updated!", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
      setReload(prev => !prev);
      dispatch(toggleTaskCompletion(id));
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Removed onDragEnd function as drag and drop is removed

  useEffect(() => {
    let arrayr = [];
    for (let task of tasks) {
      arrayr.push(task.title);
    }
    setArrayOfTitle(arrayr);
  }, [tasks]);

  useEffect(() => {
    if (isModalOpen && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = speechLang;
      recognition.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            text += event.results[i][0].transcript + " ";
          }
        }
        setSpeechTitle(text.trim());
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [isModalOpen, speechLang]);

  useEffect(() => {
    if (isModalOpen && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = descLang;
      recognition.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            text += event.results[i][0].transcript + " ";
          }
        }
        setSpeechDesc(text.trim());
        setIsDescListening(false);
      };
      recognition.onend = () => setIsListening(false);
      descRecognitionRef.current = recognition;
    }
  }, [isModalOpen, descLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.", { theme: isDarkMode ? "dark" : "light" });
      return;
    }
    if (!isListening) {
      setSpeechTitle("");
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleDescListening = () => {
    if (!descRecognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.", { theme: isDarkMode ? "dark" : "light" });
      return;
    }
    if (!isDescListening) {
      setSpeechDesc("");
      descRecognitionRef.current.start();
      setIsDescListening(true);
    } else {
      descRecognitionRef.current.stop();
      setIsDescListening(false);
    }
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const dayIndex = new Date(dateValue).getDay();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      setSelectedDay(days[dayIndex]);
    }
  };

  return (
    <div className={`container mx-auto p-2 sm:p-4 min-h-screen mb-20 sm:mb-28 rounded-xl shadow-lg
      ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      
      {/* PageLoader for loading state */}
      <PageLoader 
        isLoading={loading} 
        loadingMessage="Loading Tasks..."
        dynamicMessages={[
          'Fetching your tasks...',
          'Organizing data...',
          'Almost ready...'
        ]}
      />
      
      <ToastContainer theme={isDarkMode ? "dark" : "light"} />

      <TaskHeader
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        isDropdownOpen={isDropdownOpen}
        filteredTasks={filteredTasks}
        handleSelectTask={handleSelectTask}
        setModalOpen={setModalOpen}
        setEditingTask={setEditingTask}
        isDarkMode={isDarkMode}
      />

      <TaskFilterHeader
        setFilter={setFilter}
        filter={filter}
        isDarkMode={isDarkMode}
      />

      

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        handleDeleteTask={handleDeleteTask}
        isDarkMode={isDarkMode}
      />

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? "Edit Task" : "Add Task"}
        editingTask={editingTask}
        handleAddTask={handleAddTask}
        handleEditTask={handleEditTask}
        speechTitle={speechTitle}
        setSpeechTitle={setSpeechTitle}
        isListening={isListening}
        toggleListening={toggleListening}
        speechLang={speechLang}
        setSpeechLang={setSpeechLang}
        speechDesc={speechDesc}
        setSpeechDesc={setSpeechDesc}
        isDescListening={isDescListening}
        toggleDescListening={toggleDescListening}
        descLang={descLang}
        setDescLang={setDescLang}
        selectedDay={selectedDay}
        handleDateChange={handleDateChange}
        isDarkMode={isDarkMode}
      />
    
        <TaskList
        filteredTasks={filteredTasks}
        setEditingTask={setEditingTask}
        setModalOpen={setModalOpen}
        handleToggleCompletion={handleToggleCompletion}
        setTaskToDelete={setTaskToDelete}
        setDeleteModalOpen={setDeleteModalOpen}
        isDarkMode={isDarkMode}
        arrayOfTitle={arrayOfTitle}
      />
        <div className="flex items-center text-[20px] md:text-[35px] mb-4">
      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>| Task : </span>
      <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        <Typewriter
          words={arrayOfTitle.length > 0 ? arrayOfTitle : ["No tasks yet!"]}
          loop={0} // Loop indefinitely
          cursor
          cursorStyle="|"
          cursorColor={isDarkMode ? "#a78bfa" : "#8E44AD"} // Dynamic cursor color
          typeSpeed={100}
          deleteSpeed={50}
          delaySpeed={2000} 
        />
      </span>
    </div>
    </div>
  );
};

export default TaskManager;
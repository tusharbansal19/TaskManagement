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
import { Search, PlusCircle, Mic, MicOff, X, CalendarDays } from 'lucide-react'; // Ensure 'lucide-react' is installed (npm install lucide-react)
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
import { FaEdit, FaCheck, FaTrash, FaClock, FaCalendarAlt, FaEllipsisV } from "react-icons/fa";
import { useTheme } from '../ThemeContext';

// --- Reusable Button Component (for consistency) ---
const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, icon: Icon = null }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
    link: "text-blue-600 hover:underline dark:text-blue-400",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disabled}>
      {Icon && <Icon size={18} className={children ? "mr-2" : ""} />}
      {children}
    </button>
  );
};

// --- Modal Component (for consistency) ---
const Modal = ({ isOpen, onClose, title, children, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in
        ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          <Button variant="ghost" onClick={onClose} className="text-gray-600 dark:text-gray-300">
            <X size={24} />
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
    <div className={`relative flex items-center py-3 px-4 rounded-lg shadow-sm transition-all duration-300
      ${isDarkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-50'}`}>
      {/* Checkbox (optional, based on image) */}
      <input type="checkbox" className={`mr-4 h-5 w-5 rounded border-gray-300 ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'text-blue-600'}`} />

      {/* Task Name */}
      <div className="flex-1 min-w-[150px] mr-4">
        <h4 className="font-medium text-lg line-clamp-1">{task.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 min-w-[100px] max-w-[150px] mr-4 hidden md:block">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
          <div className={`h-2.5 rounded-full ${getProgressBarColor(task.status)}`} style={{ width: `${mockProgress}%` }}></div>
        </div>
        <span className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{mockProgress}%</span>
      </div>

      {/* Time Remaining / Due Date */}
      <div className="flex-1 min-w-[100px] mr-4 hidden lg:block">
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
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(task.status)}`}>
          {getStatusText(task.status)}
        </span>
      </div>

      {/* Dropdown Menu for Actions */}
      <div className="relative ml-auto" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110
            ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`}
          aria-label="Task actions"
        >
          <FaEllipsisV size={14} />
        </button>

        <div className={`absolute top-8 right-0 w-40 border rounded-xl shadow-lg z-50 overflow-hidden transition-all duration-300
          ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
          ${isDropdownOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}>
          <div className="p-1">
            <button
              onClick={() => {
                setEditingTask(task);
                setModalOpen(true);
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200
                ${isDarkMode ? 'text-gray-200 hover:bg-blue-600/20 hover:text-white' : 'text-gray-700 hover:bg-blue-100/50 hover:text-blue-700'}`}
            >
              <FaEdit size={14} />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                handleToggleCompletion(task._id);
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200
                ${isDarkMode ? 'text-gray-200 hover:bg-green-600/20 hover:text-white' : 'text-gray-700 hover:bg-green-100/50 hover:text-green-700'}`}
            >
              <FaCheck size={14} />
              <span>Complete</span>
            </button>

            <button
              onClick={() => {
                setTaskToDelete(task._id);
                setDeleteModalOpen(true);
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200
                ${isDarkMode ? 'text-gray-200 hover:bg-red-600/20 hover:text-white' : 'text-gray-700 hover:bg-red-100/50 hover:text-red-700'}`}
            >
              <FaTrash size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TaskHeader Component ---
const TaskHeader = ({ searchQuery, handleSearchChange, isDropdownOpen, filteredTasks, handleSelectTask, setModalOpen, setEditingTask, isDarkMode }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
    <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Task Manager</h1>
    <div className="relative w-full md:w-1/2">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={`border p-2 rounded-lg w-full pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
          ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'}`}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

      {isDropdownOpen && searchQuery && (
        <ul className={`absolute left-0 w-full mt-1 max-h-48 overflow-y-auto z-10 rounded-lg shadow-lg
          ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}>
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className={`px-4 py-2 cursor-pointer transition-colors duration-150
                ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
              onClick={() => handleSelectTask(task.title)}
            >
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
    <Button
      className="w-full md:w-auto mt-4 md:mt-0 py-3 text-lg group"
      onClick={() => {
        setEditingTask(null);
        setModalOpen(true);
      }}
      icon={PlusCircle}
    >
      Add New Task
    </Button>
  </div>
);

// --- TaskFilterHeader Component ---
const TaskFilterHeader = ({ setFilter, filter, isDarkMode }) => (
  <div className={`flex justify-around items-center mb-6 p-2 rounded-lg shadow-inner
    ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
    <Button
      variant="ghost"
      className={`flex-1 mx-1 py-2 text-base font-semibold rounded-md transition-all duration-300
        ${filter === 'all' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'}`}
      onClick={() => setFilter('all')}
    >
      All Tasks
    </Button>
    <Button
      variant="ghost"
      className={`flex-1 mx-1 py-2 text-base font-semibold rounded-md transition-all duration-300
        ${filter === 'completed' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'}`}
      onClick={() => setFilter('completed')}
    >
      Completed
    </Button>
    <Button
      variant="ghost"
      className={`flex-1 mx-1 py-2 text-base font-semibold rounded-md transition-all duration-300
        ${filter === 'incomplete' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'}`}
      onClick={() => setFilter('incomplete')}
    >
      Incomplete
    </Button>
  </div>
);

// --- TaskList Component (Removed Drag and Drop, Updated to list-like UI) ---
const TaskList = ({ filteredTasks, setEditingTask, setModalOpen, handleToggleCompletion, setTaskToDelete, setDeleteModalOpen, isDarkMode, arrayOfTitle }) => (
  <div className="text-gray-800 dark:text-gray-100 font-extrabold my-3 text-base sm:text-lg">
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

    <div className="w-full overflow-x-auto"> {/* Added overflow-x-auto for responsiveness */}
      {filteredTasks.length === 0 ? (
        <div className={`flex justify-center items-center w-full h-40 rounded-md mt-8
          ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <p className="text-xl sm:text-2xl font-semibold">
            No Tasks Found for this filter
          </p>
        </div>
      ) : (
        <div className={`min-w-[700px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}> {/* Minimum width for table-like layout */}
          {/* Table Header */}
          <div className={`flex items-center py-3 px-4 font-semibold text-sm uppercase border-b
            ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            <div className="w-5 h-5 mr-4"></div> {/* Placeholder for checkbox */}
            <div className="flex-1 min-w-[150px] mr-4">Task Name</div>
            <div className="flex-1 min-w-[100px] max-w-[150px] mr-4 hidden md:block">Progress</div>
            <div className="flex-1 min-w-[100px] mr-4 hidden lg:block">Time / Due Date</div>
            <div className="flex-1 min-w-[80px] mr-4">Status</div>
            <div className="w-10 ml-auto">Actions</div> {/* Placeholder for dropdown */}
          </div>

          {/* Task List Items */}
          <div className="divide-y divide-gray-200 dark:divide-gray-600 h-full gap-y-4 min-h-[500px] flex flex-col mt-2">
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


import dayjs from 'dayjs'; // Ensure dayjs is imported for date handling

// Reusable Button component (assuming it's defined elsewhere or in the same file)



const TaskFormModal = ({ isOpen, onClose, title, editingTask, handleAddTask, handleEditTask, speechTitle, setSpeechTitle, isListening, toggleListening, speechLang, setSpeechLang, speechDesc, setSpeechDesc, isDescListening, toggleDescListening, descLang, setDescLang, selectedDay, handleDateChange, isDarkMode }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} isDarkMode={isDarkMode}>
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
      className="space-y-6" // Added space between form elements
    >
      {/* Title Input */}
      <div className="relative flex items-center group">
        <label htmlFor="title" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200
          ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
          pointer-events-none z-10
        `}>Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={speechTitle || editingTask?.title || ""}
          onChange={e => setSpeechTitle(e.target.value)}
          className={`
            peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-transparent' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-transparent'}
            shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
          `}
          placeholder=" " // Important for the label animation
          required
        />
        <button
          type="button"
          className={`
            ml-3 p-3 rounded-full text-white transition-colors duration-300 transform hover:scale-110 active:scale-95 shadow-md
            ${isListening ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}
            focus:outline-none focus:ring-2 focus:ring-offset-2
          `}
          onClick={toggleListening}
          tabIndex={-1}
          aria-label="Start/Stop Speech to Text"
        >
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <select
          className={`
            ml-3 p-3 rounded-xl border-2 focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
            shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
          `}
          value={speechLang}
          onChange={e => setSpeechLang(e.target.value)}
          style={{ minWidth: 100 }}
          aria-label="Select language for speech to text"
        >
          <option value="en-US">English</option>
          <option value="hi-IN">हिन्दी</option>
        </select>
      </div>

      {/* Description Input */}
      <div className="relative flex items-center group">
        <label htmlFor="description" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200
          ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
          pointer-events-none z-10
        `}>Description</label>
        <textarea
          id="description"
          name="description"
          value={speechDesc || editingTask?.description || ""}
          onChange={e => setSpeechDesc(e.target.value)}
          className={`
            peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 h-28 resize-y
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-transparent' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-transparent'}
            shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
          `}
          placeholder=" " // Important for the label animation
          required
        />
        <button
          type="button"
          className={`
            ml-3 self-start mt-3 p-3 rounded-full text-white transition-colors duration-300 transform hover:scale-110 active:scale-95 shadow-md
            ${isDescListening ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}
            focus:outline-none focus:ring-2 focus:ring-offset-2
          `}
          onClick={toggleDescListening}
          tabIndex={-1}
          aria-label="Start/Stop Speech to Text for Description"
        >
          {isDescListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <select
          className={`
            ml-3 self-start mt-3 p-3 rounded-xl border-2 focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
            shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
          `}
          value={descLang}
          onChange={e => setDescLang(e.target.value)}
          style={{ minWidth: 100 }}
          aria-label="Select language for speech to text (description)"
        >
          <option value="en-US">English</option>
          <option value="hi-IN">हिन्दी</option>
        </select>
      </div>

      {/* Due Date Input */}
      <div className="relative group">
        <label htmlFor="dueDate" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200
          ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
          pointer-events-none z-10
        `}>Due Date</label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          defaultValue={editingTask?.dueDate || ""}
          className={`
            peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
            shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
          `}
          required
          onChange={handleDateChange}
        />
      </div>

      {/* Due Day Select (Read-only) */}
      <div className="relative group">
        <label htmlFor="dueDay" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200
          ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
          pointer-events-none z-10
        `}>Due Day</label>
        <select
          id="dueDay"
          name="day"
          value={selectedDay}
          className={`
            peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
            shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
          `}
          required
          readOnly
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
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="hover:scale-105"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="hover:scale-105"
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
    <p className="mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
    <div className="flex justify-end gap-2">
      <Button
        variant="secondary"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        className="bg-red-600 hover:bg-red-700"
        onClick={handleDeleteTask}
      >
        Delete
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
          "http://localhost:5000/api/tasks/get",
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
      const response = await axios.post("http://localhost:5000/api/tasks/create", {
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
        "http://localhost:5000/api/tasks/update",
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
      const response = await axios.delete(`http://localhost:5000/api/tasks/delete`, {
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
        "http://localhost:5000/api/tasks/toggle-completion",
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
    <div className={`container mx-auto p-4 min-h-screen mb-28 min-h-screen rounded-xl shadow-lg
      ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      {loading && (
        <div className="w-full flex justify-center mt-4 h-full items-center fixed top-0 left-0 bg-black bg-opacity-30 z-[110]">
          <div className="w-12 h-12 border-4 border-dotted border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
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

      {/* onDragEnd prop removed as drag and drop is no longer used */}
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
    </div>
  );
};

export default TaskManager;
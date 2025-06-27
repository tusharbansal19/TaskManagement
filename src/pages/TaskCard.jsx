import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaCheck, FaTrash, FaClock, FaCalendarAlt, FaEllipsisV } from "react-icons/fa";

const TaskCard = ({
  task = {
    _id: "1",
    title: "Abstract 3D Design",
    description: "Create stunning 3D abstract visualizations with modern design principles and dynamic lighting effects.",
    dueDate: "2025-07-15",
    status: "in-progress"
  },
  setEditingTask = () => {},
  setModalOpen = () => {},
  handleToggleCompletion = () => {},
  setTaskToDelete = () => {},
  setDeleteModalOpen = () => {}
}) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "from-emerald-500 to-green-600";
      case "in-progress":
        return "from-blue-500 to-purple-600";
      case "pending":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✓";
      case "in-progress":
        return "⟳";
      case "pending":
        return "⏳";
      default:
        return "○";
    }
  };

  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
      
      <div 
        className="relative w-full max-w-md mx-auto bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-y-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Card Header */}
        <div className="relative p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                {task.title}
              </h1>
              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            </div>
            
            {/* Dropdown Menu */}
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/40 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <FaEllipsisV size={14} />
              </button>
              
              {/* Enhanced Dropdown */}
              <div className={`absolute top-12 right-0 w-48 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ${
                isDropdownOpen 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              }`}>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-all duration-200 group/item"
                  >
                    <FaEdit className="text-blue-400 group-hover/item:text-blue-300" />
                    <span>Edit Task</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleToggleCompletion(task._id);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-green-600/20 rounded-lg transition-all duration-200 group/item"
                  >
                    <FaCheck className="text-green-400 group-hover/item:text-green-300" />
                    <span>Mark Complete</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setTaskToDelete(task._id);
                      setDeleteModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200 group/item"
                  >
                    <FaTrash className="text-red-400 group-hover/item:text-red-300" />
                    <span>Delete Task</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-6 pb-6 space-y-4">
          {/* Status and Time Row */}
          <div className="flex gap-3">
            {/* Status Badge */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${getStatusColor(task.status)} text-white font-medium text-sm shadow-lg`}>
                <span className="text-base">{getStatusIcon(task.status)}</span>
                <span className="capitalize">{task.status.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="w-2 h-2 text-purple-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Remaining</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm shadow-lg ${
                remainingTime === "Overdue" 
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
                  : "bg-slate-700/50 text-slate-300 border border-slate-600/50"
              }`}>
                <FaClock size={12} />
                <span>{remainingTime}</span>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="w-2 h-2 text-purple-400" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Due Date</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30 text-slate-300 text-sm">
              <FaCalendarAlt size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1 bg-slate-800 overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${getStatusColor(task.status)} transform transition-all duration-1000 ${
            isHovered ? 'translate-x-0' : '-translate-x-full'
          }`}></div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .group:hover .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TaskCard;
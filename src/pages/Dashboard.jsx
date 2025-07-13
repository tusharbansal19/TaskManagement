import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';

import {
  Home, LayoutGrid, Folder, CheckSquare, Settings, Users, Search, Bell,
  Menu, X, PlusCircle, UserCircle, Sparkles, ChevronLeft, ChevronRight,
  CalendarDays, Clock, List, TrendingUp, TrendingDown, Zap, Target, Award,
} from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectTasks } from '../redux/selectFilteredTasks';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/en';

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

import { getAllTask } from '../redux/TaskDetails';
import { useTheme } from '../ThemeContext';
import Avatar from '../Components/Avatar';

// --- Enhanced Reusable Components ---

const Card = ({ title, children, className = '', headerContent = null, delay = 0 }) => {
  const { isDarkMode } = useTheme();
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);
  
  return (
    <div 
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-xl sm:rounded-2xl shadow-lg border transition-all duration-700 hover:shadow-xl transform relative overflow-hidden ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } ${className} ${
        isDarkMode 
          ? 'bg-gray-800/95 backdrop-blur-sm border-gray-700/50 text-gray-100 hover:bg-gray-800/98' 
          : 'bg-white/95 backdrop-blur-sm border-gray-200/50 text-gray-900 hover:bg-white/98'
      }`}
      style={{
        boxShadow: isHovered 
          ? isDarkMode
            ? '0 20px 40px rgba(59, 130, 246, 0.15), 0 0 20px rgba(147, 51, 234, 0.1), 0 0 40px rgba(59, 130, 246, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 20px 40px rgba(59, 130, 246, 0.1), 0 0 20px rgba(147, 51, 234, 0.05), 0 0 40px rgba(59, 130, 246, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          : isDarkMode
            ? '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 10px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 10px rgba(59, 130, 246, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      }}
    >
      {/* Enhanced Lightning Effect Overlay */}
      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400/5 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-lightning"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-lightning" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-sparkle" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-4 right-4 w-1 h-1 bg-purple-400 rounded-full animate-sparkle" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-2 left-4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-sparkle" style={{ animationDelay: '1.2s' }}></div>
      </div>

      {/* Enhanced Glowing Border Effect */}
      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-sm animate-electric-pulse"></div>
      </div>

      <div className={`p-2 sm:p-3 md:p-4 border-b relative z-10 ${
        isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
            {title}
          </h3>
          {headerContent && <div>{headerContent}</div>}
        </div>
      </div>
      <div className="p-2 sm:p-3 md:p-4 relative z-10">
        {children}
      </div>
    </div>
  );
};

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, icon: Icon = null }) => {
  const { isDarkMode } = useTheme();
  
  const baseStyle = "px-3 py-1.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95 text-xs sm:text-sm";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg hover:shadow-blue-500/25",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
    link: "text-blue-600 hover:underline dark:text-blue-400",
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disabled}>
      {Icon && <Icon size={14} className={`${children ? "mr-1.5" : ""} transition-transform duration-200 group-hover:rotate-12`} />}
      {children}
    </button>
  );
};
const TaskReview = ({ tasks }) => {
  const { isDarkMode } = useTheme();
  
  const taskReviewData = useMemo(() => {
    // Calculate overall completed and incomplete tasks based on 'status'
    const totalCounts = tasks.reduce(
      (acc, task) => {
        if (task.status === 'completed') {
          acc.completed += 1;
        } else {
          acc.incomplete += 1;
        }
        return acc;
      },
      { completed: 0, incomplete: 0 }
    );

    const totalTasks = totalCounts.completed + totalCounts.incomplete;
    const completionRate = totalTasks > 0 ? Math.round((totalCounts.completed / totalTasks) * 100) : 0;

    // Calculate weekly trends for the last 4 weeks
    const weeklyData = [];
    const today = dayjs();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = today.subtract(i * 7, 'day').startOf('week');
      const weekEnd = today.subtract(i * 7, 'day').endOf('week');
      
      const weekTasks = tasks.filter(task => {
        // Handle cases where dueDate might be null, undefined, or invalid
        if (!task.dueDate) return false;
        
        try {
          const taskDate = dayjs(task.dueDate);
          // Check if the date is valid
          if (!taskDate.isValid()) return false;
          
          return taskDate.isBetween(weekStart, weekEnd, 'day', '[]');
        } catch (error) {
          console.warn('Invalid date format for task:', task.dueDate);
          return false;
        }
      });
      
      const weekCompleted = weekTasks.filter(task => task.status === 'completed').length;
      const weekIncomplete = weekTasks.filter(task => task.status !== 'completed').length;
      
      weeklyData.push({
        week: `Week ${4 - i}`,
        completed: weekCompleted,
        incomplete: weekIncomplete,
        total: weekCompleted + weekIncomplete,
        completionRate: weekCompleted + weekIncomplete > 0 ? Math.round((weekCompleted / (weekCompleted + weekIncomplete)) * 100) : 0
      });
    }

    // Calculate priority-based completion rates
    const priorityStats = tasks.reduce((acc, task) => {
      const priority = task.priority || 'low';
      if (!acc[priority]) {
        acc[priority] = { total: 0, completed: 0 };
      }
      acc[priority].total += 1;
      if (task.status === 'completed') {
        acc[priority].completed += 1;
      }
      return acc;
    }, {});

    // Calculate overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;
      
      try {
        const dueDate = dayjs(task.dueDate);
        if (!dueDate.isValid()) return false;
        return dueDate.isBefore(today, 'day');
      } catch (error) {
        console.warn('Invalid date format for overdue task:', task.dueDate);
        return false;
      }
    }).length;

    // Calculate upcoming tasks (due in next 7 days)
    const upcomingTasks = tasks.filter(task => {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;
      
      try {
        const dueDate = dayjs(task.dueDate);
        if (!dueDate.isValid()) return false;
        return dueDate.isBetween(today, today.add(7, 'day'), 'day', '[]');
      } catch (error) {
        console.warn('Invalid date format for upcoming task:', task.dueDate);
        return false;
      }
    }).length;

    return {
      totalCounts,
      totalTasks,
      completionRate,
      weeklyData,
      priorityStats,
      overdueTasks,
      upcomingTasks
    };
  }, [tasks]);

  const { totalCounts, totalTasks, completionRate, weeklyData, priorityStats, overdueTasks, upcomingTasks } = taskReviewData;

  return (
    <Card title="Task Progress Overview" className="h-full">
      <div className="space-y-4">
        {/* Main Progress Bar */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{completionRate}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          
          {/* Progress Labels */}
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>0</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Task Counts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">{totalCounts.completed}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <CheckSquare size={16} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Incomplete</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">{totalCounts.incomplete}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                <Clock size={16} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Weekly Progress</h4>
          <div className="space-y-2">
            {weeklyData.map((week, index) => (
              <div key={week.week} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{week.week}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {week.completed}/{week.total} ({week.completionRate}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${week.total > 0 ? (week.completed / week.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority-based Completion */}
       


     
      </div>
    </Card>
  );
};
const Modal = ({ isOpen, onClose, title, children }) => {
  const { isDarkMode } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in
        ${isDarkMode ? 'bg-gray-800/95 backdrop-blur-md text-gray-100 border border-gray-700/50' : 'bg-white/95 backdrop-blur-md text-gray-900 border border-gray-200/50'}`}>
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

// --- Enhanced Chart Components ---

const TaskCompletionPieChart = ({ data }) => {
  const pieData = useMemo(() => [
    { name: 'Completed', value: data.completed },
    { name: 'Incomplete', value: data.incomplete },
  ], [data]);

  const COLORS = ['#10B981', '#EF4444']; // Green for completed, Red for incomplete

  return (
    <div className="relative group">
      {/* Enhanced Lightning Effect for Chart */}
      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/5 to-green-400/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-red-400/5 via-rose-400/3 to-red-400/5 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Sparkle effects for pie chart */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-sparkle" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-sparkle" style={{ animationDelay: '1.1s' }}></div>
      </div>
      
    <ResponsiveContainer width="100%" height={150}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={60}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          stroke="none"
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
                className="transition-all duration-500 transform hover:scale-110 drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                }}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} tasks`, name]}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 20px rgba(16, 185, 129, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#333',
            fontSize: '11px',
            padding: '10px 14px'
          }}
          itemStyle={{ fontWeight: 'bold' }}
        />
        <Legend
          verticalAlign="bottom"
          height={25}
          iconType="circle"
          iconSize={6}
          formatter={(value, entry) => (
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
};

const DailyTaskBarChart = ({ data }) => {
  const barData = useMemo(() => {
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayWiseData = daysOrder.reduce((acc, day) => {
      acc[day] = { completed: 0, incomplete: 0 };
      return acc;
    }, {});

    data.forEach(task => {
      const day = task.day?.toLowerCase();
      if (dayWiseData[day]) {
        if (task.status === 'completed') {
          dayWiseData[day].completed += 1;
        } else {
          dayWiseData[day].incomplete += 1;
        }
      }
    });

    return daysOrder.map(day => ({
      name: day.charAt(0).toUpperCase() + day.slice(1, 3), // e.g., 'Mon'
      Completed: dayWiseData[day].completed,
      Incomplete: dayWiseData[day].incomplete,
    }));
  }, [data]);

  return (
    <div className="relative group">
      {/* Lightning Effect for Chart */}
      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/5 to-blue-400/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-400/5 via-violet-400/3 to-purple-400/5 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        
        {/* Sparkle effects for bar chart */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-sparkle" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-indigo-400 rounded-full animate-sparkle" style={{ animationDelay: '0.9s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-purple-400 rounded-full animate-sparkle" style={{ animationDelay: '1.3s' }}></div>
      </div>
      
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.1)' }}
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 20px rgba(59, 130, 246, 0.1)', 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(12px)', 
            color: '#333',
            fontSize: '11px',
            padding: '12px 16px'
          }}
          itemStyle={{ fontWeight: 'bold' }}
        />
        <Legend 
          iconType="circle" 
          iconSize={6}
          wrapperStyle={{ fontSize: '11px' }}
        />
          <Bar 
            dataKey="Completed" 
            fill="#10B981" 
            radius={[4, 4, 0, 0]}
            className="drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2))',
            }}
          />
          <Bar 
            dataKey="Incomplete" 
            fill="#EF4444" 
            radius={[4, 4, 0, 0]}
            className="drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.2))',
            }}
          />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

const TaskTrendAreaChart = ({ data, isDarkMode }) => {
  const chartData = useMemo(() => {
    // Get dates for the last 30 days
    const today = dayjs();
    const dates = Array.from({ length: 30 }, (_, i) => today.subtract(29 - i, 'day').format('YYYY-MM-DD'));

    const dailyCounts = dates.reduce((acc, date) => {
      acc[date] = { date: dayjs(date).format('MMM DD'), count: 0 };
      return acc;
    }, {});

    data.forEach(task => {
      const taskDate = dayjs(task.dueDate).format('YYYY-MM-DD');
      if (dailyCounts[taskDate]) {
        dailyCounts[taskDate].count += 1;
      }
    });

    return Object.values(dailyCounts);
  }, [data]);

  return (
    <div className="relative group">
      {/* Lightning Effect for Chart */}
      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-violet-400/5 to-purple-400/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/5 via-blue-400/3 to-indigo-400/5 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        
        {/* Sparkle effects for area chart */}
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-sparkle" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-violet-400 rounded-full animate-sparkle" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-sparkle" style={{ animationDelay: '1.0s' }}></div>
      </div>
      
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#4a4a4a' : '#e0e0e0'} />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 0 20px rgba(139, 92, 246, 0.1)',
            backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            color: isDarkMode ? '#e5e7eb' : '#333',
            fontSize: '11px',
            padding: '8px 12px'
          }}
          itemStyle={{ fontWeight: 'bold', color: isDarkMode ? '#e5e7eb' : '#555' }}
          labelStyle={{ color: isDarkMode ? '#e5e7eb' : '#555' }}
        />
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
        </defs>
        <Area
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorCount)"
          strokeWidth={2}
            activeDot={{ 
              r: 5, 
              fill: '#8884d8', 
              stroke: 'white', 
              strokeWidth: 2,
              filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))'
            }}
          className="transition-all duration-500 ease-in-out"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.2))',
            }}
        />
      </AreaChart>
    </ResponsiveContainer>
    </div>
  );
};


const TaskCalendar = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showTasksForDate, setShowTasksForDate] = useState(false);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf('month').day();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthStartPadding = Array(firstDayOfMonth).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const taskDates = useMemo(() => {
    const dates = {};
    tasks.forEach(task => {
      const date = dayjs(task.dueDate).format('YYYY-MM-DD');
      if (!dates[date]) {
        dates[date] = { completed: 0, incomplete: 0 };
      }
      if (task.status === 'completed') {
        dates[date].completed += 1;
      } else {
        dates[date].incomplete += 1;
      }
    });
    return dates;
  }, [tasks]);

  const handleDateClick = (day) => {
    if (day) {
      const clickedDate = currentMonth.date(day);
      setSelectedDate(clickedDate);
      const tasksOnDate = tasks.filter(task => dayjs(task.dueDate).isSame(clickedDate, 'day'));
      setTasksForSelectedDate(tasksOnDate);
      setShowTasksForDate(true);
    }
  };

  const nextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));

  return (
    <Card title="Task Calendar" className="lg:col-span-1 xl:col-span-1">
      <div className="flex justify-between items-center mb-3">
        <Button onClick={prevMonth} variant="ghost" icon={ChevronLeft} />
        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
          {currentMonth.format('MMMM YYYY')}
        </h4>
        <Button onClick={nextMonth} variant="ghost" icon={ChevronRight} />
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
        {weekdays.map(day => <div key={day} className="py-1.5">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {monthStartPadding.map((_, index) => <div key={`empty-${index}`} className="h-10"></div>)}
        {daysArray.map(day => {
          const date = currentMonth.date(day).format('YYYY-MM-DD');
          const tasksOnDay = taskDates[date];
          const isToday = dayjs().isSame(currentMonth.date(day), 'day');
          const isSelected = selectedDate.isSame(currentMonth.date(day), 'day');

          return (
            <div
              key={day}
              className={`
                h-10 flex flex-col items-center justify-center rounded-lg cursor-pointer
                transition-all duration-200 ease-in-out relative group
                ${isToday ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${isSelected ? 'bg-blue-500 text-white shadow-lg scale-105' : ''}
              `}
              onClick={() => handleDateClick(day)}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm
                ${isSelected ? 'bg-white text-blue-600' : 'group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white'}
                ${isToday && !isSelected ? 'text-blue-700 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100'}
              `}>
                {day}
              </div>
              {tasksOnDay && (
                <div className="absolute bottom-0.5 flex space-x-0.5">
                  {tasksOnDay.completed > 0 && <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>}
                  {tasksOnDay.incomplete > 0 && <span className="w-1 h-1 bg-rose-500 rounded-full"></span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Modal
        isOpen={showTasksForDate}
        onClose={() => setShowTasksForDate(false)}
        title={`Tasks on ${selectedDate.format('MMMM DD, YYYY')}`}
      >
        {tasksForSelectedDate.length > 0 ? (
          <ul className="space-y-2">
            {tasksForSelectedDate.map(task => (
              <li
                key={task._id}
                className={`
                  p-3 rounded-xl transition-all duration-300 transform-gpu
                  ${task.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900 border-l-4 border-emerald-400' : 'bg-rose-50 dark:bg-rose-900 border-l-4 border-rose-400'}
                  hover:scale-[1.02] hover:shadow-lg
                `}
              >
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{task.title}</h5>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize ${
                    task.status === 'completed' ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100' : 'bg-rose-200 text-rose-800 dark:bg-rose-700 dark:text-rose-100'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Due: {dayjs(task.dueDate).format('MMM DD, YYYY')}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No tasks for this day.</p>
        )}
      </Modal>
    </Card>
  );
};

const TaskDistributionQuadrant = ({ tasks }) => {
  const { isDarkMode } = useTheme();
  const quadrantRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 200);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (quadrantRef.current) {
      observer.observe(quadrantRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const taskStats = useMemo(() => {
    const stats = {
      urgent: 0,
      important: 0,
      normal: 0,
      low: 0
    };

    tasks.forEach(task => {
      if (task.priority === 'high' && task.status !== 'completed') {
        stats.urgent++;
      } else if (task.priority === 'medium' && task.status !== 'completed') {
        stats.important++;
      } else if (task.priority === 'low' && task.status !== 'completed') {
        stats.normal++;
      } else {
        stats.low++;
      }
    });

    return stats;
  }, [tasks]);

  const quadrants = [
    {
      title: 'Urgent & Important',
      count: taskStats.urgent,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      darkTextColor: 'dark:text-red-400',
      bgColor: 'bg-red-50',
      darkBgColor: 'dark:bg-red-900/20',
      icon: Clock,
      delay: 0
    },
    {
      title: 'Important',
      count: taskStats.important,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      darkTextColor: 'dark:text-orange-400',
      bgColor: 'bg-orange-50',
      darkBgColor: 'dark:bg-orange-900/20',
      icon: Target,
      delay: 1
    },
    {
      title: 'Normal',
      count: taskStats.normal,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      darkTextColor: 'dark:text-blue-400',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20',
      icon: List,
      delay: 2
    },
    {
      title: 'Low Priority',
      count: taskStats.low,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      darkTextColor: 'dark:text-green-400',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-900/20',
      icon: CheckSquare,
      delay: 3
    }
  ];

  return (
    <Card title="Task Distribution" className="h-full" delay={0}>
      <div 
        ref={quadrantRef}
        className="grid grid-cols-1 gap-1.5 sm:gap-2 md:gap-3 h-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px]"
      >
        {quadrants.map((quadrant, index) => (
          <div
            key={quadrant.title}
            className={`flex flex-col items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 transition-all duration-700 transform hover:scale-105 group cursor-pointer relative overflow-hidden ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            } ${quadrant.bgColor} ${quadrant.darkBgColor} ${
              isDarkMode ? 'hover:bg-opacity-30' : 'hover:bg-opacity-80'
            }`}
            style={{ 
              animationDelay: `${quadrant.delay * 100}ms`,
              transitionDelay: `${quadrant.delay * 100}ms`,
              boxShadow: `0 4px 12px ${quadrant.color.replace('bg-', '').replace('-500', '')}20, 0 0 8px ${quadrant.color.replace('bg-', '').replace('-500', '')}10`
            }}
          >
            {/* Lightning Effect for each quadrant */}
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${quadrant.color.replace('bg-', '').replace('-500', '')}400/10 to-transparent animate-pulse`}></div>
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-${quadrant.color.replace('bg-', '').replace('-500', '')}400/5 to-transparent animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Enhanced Glowing Border Effect */}
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className={`absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-${quadrant.color.replace('bg-', '').replace('-500', '')}500/20 via-${quadrant.color.replace('bg-', '').replace('-500', '')}400/20 to-${quadrant.color.replace('bg-', '').replace('-500', '')}500/20 blur-sm`}></div>
            </div>

            <div className={`p-1 sm:p-1.5 md:p-2 rounded-lg ${quadrant.color} bg-opacity-20 mb-1 sm:mb-1.5 md:mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10`}
                 style={{
                   boxShadow: `0 2px 8px ${quadrant.color.replace('bg-', '').replace('-500', '')}30, 0 0 4px ${quadrant.color.replace('bg-', '').replace('-500', '')}20`
                 }}>
              <quadrant.icon 
                size={7} 
                className={`sm:w-4 sm:h-4 ${quadrant.textColor} ${quadrant.darkTextColor} group-hover:rotate-12 transition-transform duration-300`} 
              />
            </div>
            <div className="text-center relative z-10">
              <p className="text-sm sm:text-base md:text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">
                {quadrant.count}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-tight text-sm">
                {quadrant.title}
              </p>
            </div>
            
            {/* Enhanced Animated progress ring */}
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`w-full h-full ${quadrant.color} bg-opacity-5 animate-pulse`}></div>
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${quadrant.color.replace('bg-', '').replace('-500', '')}400/10 to-transparent animate-pulse`} style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary text */}
      <div className="mt-2 sm:mt-3 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Total: <span className="font-semibold text-gray-700 dark:text-gray-300">{tasks.length}</span> tasks
        </p>
      </div>
    </Card>
  );
};

const DailyTaskLoadRange = ({ tasks }) => {
  const taskLoadData = useMemo(() => {
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dailyCounts = daysOrder.reduce((acc, day) => {
      acc[day] = 0;
      return acc;
    }, {});

    tasks.forEach(task => {
      const day = task.day?.toLowerCase();
      if (dailyCounts.hasOwnProperty(day)) {
        dailyCounts[day] += 1;
      }
    });

    const maxTasks = Math.max(...Object.values(dailyCounts));

    return daysOrder.map(day => {
      const count = dailyCounts[day];
      // Normalize count to a 0-1 range for color interpolation
      const normalizedCount = maxTasks > 0 ? count / maxTasks : 0;
      // Interpolate between green and red
      const red = Math.round(255 * normalizedCount);
      const green = Math.round(255 * (1 - normalizedCount));
      const color = `rgb(${red}, ${green}, 0)`; // Green to Red gradient

      return {
        name: day.charAt(0).toUpperCase() + day.slice(1, 3),
        tasks: count,
        color: color,
      };
    });
  }, [tasks]);

  return (
    <Card title="Daily Task Load" className="h-full">
      <div className="relative group">
        {/* Lightning Effect for Chart */}
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/5 to-green-400/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-red-400/5 via-rose-400/3 to-red-400/5 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          
          {/* Sparkle effects for load range chart */}
          <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-sparkle" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-red-400 rounded-full animate-sparkle" style={{ animationDelay: '1.2s' }}></div>
        </div>
        
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={taskLoadData} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={50} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value, name) => [`${value} tasks`, 'Load']}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 0 20px rgba(34, 197, 94, 0.1)', 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(8px)', 
              color: '#333',
              fontSize: '11px',
              padding: '8px 12px'
            }}
            itemStyle={{ fontWeight: 'bold' }}
          />
            <Bar 
              dataKey="tasks" 
              barSize={12} 
              radius={[0, 6, 6, 0]}
              className="drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
              }}
            >
            {taskLoadData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="transition-all duration-300 hover:opacity-80 drop-shadow-md"
                  style={{
                    filter: `drop-shadow(0 2px 4px ${entry.color}40)`,
                  }}
                />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-2">
        <span>Low Load</span>
        <span>High Load</span>
      </div>
      <div className="w-full h-1 rounded-full bg-gradient-to-r from-green-500 to-red-500 mt-1 shadow-lg"></div>
    </Card>
  );
};



// --- Dashboard Component (Main App) ---
const Dashboard = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();
  
  const tasks = useSelector(selectTasks);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    username: '',
    role: 'User',
    avatar: 'https://placehold.co/100x100/A78BFA/ffffff?text=U',
    bio: ''
  });

  // Gemini API states
  const [showProjectSuggestionsModal, setShowProjectSuggestionsModal] = useState(false);
  const [currentProjectSuggestions, setCurrentProjectSuggestions] = useState('');
  const [isGeneratingProjectSuggestions, setIsGeneratingProjectSuggestions] = useState(false);

  // Scroll effect for mobile
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user profile data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        
        if (!token) {
          console.log("No token found");
          return;
        }

        // Set basic data from localStorage
        setUserProfile(prev => ({
          ...prev,
          email: email || '',
          name: email ? email.split('@')[0] : 'User',
          username: email ? email.split('@')[0] : 'user',
        }));

        // Try to fetch user profile from API
        try {
          const response = await axios.post(
            'https://taskserver-v7qf.onrender.com/api/users/profile',
            { token },
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (response.data && response.data.user) {
            const userData = response.data.user;
            setUserProfile(prev => ({
              ...prev,
              name: userData.username || userData.name || email.split('@')[0],
              email: userData.email || email,
              bio: userData.bio || 'No bio available',
              role: userData.role || 'User',
              avatar: userData.image || userData.avatar || `https://placehold.co/100x100/A78BFA/ffffff?text=${(userData.username || email.split('@')[0]).charAt(0).toUpperCase()}`,
              username: userData.username || email.split('@')[0],
            }));
          }
        } catch (error) {
          console.log('Could not fetch profile data, using localStorage data');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      if (!localStorage.getItem("token")) {
        console.log("No token found");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          "https://taskserver-v7qf.onrender.com/api/tasks/get",
          { token: localStorage.getItem("token") },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log(response.data.tasks, "tasks from dashboard");
        if (response.data && response.data.tasks) {
          dispatch(getAllTask({ tasks: response.data.tasks }));
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks. Please try again!', {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [dispatch, isDarkMode]);

  // Calculate task stats for charts
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const incompleteTasks = tasks.filter(task => task.status !== 'completed').length;

  const pieData = useMemo(() => ({
    completed: completedTasks,
    incomplete: incompleteTasks,
  }), [completedTasks, incompleteTasks]);

  // Function to call Gemini API for project suggestions (re-using the provided logic)
  const generateProjectSuggestions = async (project) => {
    setIsGeneratingProjectSuggestions(true);
    setCurrentProjectSuggestions('Generating suggestions...');
    setShowProjectSuggestionsModal(true);

    const prompt = `Given the project '${project.name}' with status '${project.status}' and ${project.progress}% complete, suggest detailed next steps to move it forward. Focus on actionable items. Keep it concise and list them as bullet points.`;

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = ""; // Leave as empty string for Canvas
    const apiUrl = `https://taskserver-v7qf.onrender.com/api/tasks/get`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      setCurrentProjectSuggestions(text || 'Failed to generate suggestions. Please try again.');
    } catch (error) {
      setCurrentProjectSuggestions('An error occurred while connecting to the API. Please try again.');
      console.error('Error calling Gemini API:', error);
    } finally {
      setIsGeneratingProjectSuggestions(false);
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDarkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'} font-sans antialiased relative overflow-x-hidden`}>
      <ToastContainer />
      
      {/* Animated Background Elements for Mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-x-hidden transition-all duration-500 relative z-10">
        {/* Enhanced Page Content */}
        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 overflow-y-auto">
          {/* Enhanced Header Section with Real User Data */}
          <div className="mb-3 sm:mb-4 md:mb-6 transform transition-all duration-700" style={{ 
            transform: `translateY(${Math.min(scrollY * 0.3, 50)}px)`,
            opacity: Math.max(1 - scrollY * 0.002, 0.8)
          }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
                  Overview
                </h2>
                <div className="flex items-center space-x-2.5">
                  <Avatar
                    user={userProfile}
                    size="md"
                    className="border-2 border-blue-500 dark:border-blue-400 shadow-lg"
                  />
                  <div>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{userProfile.name || userProfile.username || "User"}</span>!
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {userProfile.role} • {userProfile.email}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3">
                <div className={`p-1.5 sm:p-2 md:p-3 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 bg-green-500/20 rounded-lg">
                      <CheckSquare size={12} className="sm:w-3 sm:h-3 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                      <p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-1.5 sm:p-2 md:p-3 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 bg-red-500/20 rounded-lg">
                      <Clock size={12} className="sm:w-3 sm:h-3 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                      <p className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400">{incompleteTasks}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-1.5 sm:p-2 md:p-3 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 bg-blue-500/20 rounded-lg">
                      <Target size={12} className="sm:w-3 sm:h-3 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">{tasks.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-1.5 sm:p-2 md:p-3 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 bg-purple-500/20 rounded-lg">
                      <Award size={12} className="sm:w-3 sm:h-3 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
                      <p className="text-sm sm:text-base font-bold text-purple-600 dark:text-purple-400">
                        {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              {/* Enhanced Header Skeleton */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className="h-6 sm:h-8 md:h-10 lg:h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-2 w-32 sm:w-48 skeleton-shimmer"></div>
                <div className="h-3 sm:h-4 md:h-5 lg:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse w-60 sm:w-80 skeleton-shimmer"></div>
              </div>

              {/* Enhanced Dashboard Grid Skeleton - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {/* Task Distribution Quadrant Skeleton */}
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1 2xl:col-span-1">
                  <div className={`rounded-2xl shadow-lg border p-3 sm:p-4 md:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-3 sm:mb-4 w-28 sm:w-32 skeleton-shimmer"></div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 h-full min-h-[160px] sm:min-h-[180px] md:min-h-[200px]">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center justify-center rounded-xl p-2 sm:p-3 md:p-4 animate-pulse">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-9 md:h-9 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-full mb-1 sm:mb-2 skeleton-shimmer"></div>
                          <div className="h-3 sm:h-4 md:h-5 lg:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded w-6 sm:w-8 md:w-10 mb-1 skeleton-shimmer"></div>
                          <div className="h-2 sm:h-3 md:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded w-12 sm:w-16 md:w-20 skeleton-shimmer"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Daily Task Bar Chart Skeleton */}
                <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2">
                  <div className={`rounded-2xl shadow-lg border p-3 sm:p-4 md:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-3 sm:mb-4 w-36 sm:w-40 skeleton-shimmer"></div>
                    <div className="h-40 sm:h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Task Completion Pie Chart Skeleton */}
                <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1">
                  <div className={`rounded-2xl shadow-lg border p-3 sm:p-4 md:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-3 sm:mb-4 w-32 sm:w-36 skeleton-shimmer"></div>
                    <div className="h-32 sm:h-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Daily Task Load Range Skeleton */}
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1 2xl:col-span-1">
                  <div className={`rounded-2xl shadow-lg border p-3 sm:p-4 md:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-3 sm:mb-4 w-24 sm:w-28 skeleton-shimmer"></div>
                    <div className="h-24 sm:h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Task Trend Area Chart Skeleton */}
                <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2">
                  <div className={`rounded-2xl shadow-lg border p-3 sm:p-4 md:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-3 sm:mb-4 w-32 sm:w-36 skeleton-shimmer"></div>
                    <div className="h-40 sm:h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Task Calendar Skeleton */}
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1 2xl:col-span-1">
                  <div className={`rounded-2xl shadow-lg border p-3 sm:p-4 md:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-3 sm:mb-4 w-20 sm:w-24 skeleton-shimmer"></div>
                    <div className="h-40 sm:h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Projects Section Skeleton */}
                <div className="sm:col-span-2 lg:col-span-2 xl:col-span-3 2xl:col-span-3">
                  <div className={`rounded-2xl shadow-lg border p-3 sm:p-4 md:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-3 sm:mb-4 w-16 sm:w-20 skeleton-shimmer"></div>
                    <div className="space-y-2 sm:space-y-3">
                      {/* Table Header Skeleton */}
                      <div className="grid grid-cols-5 gap-2 sm:gap-4 py-2 sm:py-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded animate-pulse skeleton-shimmer"></div>
                        ))}
                      </div>
                      {/* Table Rows Skeleton */}
                      {[1, 2, 3, 4, 5].map((row) => (
                        <div key={row} className="grid grid-cols-5 gap-2 sm:gap-4 py-2 sm:py-3">
                          {[1, 2, 3, 4, 5].map((col) => (
                            <div key={col} className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded animate-pulse skeleton-shimmer"></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Loading Text */}
              <div className="text-center py-6 sm:py-8">
                <div className="inline-flex items-center space-x-2 sm:space-x-3 text-gray-500 dark:text-gray-400">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm font-medium">Loading your dashboard...</span>
                </div>
              </div>
            </div>
          ) : (
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-2 lg:gap-3 animate-fade-in">
              
              {/* Left Column - Bigger Width (3/4) */}
              <div className="lg:col-span-3 space-y-3 sm:space-y-4 md:space-y-6">
                
                {/* First Row: Pie Chart and Bar Chart */}
                <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 sm:gap-4 md:gap-2">
                  {/* Task Completion Pie Chart */}
                  <div className="sm:col-span-1 lg:col-span-1">
                    <Card title="Task Completion Rate" className="h-full" delay={2}>
                      <TaskCompletionPieChart data={pieData} />
                      
                    </Card>
                  </div>
                  <div className="sm:col-span-1 lg:col-span-2 w-full ">
                    <Card title="Task Due Date Trend" className="h-full" delay={3}>
                      <TaskTrendAreaChart data={tasks} isDarkMode={isDarkMode} />
                    </Card>
              </div>
              
              {/* Daily Task Bar Chart */}
                  <div className="sm:col-span-2 lg:col-span-3">
                <Card title="Daily Task Performance" className="h-full" delay={1}>
                  <DailyTaskBarChart data={tasks} />
                </Card>
              </div>
              </div>

                {/* Second Row: Line Chart and Calendar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-2 md:gap-2">
                  {/* Task Trend Area Chart */}
                

                  {/* Task Calendar */}
                  
                  <div className="sm:col-span-1 lg:col-span-1">
                    <TaskCalendar tasks={tasks} />
                  </div>
                  <div className="sm:col-span-1 lg:col-span-1">
                    <TaskReview tasks={tasks} />
                  </div>
              </div>


              </div>

              {/* Right Column - Smaller Width (1/4) */}
              <div className="lg:col-span-1 space-y-3 sm:space-y-4 md:space-y-6">
                {/* Task Distribution Quadrant */}
                <div className="w-full">
                <TaskDistributionQuadrant tasks={tasks} />
              </div>

                {/* Daily Task Load Range */}
                <div className="w-full">
                  <DailyTaskLoadRange tasks={tasks} />
                </div>
              </div>

              {/* Full Width: Projects Section */}
              <div className="lg:col-span-4 w-full">
                <Card title="My Tasks" className="h-full" delay={4}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700 rounded-t-2xl">
                        <tr>
                          <th scope="col" className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl dark:text-gray-400">
                            Task Name
                          </th>
                          <th scope="col" className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            Status
                          </th>
                          <th scope="col" className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            Priority
                          </th>
                          <th scope="col" className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            Due Date
                          </th>
                          <th scope="col" className="px-2 sm:px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl dark:text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {tasks.length > 0 ? (
                          tasks.slice(0, 10).map((task, index) => (
                            <tr key={task._id || task.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group transform hover:scale-[1.02]" style={{ animationDelay: `${index * 100}ms` }}>
                              <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-gray-100">
                                <div className="flex items-center">
                                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                    task.priority === 'high' ? 'bg-red-500' :
                                    task.priority === 'medium' ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}></div>
                                  {task.title || task.taskName || 'Untitled Task'}
                                </div>
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full capitalize transition-all duration-300 ${
                                  task.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100' :
                                  task.status === 'in progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                  task.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                                }`}>
                                  {task.status || 'pending'}
                                </span>
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full capitalize transition-all duration-300 ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                  'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                }`}>
                                  {task.priority || 'low'}
                                </span>
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap text-right text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Button
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-1 group"
                                  onClick={() => generateProjectSuggestions({
                                    name: task.title || task.taskName || 'Untitled Task',
                                    status: task.status || 'pending',
                                    progress: task.status === 'completed' ? 100 : task.status === 'in progress' ? 50 : 0
                                  })}
                                  disabled={isGeneratingProjectSuggestions}
                                  icon={Sparkles}
                                >
                                  {isGeneratingProjectSuggestions ? 'Generating...' : 'Suggest'}
                                </Button>
                                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-2 sm:px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                              <div className="flex flex-col items-center space-y-1.5">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  <List size={16} className="text-gray-400" />
                                </div>
                                <p className="text-xs font-medium">No tasks found</p>
                                <p className="text-xs">Create your first task to get started!</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Task Summary */}
                  {tasks.length > 0 && (
                    <div className="mt-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-600 dark:text-gray-400">
                            Total Tasks: <span className="font-semibold text-gray-900 dark:text-gray-100">{tasks.length}</span>
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            Completed: <span className="font-semibold text-green-600 dark:text-green-400">{completedTasks}</span>
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            Pending: <span className="font-semibold text-red-600 dark:text-red-400">{incompleteTasks}</span>
                          </span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Showing {Math.min(tasks.length, 10)} of {tasks.length} tasks
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </section>
          )}

        </main>
      </div>

      {/* Modals for Gemini API responses */}
      <Modal
        isOpen={showProjectSuggestionsModal}
        onClose={() => setShowProjectSuggestionsModal(false)}
        title="Suggested Next Steps"
      >
        <p className="whitespace-pre-wrap">{currentProjectSuggestions}</p>
      </Modal>

    </div>
  );
};

export default Dashboard;

// --- CSS Animations for Enhanced Visual Effects ---
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }

  @keyframes sparkle {
    0% { transform: scale(0) rotate(0deg); opacity: 0; }
    50% { transform: scale(1) rotate(180deg); opacity: 1; }
    100% { transform: scale(0) rotate(360deg); opacity: 0; }
  }

  @keyframes lightning {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  @keyframes electric-pulse {
    0%, 100% { opacity: 0; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.05); }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.6s ease-out;
  }

  .animate-pulse {
    animation: pulse 2s infinite ease-in-out;
  }

  .animate-sparkle {
    animation: sparkle 2s infinite ease-in-out;
  }

  .animate-lightning {
    animation: lightning 1.5s infinite ease-in-out;
  }

  .animate-electric-pulse {
    animation: electric-pulse 2s infinite ease-in-out;
  }

  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  .skeleton-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .drop-shadow-lg {
    filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  }

  .drop-shadow-md {
    filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// --- Mock data from the original code (keep for reference) ---

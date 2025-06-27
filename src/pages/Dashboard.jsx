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
import 'dayjs/locale/en';
import { getAllTask } from '../redux/TaskDetails';
import { useTheme } from '../ThemeContext';

// --- Enhanced Reusable Components ---

const Card = ({ title, children, className = '', headerContent = null, delay = 0 }) => {
  const { isDarkMode } = useTheme();
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
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
      className={`rounded-2xl shadow-lg border transition-all duration-700 hover:shadow-xl transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } ${className} ${
        isDarkMode 
          ? 'bg-gray-800/95 backdrop-blur-sm border-gray-700/50 text-gray-100 hover:bg-gray-800/98' 
          : 'bg-white/95 backdrop-blur-sm border-gray-200/50 text-gray-900 hover:bg-white/98'
      }`}
    >
      <div className={`p-4 sm:p-6 border-b ${
        isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            {title}
          </h3>
          {headerContent && <div>{headerContent}</div>}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, icon: Icon = null }) => {
  const { isDarkMode } = useTheme();
  
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg hover:shadow-blue-500/25",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
    link: "text-blue-600 hover:underline dark:text-blue-400",
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disabled}>
      {Icon && <Icon size={18} className={`${children ? "mr-2" : ""} transition-transform duration-200 group-hover:rotate-12`} />}
      {children}
    </button>
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
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
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
              className="transition-all duration-500 transform hover:scale-110"
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} tasks`, name]}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#333',
            fontSize: '12px',
            padding: '12px 16px'
          }}
          itemStyle={{ fontWeight: 'bold' }}
        />
        <Legend
          verticalAlign="bottom"
          height={30}
          iconType="circle"
          iconSize={8}
          formatter={(value, entry) => (
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
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
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.1)' }}
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)', 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(12px)', 
            color: '#333',
            fontSize: '12px',
            padding: '12px 16px'
          }}
          itemStyle={{ fontWeight: 'bold' }}
        />
        <Legend 
          iconType="circle" 
          iconSize={8}
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Bar dataKey="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Incomplete" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
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
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#4a4a4a' : '#e0e0e0'} />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            color: isDarkMode ? '#e5e7eb' : '#333',
            fontSize: '12px',
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
        </defs>
        <Area
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorCount)"
          strokeWidth={2}
          activeDot={{ r: 6, fill: '#8884d8', stroke: 'white', strokeWidth: 2 }}
          className="transition-all duration-500 ease-in-out"
        />
      </AreaChart>
    </ResponsiveContainer>
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
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth} variant="ghost" icon={ChevronLeft} />
        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {currentMonth.format('MMMM YYYY')}
        </h4>
        <Button onClick={nextMonth} variant="ghost" icon={ChevronRight} />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
        {weekdays.map(day => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {monthStartPadding.map((_, index) => <div key={`empty-${index}`} className="h-12"></div>)}
        {daysArray.map(day => {
          const date = currentMonth.date(day).format('YYYY-MM-DD');
          const tasksOnDay = taskDates[date];
          const isToday = dayjs().isSame(currentMonth.date(day), 'day');
          const isSelected = selectedDate.isSame(currentMonth.date(day), 'day');

          return (
            <div
              key={day}
              className={`
                h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer
                transition-all duration-200 ease-in-out relative group
                ${isToday ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${isSelected ? 'bg-blue-500 text-white shadow-lg scale-105' : ''}
              `}
              onClick={() => handleDateClick(day)}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold
                ${isSelected ? 'bg-white text-blue-600' : 'group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white'}
                ${isToday && !isSelected ? 'text-blue-700 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100'}
              `}>
                {day}
              </div>
              {tasksOnDay && (
                <div className="absolute bottom-1 flex space-x-1">
                  {tasksOnDay.completed > 0 && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
                  {tasksOnDay.incomplete > 0 && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>}
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
          <ul className="space-y-3">
            {tasksForSelectedDate.map(task => (
              <li
                key={task._id}
                className={`
                  p-4 rounded-xl transition-all duration-300 transform-gpu
                  ${task.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900 border-l-4 border-emerald-400' : 'bg-rose-50 dark:bg-rose-900 border-l-4 border-rose-400'}
                  hover:scale-[1.02] hover:shadow-lg
                `}
              >
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{task.title}</h5>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                    task.status === 'completed' ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100' : 'bg-rose-200 text-rose-800 dark:bg-rose-700 dark:text-rose-100'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Due: {dayjs(task.dueDate).format('MMM DD, YYYY')}</p>
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
        className="grid grid-cols-2 gap-3 sm:gap-4 h-full min-h-[200px] sm:min-h-[220px]"
      >
        {quadrants.map((quadrant, index) => (
          <div
            key={quadrant.title}
            className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-700 transform hover:scale-105 group cursor-pointer ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            } ${quadrant.bgColor} ${quadrant.darkBgColor} ${
              isDarkMode ? 'hover:bg-opacity-30' : 'hover:bg-opacity-80'
            }`}
            style={{ 
              animationDelay: `${quadrant.delay * 100}ms`,
              transitionDelay: `${quadrant.delay * 100}ms`
            }}
          >
            <div className={`p-2 sm:p-3 rounded-lg ${quadrant.color} bg-opacity-20 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <quadrant.icon 
                size={20} 
                className={`${quadrant.textColor} ${quadrant.darkTextColor} group-hover:rotate-12 transition-transform duration-300`} 
              />
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {quadrant.count}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">
                {quadrant.title}
              </p>
            </div>
            
            {/* Animated progress ring */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`w-full h-full ${quadrant.color} bg-opacity-5 animate-pulse`}></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary text */}
      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={taskLoadData} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={50} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) => [`${value} tasks`, 'Load']}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(8px)', 
              color: '#333',
              fontSize: '12px',
              padding: '8px 12px'
            }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Bar dataKey="tasks" barSize={15} radius={[0, 6, 6, 0]}>
            {taskLoadData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} className="transition-all duration-300 hover:opacity-80" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-2">
        <span>Low Load</span>
        <span>High Load</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-green-500 to-red-500 mt-1"></div>
    </Card>
  );
};

const OverallPerformanceCard = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const incompleteTasks = tasks.filter(task => task.status !== 'completed').length;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  // Mock data for trends (can be expanded with real data if available)
  const previousCompletionRate = 75.5; // Example
  const trend = completionRate >= previousCompletionRate ? 'up' : 'down';

  return (
    <Card title="Overall Performance" className="lg:col-span-1 xl:col-span-1">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900 rounded-lg transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800">
          <div className="flex items-center">
            <List size={24} className="text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900 rounded-lg transition-all duration-300 hover:bg-emerald-100 dark:hover:bg-emerald-800">
          <div className="flex items-center">
            <CheckSquare size={24} className="text-emerald-600 dark:text-emerald-400 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{completionRate}%</p>
            </div>
          </div>
          {trend === 'up' ? (
            <TrendingUp size={24} className="text-emerald-500" />
          ) : (
            <TrendingDown size={24} className="text-rose-500" />
          )}
        </div>
        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900 rounded-lg transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-800">
          <div className="flex items-center">
            <Clock size={24} className="text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Time to Complete</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">3.2 days</p> {/* Mock data */}
            </div>
          </div>
        </div>
      </div>
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
          "http://localhost:5000/api/tasks/get",
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
    const apiUrl = `http://localhost:5000/api/tasks/get`;

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
        <main className="flex-1 p-3 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
          {/* Enhanced Header Section */}
          <div className="mb-6 sm:mb-8 transform transition-all duration-700" style={{ 
            transform: `translateY(${Math.min(scrollY * 0.3, 50)}px)`,
            opacity: Math.max(1 - scrollY * 0.002, 0.8)
          }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
                  Overview
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{localStorage.getItem("username") || "John Doe"}</span>! Here's your task summary.
                </p>
              </div>
              
              {/* Quick Stats Cards for Mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckSquare size={16} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Clock size={16} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">{incompleteTasks}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Target size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{tasks.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Award size={16} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6 animate-fade-in">
              {/* Enhanced Header Skeleton */}
              <div className="mb-6 sm:mb-8">
                <div className="h-8 sm:h-10 md:h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-2 w-48 skeleton-shimmer"></div>
                <div className="h-4 sm:h-5 md:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse w-80 skeleton-shimmer"></div>
              </div>

              {/* Enhanced Dashboard Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {/* Task Distribution Quadrant Skeleton */}
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
                  <div className={`rounded-2xl shadow-lg border p-4 sm:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-4 w-32 skeleton-shimmer"></div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 h-full min-h-[180px] sm:min-h-[200px]">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center justify-center rounded-xl p-2 sm:p-4 animate-pulse">
                          <div className="w-6 h-6 sm:w-9 sm:h-9 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-full mb-1 sm:mb-2 skeleton-shimmer"></div>
                          <div className="h-4 sm:h-5 md:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded w-8 sm:w-10 mb-1 skeleton-shimmer"></div>
                          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded w-16 sm:w-20 skeleton-shimmer"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Daily Task Bar Chart Skeleton */}
                <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
                  <div className={`rounded-2xl shadow-lg border p-4 sm:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-4 w-40 skeleton-shimmer"></div>
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Task Completion Pie Chart Skeleton */}
                <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1">
                  <div className={`rounded-2xl shadow-lg border p-4 sm:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-4 w-36 skeleton-shimmer"></div>
                    <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Daily Task Load Range Skeleton */}
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
                  <div className={`rounded-2xl shadow-lg border p-4 sm:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-4 w-28 skeleton-shimmer"></div>
                    <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Task Trend Area Chart Skeleton */}
                <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
                  <div className={`rounded-2xl shadow-lg border p-4 sm:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-4 w-36 skeleton-shimmer"></div>
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Task Calendar Skeleton */}
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
                  <div className={`rounded-2xl shadow-lg border p-4 sm:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-4 w-24 skeleton-shimmer"></div>
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse skeleton-shimmer"></div>
                  </div>
                </div>

                {/* Projects Section Skeleton */}
                <div className="sm:col-span-2 lg:col-span-2 xl:col-span-3">
                  <div className={`rounded-2xl shadow-lg border p-4 sm:p-6 h-full backdrop-blur-sm ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'
                  }`}>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-4 w-20 skeleton-shimmer"></div>
                    <div className="space-y-3">
                      {/* Table Header Skeleton */}
                      <div className="grid grid-cols-5 gap-4 py-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded animate-pulse skeleton-shimmer"></div>
                        ))}
                      </div>
                      {/* Table Rows Skeleton */}
                      {[1, 2, 3, 4, 5].map((row) => (
                        <div key={row} className="grid grid-cols-5 gap-4 py-3">
                          {[1, 2, 3, 4, 5].map((col) => (
                            <div key={col} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded animate-pulse skeleton-shimmer"></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Loading Text */}
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Loading your dashboard...</span>
                </div>
              </div>
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 animate-fade-in">

              {/* Task Distribution Quadrant */}
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
                <TaskDistributionQuadrant tasks={tasks} />
              </div>

              {/* Daily Task Bar Chart */}
              <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
                <Card title="Daily Task Performance" className="h-full" delay={1}>
                  <DailyTaskBarChart data={tasks} />
                </Card>
              </div>

              {/* Task Completion Pie Chart */}
              <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1">
                <Card title="Task Completion Rate" className="h-full" delay={2}>
                  <TaskCompletionPieChart data={pieData} />
                </Card>
              </div>

              {/* Daily Task Load Range */}
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
                <DailyTaskLoadRange tasks={tasks} />
              </div>

              {/* Task Trend Area Chart */}
              <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
                <Card title="Task Due Date Trend" className="h-full" delay={3}>
                  <TaskTrendAreaChart data={tasks} isDarkMode={isDarkMode} />
                </Card>
              </div>

              {/* Task Calendar */}
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
                <TaskCalendar tasks={tasks} />
              </div>

              {/* Projects Section */}
              <div className="sm:col-span-2 lg:col-span-2 xl:col-span-3">
                <Card title="Projects" className="h-full" delay={4}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700 rounded-t-2xl">
                        <tr>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl dark:text-gray-400">
                            Project Name
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            Status
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            Progress
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            Due Date
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl dark:text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {mockProjects.map((project, index) => (
                          <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group transform hover:scale-[1.02]" style={{ animationDelay: `${index * 100}ms` }}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              {project.name}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize transition-all duration-300 ${
                                project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100' :
                                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="w-20 sm:w-28 bg-gray-200 rounded-full h-2 sm:h-3 dark:bg-gray-700">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-700 ease-out" style={{ width: `${project.progress}%` }}></div>
                              </div>
                              <span className="ml-2 text-xs font-medium">{project.progress}%</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {project.dueDate}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Button
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2 group"
                                onClick={() => generateProjectSuggestions(project)}
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
                        ))}
                      </tbody>
                    </table>
                  </div>
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

// --- Mock data from the original code (keep for reference) ---
const mockProjects = [
  { id: 1, name: 'Landing/Page Design', status: 'In Progress', progress: 75, members: ['Alice', 'Bob'], dueDate: 'Jun 16, 2025' },
  { id: 2, name: 'Website Redesign', status: 'Completed', progress: 100, members: ['Charlie', 'David'], dueDate: 'Jun 10, 2025' },
  { id: 3, name: 'Mobile App UI/UX', status: 'Pending', progress: 30, members: ['Eve'], dueDate: 'Jul 20, 2025' },
  { id: 4, name: 'Brand Identity', status: 'In Progress', progress: 60, members: ['Frank', 'Grace'], dueDate: 'Jul 05, 2025' },
  { id: 5, name: 'Dashboard UI', status: 'In Progress', progress: 85, members: ['Heidi'], dueDate: 'Jun 28, 2025' },]
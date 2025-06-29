import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Folder, CheckSquare, Settings, Users, LogOut, UserCircle, X, Sun, Moon } from 'lucide-react';
import { useAuth } from "../Auth/AuthProtectComponents";
import { useTheme } from '../ThemeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from './Avatar';

const TSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [userData, setUserData] = useState({
    name: 'User',
    email: '',
    role: 'User',
    avatar: 'https://placehold.co/100x100/A78BFA/ffffff?text=U'
  });

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');
      
      if (email && token) {
        const name = email.split('@')[0];
        setUserData({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: email,
          role: 'Admin', // You can make this dynamic based on user role from API
          avatar: `https://placehold.co/100x100/A78BFA/ffffff?text=${name.charAt(0).toUpperCase()}`
        });
      }
    };

    loadUserData();
  }, []);

  const menuItems = [
    { text: "Overview", icon: Home, path: "/" },
    { text: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { text: "Projects", icon: Folder, path: "/projects" },
    { text: "Tasks", icon: CheckSquare, path: "/tasks" },
    { text: "Team", icon: Users, path: "/team" },
    { text: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
    toggleSidebar();
    toast.success('Logged out successfully!', {
      position: "top-right",
      autoClose: 3000,
      theme: isDarkMode ? "dark" : "light",
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-label="Close sidebar overlay"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-42 transition-all duration-500 ease-in-out transform
          md:translate-x-0 md:static md:flex md:flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isDarkMode ? 'bg-gray-900 text-white shadow-2xl' : 'bg-white text-gray-900 shadow-2xl'}
          rounded-r-3xl md:rounded-none border-r border-gray-200 dark:border-gray-800
        `}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="text-2xl font-bold text-blue-500 dark:text-blue-400 tracking-tight">TaskFlow</Link>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-2 py-6 overflow-y-auto">
          <ul>
            {menuItems.map((item) => (
              <li key={item.text} className="mb-2">
                <NavLink
                  to={item.path}
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.03] group
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'}
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} className={`mr-1 transition-colors duration-300 ${isActive ? 'text-white' : isDarkMode ? 'text-blue-400 group-hover:text-white' : 'text-blue-500 group-hover:text-blue-700'}`} />
                      <span className="font-medium">{item.text}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li className="mb-2 mt-8 flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`w-full flex items-center p-3 rounded-xl transition-colors duration-300 font-semibold
                  ${isDarkMode ? 'bg-gray-800 text-blue-300 hover:bg-gray-700' : 'bg-gray-100 text-blue-700 hover:bg-blue-100'}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} className="mr-3 text-yellow-400" /> : <Moon size={20} className="mr-3 text-gray-600" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </li>
            <li className="mb-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-300 font-semibold"
                aria-label="Logout"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
        {/* User profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Avatar 
              size="md"
              className="mr-3"
              showTooltip={true}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{userData.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userData.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TSidebar;

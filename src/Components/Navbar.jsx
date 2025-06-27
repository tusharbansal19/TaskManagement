import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProtectComponents";
import { Menu, X, Sun, Moon, LogOut, UserCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for profile dropdown
  const dropdownRef = useRef(null);
  const navigator = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  const menuItems = [
    { label: "Overview", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Projects", path: "/projects" },
    { label: "Tasks", path: "/tasks" },
    { label: "Team", path: "/team" },
    { label: "Settings", path: "/settings" },
  ];

  // Handle outside click to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setShowNavbar(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigator("/login");
    setDropdownOpen(false);
  };

  return (
    <nav className={`fixed z-[100] w-full p-4 shadow-md transition-colors duration-300
      ${isDarkMode ? 'bg-gray-900 text-gray-100 shadow-lg' : 'bg-white text-gray-900 shadow-md'}
      transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ willChange: 'transform' }}>
      <div className="relative z-10 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="https://placehold.co/40x40/8B5CF6/FFFFFF?text=Logo"
            alt="Logo"
            className="h-10 w-10 rounded-full border-2 border-purple-500 group-hover:border-blue-400 transition-colors duration-300"
          />
          <span className={`ml-3 text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>TaskFlow</span>
        </Link>

        {/* Hamburger Icon for Mobile - Toggles Sidebar */}
        <button
          className={`block md:hidden p-2 rounded-md transition-colors duration-300
            ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `relative text-lg font-medium transition-colors duration-300 px-2 py-1
                ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                ${isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full transform scale-x-100 transition-transform duration-300
                      ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Theme Toggle Button (Desktop) */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors duration-300
              ${isDarkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-100 text-yellow-600 hover:bg-gray-200'}`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile Image and Dropdown (Desktop) */}
          <div className="relative ml-4" ref={dropdownRef}>
            <img
              src="https://placehold.co/40x40/8B5CF6/FFFFFF?text=JD"
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-400 transition-colors duration-300"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
            {dropdownOpen && (
              <div
                className={`absolute top-12 right-0 w-48 rounded-lg shadow-xl p-3 transition-all duration-300 transform origin-top-right
                  ${isDarkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}
              >
                <p className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{localStorage.getItem("username") || "Guest User"}</p>
                <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{localStorage.getItem("email") || "guest@example.com"}</p>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-center px-3 py-2 rounded-md font-medium transition-colors duration-300
                    ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
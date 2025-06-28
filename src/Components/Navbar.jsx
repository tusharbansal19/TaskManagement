import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProtectComponents"; // Assuming this path is correct
import { Menu, X, Sun, Moon, LogOut, UserCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext'; // Assuming this path is correct
import Avatar from './Avatar';

const HIGHLIGHT_RECT_WIDTH = 120; // Slightly wider for better visual effect
const HIGHLIGHT_RECT_HEIGHT = 44; // Slightly taller for better coverage

const Navbar = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  // Enhanced state for the moving highlight rectangle
  const [highlightStyle, setHighlightStyle] = useState({ 
    left: 0, 
    width: 0, 
    opacity: 0,
    transform: 'scaleX(0)',
    transformOrigin: 'center'
  });
  const navRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

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
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced effect for the moving highlight rectangle
  useEffect(() => {
    const updateHighlight = () => {
      if (!navRef.current) return;

      const activeLink = navRef.current.querySelector('.active-nav-link');
      
      if (activeLink && !isHovering) {
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const newLeft = linkRect.left - navRect.left + (linkRect.width / 2) - (HIGHLIGHT_RECT_WIDTH / 2);
        
        setHighlightStyle({
          left: newLeft,
          width: HIGHLIGHT_RECT_WIDTH,
          opacity: 1,
          transform: 'scaleX(1)',
          transformOrigin: 'center'
        });
      } else if (!isHovering) {
        setHighlightStyle({ 
          left: 0, 
          width: 0, 
          opacity: 0,
          transform: 'scaleX(0)',
          transformOrigin: 'center'
        });
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);

    const observer = new MutationObserver(updateHighlight);
    if (navRef.current) {
      observer.observe(navRef.current, { attributes: true, subtree: true, childList: true });
    }

    return () => {
      window.removeEventListener('resize', updateHighlight);
      observer.disconnect();
    };
  }, [navigate, isHovering]);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
    setDropdownOpen(false);
  };

  const handleNavItemHover = (e, isEntering) => {
    if (!navRef.current) return;

    setIsHovering(isEntering);

    if (isEntering) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = e.currentTarget.getBoundingClientRect();
      const newLeft = linkRect.left - navRect.left + (linkRect.width / 2) - (HIGHLIGHT_RECT_WIDTH / 2);

      setHighlightStyle({
        left: newLeft,
        width: HIGHLIGHT_RECT_WIDTH,
        opacity: 1,
        transform: 'scaleX(1)',
        transformOrigin: 'center'
      });
    } else {
      // On mouse leave, revert to active link position
      const activeLink = navRef.current.querySelector('.active-nav-link');
      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const newLeft = linkRect.left - navRect.left + (linkRect.width / 2) - (HIGHLIGHT_RECT_WIDTH / 2);
        
        setHighlightStyle({
          left: newLeft,
          width: HIGHLIGHT_RECT_WIDTH,
          opacity: 1,
          transform: 'scaleX(1)',
          transformOrigin: 'center'
        });
      } else {
        setHighlightStyle({ 
          left: 0, 
          width: 0, 
          opacity: 0,
          transform: 'scaleX(0)',
          transformOrigin: 'center'
        });
      }
    }
  };

  return (
    <nav className={`fixed z-[100] w-full p-4 shadow-md transition-all duration-300
      ${isDarkMode ? 'bg-gray-900/95 backdrop-blur-md text-gray-100 shadow-lg' : 'bg-white/95 backdrop-blur-md text-gray-900 shadow-md'}
      ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ willChange: 'transform' }}>
      <div className="relative z-10 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="https://placehold.co/40x40/8B5CF6/FFFFFF?text=Logo"
            alt="Logo"
            className="h-10 w-10 rounded-full border-2 border-purple-500 group-hover:border-blue-400 transition-colors duration-300 transform group-hover:rotate-6"
          />
          <span className={`ml-3 text-2xl font-extrabold transition-colors duration-300
            ${isDarkMode ? 'text-white' : 'text-gray-800'}
            text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600`}>
            TaskFlow
          </span>
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
        <div className="hidden md:flex items-center space-x-6 relative" ref={navRef}>
          {/* Enhanced Moving Highlight Rectangle */}
          <div
            className={`absolute rounded-xl transition-all duration-500 ease-out z-10
              ${isDarkMode 
                ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 shadow-lg shadow-blue-500/20' 
                : 'bg-gradient-to-r from-blue-500/25 to-purple-500/25 shadow-lg shadow-blue-500/15'
              }`}
            style={{
              left: highlightStyle.left,
              width: highlightStyle.width,
              opacity: highlightStyle.opacity,
              height: HIGHLIGHT_RECT_HEIGHT,
              top: '50%',
              transform: `translateY(-50%) ${highlightStyle.transform}`,
              transformOrigin: highlightStyle.transformOrigin,
              backdropFilter: 'blur(8px)',
              border: isDarkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(59, 130, 246, 0.15)'
            }}
          ></div>

          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `relative text-lg font-medium transition-all duration-300 px-4 py-2 rounded-lg z-20 flex items-center justify-center min-h-[${HIGHLIGHT_RECT_HEIGHT}px]
                ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                ${isActive ? (isDarkMode ? 'text-blue-400 active-nav-link font-semibold' : 'text-blue-600 active-nav-link font-semibold') : ''}
                hover:scale-105 transform transition-transform duration-200`
              }
              onMouseEnter={(e) => handleNavItemHover(e, true)}
              onMouseLeave={(e) => handleNavItemHover(e, false)}
            >
              {item.label}
            </NavLink>
          ))}

          {/* Theme Toggle Button (Desktop) */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95
              ${isDarkMode ? 'bg-gray-700/50 text-yellow-300 hover:bg-gray-600/70' : 'bg-gray-100/70 text-yellow-600 hover:bg-gray-200/80'}`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile Image and Dropdown (Desktop) */}
          <div className="relative ml-4" ref={dropdownRef}>
            <Avatar
              size="md"
              onClick={() => setDropdownOpen((prev) => !prev)}
              showTooltip={true}
              className="cursor-pointer"
            />
            {dropdownOpen && (
              <div
                className={`absolute top-12 right-0 w-48 rounded-xl shadow-xl p-3 transition-all duration-300 transform origin-top-right animate-scale-in
                  ${isDarkMode ? 'bg-gray-800/95 backdrop-blur-md text-gray-100 border border-gray-700/50' : 'bg-white/95 backdrop-blur-md text-gray-900 border border-gray-200/50'}`}
              >
                <div className="flex items-center mb-3">
                  <Avatar size="sm" className="mr-3" />
                  <div>
                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {localStorage.getItem("username") || localStorage.getItem("email")?.split('@')[0] || "Guest User"}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {localStorage.getItem("email") || "guest@example.com"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95
                    ${isDarkMode ? 'bg-red-600/80 hover:bg-red-700/90 text-white' : 'bg-red-500/80 hover:bg-red-600/90 text-white'}`}
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
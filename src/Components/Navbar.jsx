import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProtectComponents";

const Navbar = () => {
  const {logout}=useAuth();
  const [activeIndex, setActiveIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu toggle
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for profile dropdown
  const dropdownRef = useRef(null);
const navigator=useNavigate();
  const menuItems = [
    
    { label: "Home", path: "/" },
    { label: "Create", path: "/tasks" },
    { label: "Daily", path: "/daily" },
  

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

  return (
    <nav className="fixed z-[100] w-full text-white p-4 shadow-md bg-[#2A265F]">
      <div className="relative z-10 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src=".\public\image\Screenshot 2025-02-01 140605.png"
            alt="Logo"
            className="h-[40px] border-white border-2 rounded-sm hover:border-blue-950"
          />
        </Link>

        {/* Hamburger Icon for Mobile */}
        <button
          className="block md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation Menu */}
        <div className="flex items-center">
          <ul
            className={`absolute md:static top-16 left-0 w-full md:w-auto md:flex bg-black md:bg-transparent transition-transform duration-300 ${
              menuOpen ? "translate-y-0" : "translate-y-[-300px]"
            } md:translate-y-0`}
          >
            {/* Sliding Box Effect */}
            <div
              className={`absolute bg-purple-800 bg-opacity-50 rounded-lg transition-all duration-300 hidden md:block`}
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                left:
                  activeIndex !== null
                    ? `${(activeIndex * 100) / menuItems.length}%`
                    : "-100%",
                width:
                  activeIndex !== null
                    ? `calc(100% / ${menuItems.length})`
                    : "0",
                height: "40px",
              }}
            ></div>

            {/* Menu Items */}
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="relative z-50 px-4 py-2 text-sm flex items-center space-x-2 cursor-pointer hover:text-yellow-300 transition-colors duration-300"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Link
                  to={item.path}
                  className="flex items-center space-x-2"
                  onClick={() => setMenuOpen(false)} // Close menu when an item is clicked
                >
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Profile Image and Dropdown */}
          <div className="relative ml-4" ref={dropdownRef}>
            <img
              src="" // Placeholder image
              alt={"t"}
              className="w-10 h-10 rounded-full bg-white cursor-pointer flex justify-center items-center bg-opacity-25"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
            {dropdownOpen && (
              <div
              style={{
                position: "absolute",
                top: "50px",
                right: 0,
                backgroundColor: "#2a2a40",
                color: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                padding: "10px",
                minWidth: "200px",
              }}
            >
              <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                {localStorage.getItem("username")}
              </p>
              <p style={{ margin: "5px 0", fontSize: "12px", color: "#aaa" }}>
                {localStorage.getItem("email")}
              </p>
              <button
                onClick={() => {
                  
                  // Redirect to login page after logout
                  // Close menu after logout
                  
                  logout();
                  navigator("/login")
                  setDropdownOpen(false);
                  localStorage.clear("username");
                  localStorage.clear("email");
                  localStorage.clear("token");
                  // return <Nanigate to="/login"/> // Close dropdown after logout
                 
                }}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#f00",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
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

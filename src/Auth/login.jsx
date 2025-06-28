import axios from 'axios';
import React, { useState } from "react";
import { FaEnvelope, FaImage, FaLock, FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa"; // Added FaSignInAlt, FaUserPlus
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProtectComponents"; // Assuming this path is correct
import { useDispatch } from 'react-redux'; // Assuming redux is set up
import { getAllTask } from '../redux/TaskDetails'; // Assuming this path is correct
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../ThemeContext';
import PageLoader from '../Components/PageLoader';

const Sub = () => { // Renamed 'sub' to 'Sub' for React component naming convention
  const navigator = useNavigate();
  const { login } = useAuth();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loader state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setErrors({}); // Clear errors on input change
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (activeTab === "signup") {
      if (!formData.name.trim()) newErrors.name = "Name is required.";
      if (!formData.email.includes("@")) newErrors.email = "Invalid email.";
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";
    } else {
      if (!formData.email.trim()) newErrors.email = "Email is required."; // Added trim for email
      if (!formData.email.includes("@")) newErrors.email = "Invalid email.";
      if (!formData.password.trim())
        newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true); // Start loader
      try {
        const url =
          activeTab === "signup"
            ? "http://localhost:5000/api/users/register"
            : "http://localhost:5000/api/users/login";
        
        // Prepare payload based on activeTab
        const payload = activeTab === "signup"
          ? { email: formData.email, password: formData.password, image: formData.profileImage, username: formData.name }
          : { email: formData.email, password: formData.password };

        // Make the POST request with Axios
        const response = await axios.post(url, payload);
        const data = response.data; // Axios automatically parses the JSON response

        if ((response.status === 200 || response.status === 201) && data.success !== false) {
          login();
          navigator("/"); // Redirect on successful login/signup
          localStorage.setItem("email", formData.email);
          localStorage.setItem("token", data.token);
          // Dispatch tasks if available in the response
          if (data.user && data.user.tasks) {
            dispatch(getAllTask({ tasks: data.user.tasks }));
          }
          toast.success(`${activeTab === "signup" ? "Signup" : "Login"} successful!`, { position: "top-right", autoClose: 3000, theme: "dark" });
        } else {
          const errorMsg = data.message || data.error || "Something went wrong!";
          setErrors({ apiError: errorMsg });
          toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "dark" });
        }
      } catch (error) {
        const errorMsg = error.response && (error.response.data.message || error.response.data.error)
          ? (error.response.data.message || error.response.data.error)
          : "Network error. Please try again later.";
        setErrors({ apiError: errorMsg });
        toast.error(errorMsg, { position: "top-right", autoClose: 3000, theme: "dark" });
      } finally {
        setIsLoading(false); // Stop loader after API call is done
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-600 to-purple-800'} text-white font-inter p-4 sm:p-6`}>
      <ToastContainer />
      <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-6 sm:p-8 relative transform transition-all duration-500 ease-in-out scale-95 hover:scale-100 animate-fade-in`}>
        {/* Tabs */}
        <div className="flex justify-around mb-8 border-b-2 border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 text-lg font-bold transition-all duration-300 relative group
              ${activeTab === "signup" ? "text-purple-600 dark:text-purple-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
          >
            <FaUserPlus className="inline-block mr-2 text-xl" /> Signup
            <span className={`absolute bottom-0 left-0 w-full h-1 bg-purple-600 dark:bg-purple-400 transform transition-transform duration-300 ${activeTab === "signup" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}`}></span>
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-lg font-bold transition-all duration-300 relative group
              ${activeTab === "login" ? "text-purple-600 dark:text-purple-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
          >
            <FaSignInAlt className="inline-block mr-2 text-xl" /> Login
            <span className={`absolute bottom-0 left-0 w-full h-1 bg-purple-600 dark:bg-purple-400 transform transition-transform duration-300 ${activeTab === "login" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}`}></span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === "signup" && (
            <>
              <div className="relative group">
                <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className={`w-full pl-10 pr-3 py-3 ${isDarkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                    ${errors.name ? "border border-red-500" : "border border-gray-200 dark:border-gray-600"}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.name}</p>}
              </div>
              <div className="relative group">
                <FaImage className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${isDarkMode ? 'file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500' : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'}`}
                  accept="image/*"
                />
              </div>
            </>
          )}
          <div className="relative group">
            <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full pl-10 pr-3 py-3 ${isDarkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                ${errors.email ? "border border-red-500" : "border border-gray-200 dark:border-gray-600"}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.email}</p>}
          </div>
          <div className="relative group">
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full pl-10 pr-3 py-3 ${isDarkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                ${errors.password ? "border border-red-500" : "border border-gray-200 dark:border-gray-600"}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.password}</p>}
          </div>
          {activeTab === "signup" && (
            <div className="relative group">
              <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-3 py-3 ${isDarkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                  ${errors.confirmPassword ? "border border-red-500" : "border border-gray-200 dark:border-gray-600"}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-lg font-bold text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <PageLoader 
                isLoading={isLoading} 
                loadingMessage={activeTab === "signup" ? "Creating Account..." : "Signing In..."}
                dynamicMessages={
                  activeTab === "signup" 
                    ? ['Creating your account...', 'Setting up profile...', 'Almost ready...']
                    : ['Authenticating...', 'Verifying credentials...', 'Almost done...']
                }
              />
            ) : (
              activeTab === "signup" ? "Signup" : "Login"
            )}
          </button>

          {/* Show API errors */}
          {errors.apiError && <p className="text-red-500 text-center text-sm mt-4 animate-fade-in">{errors.apiError}</p>}
        </form>
      </div>
    </div>
  );
};

export default Sub;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBgColor,
  setBgGradient,
  setTextColor,
  setTextGradient,
  setTextSize,
  setIconColor,
} from "../features/styleSlice";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useTheme } from '../ThemeContext';

const ContactUsPage = () => {
  const dispatch = useDispatch();
  const styleSettings = useSelector((state) => state.style);
  const { isDarkMode } = useTheme();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Thank you for contacting us!");
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  // Predefined options for selectors
  const colorOptions = [
    "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff", "#000000",
  ];

  const gradientOptions = [
    "linear-gradient(to right, red, yellow)",
    "linear-gradient(to bottom, blue, green)",
    "radial-gradient(circle, pink, purple)",
    "conic-gradient(from 0deg, orange, yellow, green, blue, purple, red)",
  ];

  const textSizeOptions = ["12px", "16px", "20px", "24px", "32px", "40px"];

  return (
    <div
      className=" pt-20 "
     
    >
      {/* Page Header */}
      <header className="text-center mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{
            background: styleSettings.textGradient,
            WebkitBackgroundClip: styleSettings.textGradient ? "text" : "initial",
       
          }}
        >
          Contact Us
        </h1>
        <p className="text-lg text-black opacity-80">
          We'd love to hear from you! Feel free to reach out using the form below.
        </p>
      </header>

     

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto text-white  italic font-extrabold bg-white   p-8 rounded-lg shadow-md"  style={{
          background: styleSettings.bgGradient || styleSettings.bgColor, color: styleSettings.textColor || "black",
        }}
      > 
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm  mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-white text-white  rounded-lg focus:ring-2 focus:ring-sky-500"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm     font-extrabold  mb-2">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-white   text-white rounded-lg focus:ring-2 focus:ring-sky-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm     font-extrabold  mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 bg-white  text-white rounded-lg focus:ring-2 focus:ring-sky-500"
            placeholder="Write your message"
            rows="5"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-indigo-600 hover:to-sky-500 text-white rounded-lg     font-extrabold "
        >
          {loading ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            <>
              <FaPaperPlane className="mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactUsPage;

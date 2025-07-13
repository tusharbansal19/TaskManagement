import React from "react";
import { Facebook, Twitter, Instagram, Github, Linkedin } from "lucide-react"; // Changed from react-feather to lucide-react

// The Footer component now accepts an 'isDarkMode' prop to adjust its theme
const Footer = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-6 pb-20 border-t transition-colors duration-300
      ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-gray-800 border-gray-200 text-gray-300'}`}>
      <div className="container mx-auto text-center px-4">
        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-4">
          {/* Enhanced social icon links with hover effects and consistent theme */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transform hover:scale-110 transition duration-300 ease-in-out
              ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-300 hover:text-blue-500'}`}
            aria-label="Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transform hover:scale-110 transition duration-300 ease-in-out
              ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-300 hover:text-blue-500'}`}
            aria-label="Twitter"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transform hover:scale-110 transition duration-300 ease-in-out
              ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-300 hover:text-blue-500'}`}
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transform hover:scale-110 transition duration-300 ease-in-out
              ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-300 hover:text-blue-500'}`}
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transform hover:scale-110 transition duration-300 ease-in-out
              ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-300 hover:text-blue-500'}`}
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
        </div>

        {/* Footer Text */}
        <p className={`text-sm transition-colors duration-300
          ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          © {currentYear} DesignerFlow. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
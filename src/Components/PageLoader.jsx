import React from 'react';

const FullScreenLoader = ({ isLoading = true, isDarkMode = false }) => {
  if (!isLoading) return null;

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center z-[9999]
        backdrop-blur-xl transition-all duration-500
        ${isDarkMode ? 'bg-gray-950 bg-opacity-80' : 'bg-white bg-opacity-80'}
      `}
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer pulsating circle */}
        <div className={`
          absolute w-48 h-48 rounded-full border-4 border-blue-500 border-t-transparent
          animate-spin-slow opacity-70
          ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}
        `}></div>

        {/* Inner rotating squares */}
        <div className="absolute w-32 h-32 flex items-center justify-center animate-rotate-reverse">
          <div className={`
            absolute w-20 h-20 bg-purple-500 rounded-lg transform rotate-45
            transition-colors duration-300
            ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'}
          `}></div>
          <div className={`
            absolute w-16 h-16 bg-emerald-500 rounded-lg transform rotate-45 animate-pulse-slow
            transition-colors duration-300
            ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'}
          `}></div>
        </div>

        {/* Central glowing dot */}
        <div className={`
          absolute w-8 h-8 rounded-full bg-blue-500 shadow-glow
          transition-colors duration-300 animate-bounce-slow
          ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}
        `}></div>

        {/* Loading Text */}
        <p className={`
          absolute bottom-12 text-xl font-bold text-gray-800 dark:text-gray-100
          animate-fade-in-out transition-colors duration-300
        `}>
          Loading...
        </p>
      </div>

      {/* Tailwind CSS Custom Animations (add these to your main CSS file or a <style> tag if not using PostCSS) */}
      {/*
      <style>
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotate-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-10px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(10px); }
        }
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-rotate-reverse {
          animation: rotate-reverse 5s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite alternate;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite;
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s infinite alternate;
        }
        .shadow-glow {
          box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.7);
        }
      </style>
      */}
    </div>
  );
};

export default FullScreenLoader;
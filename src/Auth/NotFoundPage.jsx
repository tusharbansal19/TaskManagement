import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from '../ThemeContext';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} text-center p-6`}>
      <motion.h1 
        className={`text-7xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.h2 
        className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-4`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Oops! Page Not Found
      </motion.h2>
      <motion.p 
        className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 max-w-md`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        The page you are looking for might have been removed or is temporarily unavailable.
      </motion.p>
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <button onClick={() => navigate("/")} className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Go Back Home
        </button>
      </motion.div>
    </div>
  );
}

import { useTheme } from '../ThemeContext';

const Loader = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`animate-spin rounded-full h-32 w-32 border-t-4 ${isDarkMode ? 'border-blue-400' : 'border-red-500'}`}></div>
    </div>
  );
};

export default Loader;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'; // VERIFY PATH: Ensure this is the correct path to your Redux store (e.g., './store' if in root, or './redux/store' if in a 'redux' folder)
import { AuthProvider, ProtectedRoute, ProtectedSignUP } from './Auth/AuthProtectComponents'; // VERIFY PATH: Ensure this is correct (e.g., './Auth/AuthProtectComponents')
import SignupLogin from './Auth/login'; // VERIFY PATH: Ensure this is correct (e.g., './Auth/login')
import Dashboard from './pages/Dashboard'; // VERIFY PATH: Ensure this is correct (e.g., './pages/Dashboard')
import TaskManager from './pages/Taskmanager'; // VERIFY PATH: Ensure this is correct (e.g., './pages/Taskmanager')
import NotFoundPage from './Auth/NotFoundPage'; // VERIFY PATH: Ensure this is correct (e.g., './Auth/NotFoundPage')
import Footer from './Components/Footer'; // VERIFY PATH: Ensure this is correct (e.g., './Components/Footer')
import Navbar from './Components/Navbar'; // VERIFY PATH: Ensure this is correct (e.g., './Components/Navbar')
import TSidebar from './Components/Sidebar'; // VERIFY PATH: Ensure this is correct (e.g., './Components/Sidebar')
import { ThemeProvider, useTheme } from './ThemeContext'; // VERIFY PATH: Ensure this is correct (e.g., './ThemeContext' or './Context/ThemeContext')
import ProfileSection from './pages/ProfileSection';
import FullScreenLoader from './Components/PageLoader';
import CosmicLoader from './Components/PageLoader';


function MainLayout({ children }) {
  // Access dark mode state and toggle function from ThemeContext
  const { isDarkMode, toggleDarkMode } = useTheme();
  // State to control the visibility of the mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle sidebar visibility
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // Apply 'dark' class to the root div if dark mode is active for Tailwind CSS
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Navbar receives theme props and the sidebar toggler */}
      <Navbar
        toggleSidebar={handleToggleSidebar} // Pass the function to open/close sidebar from Navbar
      />

      <div className="flex flex-1 pt-16"> {/* pt-16 for padding below the fixed Navbar */}
        {/* TSidebar receives theme props, its open state, and the toggler */}
        <TSidebar
          isDarkMode={isDarkMode}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={handleToggleSidebar} // Pass the function to close sidebar from Sidebar
        />
        {/* <FullScreenLoader/> */}
{/* <CosmicLoader isLoading={true} /> */}
        {/* Main content area, adjusts margin based on sidebar presence on medium screens and up */}
        <main className={`flex-1 p-2 md:p-6 overflow-x-auto transition-all duration-300
          ${isDarkMode ? 'bg-gray-900' : 'bg-[#f8f9fa]'}
          md:ml-1`}> {/* On medium screens and up, add left margin for the static sidebar */}
          {children}
        </main>
      </div>

      {/* Footer receives theme prop */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

/**
 * App Component
 * Sets up the React application with Redux, Authentication, Routing, and Theme.
 */
function App() {



  return (
    // ThemeProvider wraps the entire application to provide theme context
    <ThemeProvider>
      {/* Provider wraps the application to provide Redux store */}
      <Provider store={store}>
        {/* AuthProvider wraps the application to provide authentication context */}
        <AuthProvider>
          {/* Router manages application routing */}
          <Router>
            <Routes>
              <Route path="/settings" element={
                // <ProtectedRoute>
                  <MainLayout>
                    <ProfileSection />
                  </MainLayout>
             
              } />
              {/* Route for login page, protected for signed-up users */}
              <Route path="/login" element={
                <ProtectedSignUP>
                  <SignupLogin />
                </ProtectedSignUP>
              } />
              {/* Default route for Dashboard, protected for authenticated users */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              {/* Route for TaskManager, protected for authenticated users */}
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <MainLayout>
                    <TaskManager />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch-all route for 404 Not Found pages */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
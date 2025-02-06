import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Sidebar from './Components/Sidebar';
import Dashboard from './pages/Dashboard';
import Footer from './Components/Footer';
import Header from './Components/Navbar';
import Navbar from './Components/Navbar';
import TaskManager from './pages/Taskmanager';
import SignupLogin from './Auth/login';
import { AuthProvider, ProtectedRoute, ProtectedSignUP } from './Auth/AuthProtectComponents';
import TextToSpeech from './Special/Voicetext';
import SpeechToText from './Special/speekToTest';
import NotFoundPage from './Auth/NotFoundPage';


function App() {
  
  return (
    <>
<AuthProvider>

  <Router>
        <Routes>
        <Route path="/login" element={
          <ProtectedSignUP>
            <SignupLogin />
            </ProtectedSignUP>
          } />
          <Route path="/" element={<ProtectedRoute>
            <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={<ProtectedRoute>
           
            <div className=' p-0.5 md:pl-40 w-full  '>
                <div className="bg-[#2C2B5A] bg-opacity-55 w-full  mx-auto
                flex justify-center  flex-col   ">
                
<div className="w-full mt-20">

                <TaskManager />
</div>
                </div>
                </div>
            </ProtectedRoute>
            } />
            <Route path="/:id" element={<NotFoundPage/>} />

        </Routes>
  </Router>

            </AuthProvider>
            {/* <SpeechToText/> */}
          
    </>

  );
}

export default App;

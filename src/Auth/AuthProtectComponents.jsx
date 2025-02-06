import React, { createContext, useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Sidebar } from "react-feather";
import Footer from "../Components/Footer";
import TSidebar from "../Components/Sidebar";

// Create Auth Context
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (credentials) => {
    // Simulate authentication (replace with your API logic)
  
      setIsAuthenticated(true);
    
  };

  const logout = () => {
    setIsAuthenticated(false);
  };
  useEffect(() => {
    if(localStorage.getItem('token')){
      setIsAuthenticated(true);
    }
    else{
      setIsAuthenticated(false);
    }
  },[localStorage.getItem('token')])

  return (

    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth
export const useAuth = () => {
  return useContext(AuthContext);
};

// ProtectedRoute Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated ,login, logout} = useAuth();
  useEffect(() => {
    if(localStorage.getItem('token')){
   login();
    }
    else{
     logout();
    }
  },[localStorage.getItem('token')])

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>
        <Navbar/>
      <div style={{ display: 'flex' } } className=' overflow-hidden'>
          <TSidebar />
          <main style={{ flexGrow: 1, padding: '1px', background: '#1e1e2d', color: '#fff' }} className='overflow-hidden'>
           
  {children}
          </main>
        </div>
        <Footer/>
  </>
};
export const ProtectedSignUP = ({ children }) => {
  const { isAuthenticated ,login, logout} = useAuth();
  useEffect(() => {
    if(localStorage.getItem('token')){
      console.log(localStorage.getItem('token'))
   login();
    }
    else{
      console.log(localStorage.getItem('token'))
     logout();
    }
  },[])

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return<>
  {children}
  </>
};

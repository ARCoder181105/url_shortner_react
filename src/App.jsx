import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  // The boolean that the entire app will rely on
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Optional: store user data
  const [isLoading, setIsLoading] = useState(true); // For initial load

  // This effect runs only once when the app starts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/status`, {
          credentials: 'include', // Essential for sending the httpOnly cookie
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true); // ✅ Set the boolean to true
          setUser(data.user);   // Store user info
        } else {
          // Any error status (like 401) means the user is not logged in
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        // Network errors also mean not logged in
        console.error("Could not verify login status", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        // Finished checking, we can now render the app
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true); // ✅ Just set the boolean
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // ✅ Just set the boolean
    setUser(null);
  };
  
  // Show a loading screen while we verify the session
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Pass the boolean down as a prop */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/admin" /> : <LoginPage onLogin={handleLogin} />} 
          />
          
          {/* This route is now protected by the isLoggedIn boolean */}
          <Route 
            path="/admin" 
            element={isLoggedIn ? <AdminPage user={user} /> : <Navigate to="/login" />} 
          />
            
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
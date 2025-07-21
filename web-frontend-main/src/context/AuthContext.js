// src/context/AuthContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Create the Context object
const AuthContext = createContext(null);

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  // --- State lives here now ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // --- Authentication functions live here ---
  // Use useCallback to prevent unnecessary re-creation of functions
  const login = useCallback((email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    console.log('AuthContext: User logged in', email);
  }, []); // Empty dependency array means function is created once

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserEmail('');
    console.log('AuthContext: User logged out');
  }, []); // Empty dependency array

  // --- Value provided to consuming components ---
  const value = {
    isLoggedIn,
    userEmail,
    login, // Provide the login function
    logout // Provide the logout function
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Render children components wrapped by the provider */}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption (optional but recommended)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    // This error handling is important!
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
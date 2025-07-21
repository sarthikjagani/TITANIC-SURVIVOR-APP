// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication.
 * Redirects to login page if user is not authenticated.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 */
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth(); // Get login status from context
  const location = useLocation(); // Get the current location

  if (!isLoggedIn) {
    // If not logged in, redirect to the login page
    // We pass the current location in state. This allows the login page
    // to potentially redirect back after successful login (optional enhancement).
    console.log('ProtectedRoute: Not logged in, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
    // 'replace' avoids adding the dashboard URL to the history stack when redirected
  }

  // If logged in, render the children component (the actual protected page)
  return children;
}

export default ProtectedRoute;
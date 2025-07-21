// src/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Define the admin email address
const ADMIN_USER_EMAIL = 'sosyo2025@gmail.com';

/**
 * AdminRoute Component
 *
 * Protects routes that are exclusively for admin users.
 * If the user is not logged in, they are redirected to the login page.
 * If the user is logged in but is not an admin, they are redirected to the home page
 * and shown an alert.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 */
function AdminRoute({ children }) {
  const { isLoggedIn, userEmail } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userEmail !== ADMIN_USER_EMAIL) {
    // User is logged in but not an admin
    alert('Access Denied: Admin privileges required.'); // Simple alert for unauthorized access
    return <Navigate to="/home" replace />; // Redirect to a general page
  }

  // User is logged in and is an admin, render the requested component
  return children;
}

export default AdminRoute;
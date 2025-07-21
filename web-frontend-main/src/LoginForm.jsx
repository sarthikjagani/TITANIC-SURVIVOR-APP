// src/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- localStorage Key ---
const USERS_STORAGE_KEY = 'titanicAppUsers';

// --- Helper to get users ---
const getStoredUsers = () => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    try {
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Error parsing users from localStorage", error);
    return [];
  }
};

/**
 * LoginForm Component
 * Handles validation, checks credentials against localStorage,
 * calls context login, and redirects.
 */
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validation Function
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email address is invalid';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  // Updated handleSubmit for Login
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({}); // Clear previous errors

    const storedUsers = getStoredUsers();
    const user = storedUsers.find(u => u.email === email);

    if (!user) {
      setErrors({ api: 'Email not registered. Please register first.' });
    } else if (user.password !== password) { // WARNING: Plain password comparison
      setErrors({ api: 'Incorrect password.' });
    } else {
      console.log('LoginForm: Credentials verified:', email);
      login(email);
      navigate('/Home');
    }
  };

  return (
    // Added content-wrapper for styling from App.css
    <div className="content-wrapper">
      {/* CYPRESS ATTRIBUTE ADDED */}
      <h2 data-cy="login-heading">Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Removed inline style from div, App.css will handle spacing */}
        <div>
          {/* Removed inline style from label */}
          <label htmlFor="login-email">Email:</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            // CYPRESS ATTRIBUTE ADDED
            data-cy="email-input"
          />
          {/* Display Email Validation Error with class */}
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        {/* Removed inline style from div */}
        <div>
          {/* Removed inline style from label */}
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            // CYPRESS ATTRIBUTE ADDED
            data-cy="password-input"
          />
          {/* Display Password Validation Error with class */}
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        {/* Display API/Logic Error with class and a CYPRESS ATTRIBUTE */}
        {errors.api && (
          <p className="error-message" data-cy="error-message">
            {errors.api}
          </p>
        )}

        {/* CYPRESS ATTRIBUTE ADDED */}
        <button type="submit" data-cy="submit-button">Login</button>
      </form>
      {/* Removed inline style, App.css has styles for form + p */}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginForm;
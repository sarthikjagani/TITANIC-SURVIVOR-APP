// src/RegisterForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- localStorage Key ---
const USERS_STORAGE_KEY = 'titanicAppUsers';

// --- Helper to get users from localStorage ---
const getStoredUsers = () => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  try {
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Error parsing users from localStorage", error);
    return [];
  }
};

// --- Helper to save users to localStorage ---
const storeUsers = (users) => {
  try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
      console.error("Error saving users to localStorage", error);
  }
};

/**
 * RegisterForm Component
 * Handles validation, checks localStorage for existing user,
 * stores new user, calls context login, and redirects.
 */
function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email address is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const storedUsers = getStoredUsers();
    const existingUser = storedUsers.find(user => user.email === email);

    if (existingUser) {
      setErrors({ api: 'Email already registered. Please login.' });
    } else {
      const newUser = { email, password };
      const updatedUsers = [...storedUsers, newUser];
      storeUsers(updatedUsers);
      login(email);
      navigate('/Home');
    }
  };

  return (
    <div className="content-wrapper">
      <h2 data-cy="register-heading">Register Account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="register-email">Email:</label>
          <input
            type="email"
            id="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            data-cy="email-input"
          />
          {errors.email && <p className="error-message" data-cy="email-error">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="register-password">Password:</label>
          <input
            type="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            data-cy="password-input"
          />
          {errors.password && <p className="error-message" data-cy="password-error">{errors.password}</p>}
        </div>

        {errors.api && <p className="error-message" data-cy="api-error">{errors.api}</p>}

        <button type="submit" data-cy="submit-button">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterForm;
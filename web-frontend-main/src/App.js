// src/App.js
import React, { useState } from 'react'; // Added useState
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import existing components/pages
import HomePage from './HomePage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import DashboardPage from './DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import CalculatorPage from './CalculatorPage';
import AboutUsPage from './AboutUsPage';
import ServicePage from './ServicePage';
import LandingPage from './LandingPage';

// Import new components for Admin Feature
import AdminRoute from './AdminRoute'; // Import AdminRoute
import FeaturePage from './FeaturePage'; // Import FeaturePage

// Import CSS
import './style/App.css';

// Admin User Identifier
const ADMIN_USER_EMAIL = 'sosyo2025@gmail.com';

function App() {
  const { isLoggedIn, userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false); // State for dropdown

  const handleLogoutClick = () => {
    logout();
    setShowSettingsDropdown(false); // Hide dropdown on logout
    navigate('/login');
  };

  const isAdmin = isLoggedIn && userEmail === ADMIN_USER_EMAIL;

  return (
    <div className="App">
      <nav>
        <div className="nav-links-group">
          <NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          {isLoggedIn && (
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
          )}
          <NavLink to="/calculator" className={({ isActive }) => isActive ? "active" : ""}>Calculator</NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>Services</NavLink>
          <NavLink to="/about-us" className={({ isActive }) => isActive ? "active" : ""}>About Us</NavLink>
        </div>

        <div className="user-actions-group">
          {isLoggedIn ? (
            <>
              <span>Welcome, {userEmail}!</span>
              <button onClick={handleLogoutClick} className="logout-button">Logout</button>
              {isAdmin && (
                <div className="settings-menu">
                  <button 
                    onClick={() => setShowSettingsDropdown(!showSettingsDropdown)} 
                    className="settings-button"
                    aria-expanded={showSettingsDropdown}
                    aria-haspopup="true"
                    aria-label="Admin Settings"
                  >
                    ⚙️
                  </button>
                  {showSettingsDropdown && (
                    <div className="dropdown-content">
                      <NavLink 
                        to="/features" 
                        onClick={() => setShowSettingsDropdown(false)}
                        className={({ isActive }) => isActive ? "active-dropdown-item" : ""}
                      >
                        Features
                      </NavLink>
                      {/* Add other admin links here if needed */}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Login/Register links are typically on LandingPage or if you want them always visible */}
              {/* <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink> */}
              {/* <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink> */}
            </>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicePage />} />  

          {/* Protected Routes */}
          <Route path="/dashboard" element={ <ProtectedRoute><DashboardPage /></ProtectedRoute> } />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          
          {/* Admin Protected Route */}
          <Route path="/features" element={
            <AdminRoute>
              <FeaturePage />
            </AdminRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
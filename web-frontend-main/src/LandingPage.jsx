// src/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AdPage from './AdPage';
import './style/HomePage.css'; // Import the CSS file, ensure path is correct

function LandingPage() {
  const titanicExplanation = `
    This application helps you predict survival on the Titanic based on various factors. 
    Input details like class, age, and gender to see a probabilistic outcome. 
    It's a fascinating way to explore historical data through a predictive model.
  `;

  // Using your specified image path
  const imageUrl = process.env.PUBLIC_URL + '/images/titanic.jpg';

  return (
    <div className="home-page-container">
      <h1>Welcome to Titanic Survival App</h1>
      <p className="welcome-message">
        Your journey into building intelligent web applications starts here. Please log in or register.
      </p>
      {/* Updated className here for specific HomePage link styling */}
      <div className="home-page-nav-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>

      {/* Explanation Section */}
      <div className="explanation-section">
        <h2>About the Titanic Survival Calculator</h2>
        <p>{titanicExplanation}</p>
      </div>

      {/* Image Section */}
      <div className="image-section">
        <img src={imageUrl} alt="Titanic" className="home-page-image" />
      </div>

      {/* Optional: Include AdPage on the homepage */}
      <div className="ad-section">
          <AdPage />
      </div>
    </div>
  );
}

export default LandingPage;
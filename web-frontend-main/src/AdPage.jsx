import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/AdPage.css'; // This now imports your new themed CSS

function AdPage() {
  const navigate = useNavigate();

  const handleEnrollClick = () => {
    navigate('/courses');
  };

  return (
    <div className="ad-container">
      <h2 className="ad-title">🚀 Supercharge Your Skills! 🚀</h2>
      <h3 className="ad-subtitle">Create Amazing AI-Powered Web Applications!</h3>
      <p className="ad-description">
        Join our successful online course and learn how to integrate cutting-edge AI
        into your web projects. Go from idea to deployment with hands-on lessons.
      </p>
      
      {/* This is the only part that changes */}
      <p className="ad-features-title"><strong>What you'll learn:</strong></p>

      <ul className="ad-features-list">
        <li>Integrating Large Language Models (LLMs)</li>
        <li>Building intelligent user interfaces</li>
        <li>Working with AI APIs</li>
        <li>Deploying AI web apps</li>
        <li>And much more!</li>
      </ul>
      
      <button className="ad-button" onClick={handleEnrollClick}>
        Learn More & Enroll Now!
      </button>
    </div>
  );
}

export default AdPage;
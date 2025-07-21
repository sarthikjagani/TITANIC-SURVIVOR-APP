// src/ServicePage.jsx
import React from 'react';
import './style/ServicePage.css'; // We will update this CSS file

function ServicePage() {
  return (
    <div className="service-page-container">
      <header className="service-page-header">
        <h1>Our Services</h1>
        <p>
          The Titanic Survival App offers a unique blend of historical data exploration and engaging, AI-powered tools. Our services are designed to provide insights and a deeper understanding of this historic voyage.
        </p>
      </header>

      <div className="services-grid">

        {/* --- Service Card 1: Data Exploration --- */}
        <div className="service-card">
          {/* UPDATED B&W ICON */}
          <div className="service-icon">☰</div>
          <h2>Data & Dashboard Insights</h2>
          <p>
            Our interactive dashboard for registered users provides a comprehensive look into the passenger data of the Titanic.
          </p>
          <ul className="service-features-list">
            <li>Demographic Breakdowns</li>
            <li>Survival Statistics</li>
            <li>Historical Data Queries</li>
          </ul>
        </div>

        {/* --- Service Card 2: Survival Calculator --- */}
        <div className="service-card">
          {/* UPDATED B&W ICON */}
          <div className="service-icon">∑</div>
          <h2>AI Survival Calculator</h2>
          <p>
            Our unique calculator offers a hypothetical look at survival chances based on key factors and various AI models.
          </p>
          <ul className="service-features-list">
            <li>Multiple AI Models</li>
            <li>Personalized Scenarios</li>
            <li>Instant Predictions</li>
          </ul>
          <p className="disclaimer">
            <strong>Disclaimer:</strong> This tool is for educational purposes only.
          </p>
        </div>

        {/* --- Service Card 3: Account & Support --- */}
        <div className="service-card">
          {/* UPDATED B&W ICON */}
          <div className="service-icon">★</div>
          <h2>Account & Admin Tools</h2>
          <p>
            Registered users benefit from secure account management and a personalized dashboard to track their prediction history.
          </p>
          <ul className="service-features-list">
            <li>Secure Registration & Login</li>
            <li>Prediction History Dashboard</li>
            <li>Admin Model Management</li>
          </ul>
        </div>

      </div>

      <footer className="service-page-footer">
          <h3>Need Assistance?</h3>
          <p>For any queries regarding app functionality or data interpretation, please contact our support team.</p>
          <p className="contact-info">Contact: +49 123 4567890</p>
      </footer>

    </div>
  );
}

export default ServicePage;
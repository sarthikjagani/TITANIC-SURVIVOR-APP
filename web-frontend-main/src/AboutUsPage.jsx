// src/AboutUsPage.jsx
import React from 'react';
import './style/AboutUsPage.css';

function AboutUsPage() {
  return (
    // The main container now directly holds all the sections for a full-screen layout.
    <div className="about-us-full-screen-container">
      <header className="vintage-header">
        <h1>About This Project</h1>
        <p className="vintage-subtitle">Exploring historical data through modern technology to bring history to life.</p>
      </header>

      {/* --- Our Mission Section --- */}
      <section className="vintage-section">
        <h2>Our Mission</h2>
        <p>
          This project was born from a fascination with the story of the R.M.S. Titanic and a passion for data science. Our mission is twofold: to provide an engaging, educational tool for individuals to explore the factors that influenced survival rates on that fateful voyage, and to demonstrate the power of machine learning in uncovering insights from historical data. We believe that by making data interactive, we can create a deeper and more personal connection to history.
        </p>
      </section>

      {/* --- Key Features Section --- */}
      <section className="vintage-section features-section-bg">
        <div className="section-content">
            <h2>Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Interactive Calculator</h3>
                <p>Input passenger data to receive a survival prediction based on various machine learning models.</p>
              </div>
              <div className="feature-card">
                <h3>Advanced AI Models</h3>
                <p>Leverage a suite of trained models to see how different algorithms interpret the same data.</p>
              </div>
              <div className="feature-card">
                <h3>Personalized Dashboard</h3>
                <p>Registered users can track and review their prediction history through a personal dashboard.</p>
              </div>
            </div>
        </div>
      </section>

      {/* --- The Technology Section --- */}
      <section className="vintage-section">
        <h2>The Technology</h2>
        <p>This application was constructed using a modern technology stack, presented with an aesthetic that respects the historical era.</p>
        <div className="tech-list">
          <span>React</span>
          <span>Python</span>
          <span>FastAPI</span>
          <span>Scikit-learn</span>
        </div>
      </section>
      
      {/* --- Meet the Team Section --- */}
      <section className="vintage-section">
          <h2>The Engineering Team</h2>
          <div className="team-vintage-grid">
              {/* --- UPDATED: Replaced divs with img tags --- */}
              <div className="team-card">
                <img src={process.env.PUBLIC_URL + '/images/Jenil.jpg'} alt="Team member K. Jenil" />
                <h3>K. Jenil</h3>
                <h4>Lead Developer & Project Manager</h4>
              </div>
              <div className="team-card">
                <img src={process.env.PUBLIC_URL + '/images/Shubham.jpg'} alt="Team member M. Shubham" />
                <h3>M. Shubham</h3>
                <h4>Frontend Developer</h4>
              </div>
              <div className="team-card">
                <img src={process.env.PUBLIC_URL + '/images/Krunal.jpg'} alt="Team member K. Krunal" />
                <h3>K. Krunal</h3>
                <h4>Model Backend</h4>
              </div>
              <div className="team-card">
                <img src={process.env.PUBLIC_URL + '/images/Sarthik.jpg'} alt="Team member J. Sarthik" />
                <h3>J. Sarthik</h3>
                <h4>Web Backend</h4>
              </div>
              <div className="team-card">
                <img src={process.env.PUBLIC_URL + '/images/Divyam.jpg'} alt="Team member M. Divyam" />
                <h3>M. Divyam</h3>
                <h4>Frontend & Testing</h4>
              </div>
          </div>
      </section>

      {/* --- Call to Action Section --- */}
      <section className="vintage-section call-to-action">
          <h2>Explore History for Yourself</h2>
          <p>Ready to dive in? Head over to our calculator and make your first prediction.</p>
          <a href="/calculator" className="vintage-cta-button">Go to Calculator</a>
      </section>
    </div>
  );
}

export default AboutUsPage;
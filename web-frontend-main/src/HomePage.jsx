// src/HomePage.jsx
import React from 'react';
// If you add specific links in the new section, you might need Link
// import { Link } from 'react-router-dom'; 
import AdPage from './AdPage'; // Assuming AdPage is still relevant here
import './style/HomePage.css'; // Reusing HomePage.css as per your file
// REMOVED: import HomePage from './HomePage'; 

/**
 * HomePage Component
 *
 * The main landing view, showing a welcome message,
 * links to login/register, an explanation of the app, an image,
 * and potentially other content like the Ad.
 * * Note: This version now also includes the passenger property explanations.
 * If this was intended for LandingPage.jsx, you can move that section.
 */
function HomePage() {
  const pageExplanation = `
    Welcome back! You're logged in and ready to explore the features of our application.
    Dive into the calculator or check out your dashboard.
  `; // Note: This welcome message seems more for a logged-in user.
     // The original HomePage had "Please log in or register."

  const imageUrl = process.env.PUBLIC_URL + '/images/titanic.jpg';

  // Define the passenger property explanations
  // ** PLEASE REPLACE THE PLACEHOLDER DESCRIPTIONS WITH YOUR ACTUAL EXPLANATIONS **
  const passengerProperties = [
    {
      name: "Passenger Name",
      description: "The full name of the passenger. While not directly used in all prediction models, it's a key identifier for records."
    },
    {
      name: "Title",
      description: "The passenger's formal title (e.g., Mr., Mrs., Miss, Master). This can be an indicator of social status, age, and marital status."
    },
    {
      name: "Sex",
      description: "The biological sex of the passenger (Male or Female). Historically, the 'women and children first' protocol was a significant factor in survival rates."
    },
    {
      name: "PClass",
      description: "The class of the passenger's ticket (1st, 2nd, or 3rd). First-class passengers typically had cabins closer to the deck and better access to lifeboats."
    },
    {
      name: "Age",
      description: "The age of the passenger in years at the time of the voyage. Age was a critical factor, with children and sometimes elderly having different survival priorities."
    },
    {
      name: "Fare",
      description: "The amount of money the passenger paid for their ticket. This often correlates strongly with passenger class and cabin location on the ship."
    },
    {
      name: "Traveled Alone",
      description: "Indicates whether the passenger was traveling alone or with family members (such as siblings, spouses, parents, or children) aboard the Titanic."
    },
    {
      name: "Embarked",
      description: "The port where the passenger boarded the Titanic: C = Cherbourg, Q = Queenstown, S = Southampton. This could correlate with passenger class."
    },
  ];

  return (
      <div className="home-page-container">
        {/* The welcome message seems like it's for a logged-in state, 
            but HomePage usually has Login/Register links. 
            You might want to adjust this if this is the public homepage.
            Original welcome: "Your journey into building intelligent web applications starts here. Please log in or register."
        */}
        <h1>Welcome Back to Titanic Survival App!</h1> 
        <p className="welcome-message">{pageExplanation}</p>
        
        {/* If this is the main public HomePage, you'd typically have Login/Register links here.
            The version you provided previously had:
            <div className="home-page-nav-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
            I've omitted them for now as your pasted code did not include them in this specific version.
        */}

        {/* Image Section - Moved up for a common layout flow */}
        <div className="image-section">
          <img src={imageUrl} alt="Titanic" className="home-page-image" />
        </div>

        {/* Passenger Properties Explanation Section */}
        {/* If this section was intended for LandingPage.jsx, you can remove it from here. */}
        <div className="passenger-factors-section"> 
          <h2>Understanding Passenger Factors</h2>
          <p>The following factors are key inputs for our survival calculator and were significant in historical survival rates on the Titanic:</p>
          <ul className="factors-list">
            {passengerProperties.map(prop => (
              <li key={prop.name}>
                <strong>{prop.name}:</strong> {prop.description}
              </li>
            ))}
          </ul>
        </div>

        {/* Optional: AdPage or other content sections */}
        <div className="ad-section">
            <AdPage />
        </div>
      </div>
  );
}

export default HomePage;
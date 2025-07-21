// src/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import './style/DashboardPage.css';

function DashboardPage() {
  const { isLoggedIn, userEmail } = useAuth();
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- Start of Debugging Logs ---
    console.log("Dashboard 'useEffect' is running.");
    console.log(`Current auth state: isLoggedIn=${isLoggedIn}, userEmail=${userEmail}`);
    // --- End of Debugging Logs ---

    if (isLoggedIn && userEmail) {
      const historyKey = `predictionHistory_${userEmail}`;
      console.log(`Attempting to retrieve history with key: "${historyKey}"`);

      try {
        const storedHistory = localStorage.getItem(historyKey);
        console.log("Raw data from localStorage:", storedHistory);

        if (storedHistory) {
          const parsedData = JSON.parse(storedHistory);
          
          // --- FIX: Check if the parsed data is an array ---
          if (Array.isArray(parsedData)) {
            console.log("Successfully parsed history data:", parsedData);
            setPredictionHistory(parsedData);
          } else {
            // This handles cases where data is not an array, which would cause a crash.
            console.error("Error: Parsed history data is not an array. Resetting history.", parsedData);
            setPredictionHistory([]);
          }
        } else {
          console.log("No history found in localStorage for this user.");
          setPredictionHistory([]); // Explicitly set state to empty
        }
      } catch (error) {
        console.error("Failed to parse history JSON from localStorage:", error);
        setPredictionHistory([]); // Reset state on parsing error
      }
    } else {
        // If user is not logged in, ensure history is cleared from view
        setPredictionHistory([]);
    }
    
    setIsLoading(false); // Mark loading as complete

  }, [isLoggedIn, userEmail]);

  const handleClearHistory = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all your prediction history? This action cannot be undone."
    );

    if (isConfirmed && isLoggedIn && userEmail) {
      const historyKey = `predictionHistory_${userEmail}`;
      try {
        localStorage.removeItem(historyKey);
        setPredictionHistory([]);
        alert("Your prediction history has been cleared.");
      } catch (error) {
        console.error("Failed to clear history from localStorage:", error);
        alert("There was an error clearing your history.");
      }
    }
  };

  // --- The JSX part of the component remains unchanged ---
  if (isLoading) {
    return <div className="dashboard-container"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="dashboard-page-wrapper">
      {predictionHistory.length > 0 && (
        <button onClick={handleClearHistory} className="clear-all-btn-page-corner">
          Clear All
        </button>
      )}

      <div className="dashboard-container">
        <h1>Your Prediction History</h1>

        {predictionHistory.length === 0 ? (
          <div className="no-history-message">
            <p>Please make a prediction in the calculator to see your history here.</p>
          </div>
        ) : (
          <ul className="history-list">
            {predictionHistory.map((item) => (
              <li key={item.id} className="history-item">
                <div className="history-item-header">
                  <strong>{item.passengerName !== 'N/A' ? item.passengerName : 'Passenger'}</strong> - <span className="history-date">{item.timestamp}</span>
                </div>
                <div className="history-item-body">
                  <p><strong>Prediction ({item.modelUsed}):</strong> <span className={`outcome-${item.outcome.toLowerCase().replace(/\s+/g, '-')}`}>{item.outcome}</span> ({(item.probability * 100).toFixed(1)}%)</p>
                  <details>
                    <summary>View Input Details</summary>
                    <ul className="input-details-list">
                      <li><strong>Title:</strong> {item.inputs.Title}</li>
                      <li><strong>Class:</strong> {item.inputs.PClass}</li>
                      <li><strong>Sex:</strong> {item.inputs.Sex}</li>
                      <li><strong>Age:</strong> {item.inputs.Age}</li>
                      <li><strong>Fare:</strong> ${item.inputs.Fare}</li>
                      <li><strong>Traveled Alone:</strong> {item.inputs.IsAlone}</li>
                      <li><strong>Embarked:</strong> {item.inputs.Embarked}</li>
                    </ul>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
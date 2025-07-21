// src/CalculatorPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import './style/CalculatorPage.css';

// --- Constants and Mappings ---
const PCLASS_MAP = { '1st': 1, '2nd': 2, '3rd': 3 };
const SEX_MAP = { 'male': 0, 'female': 1 };
const EMBARKED_MAP = { 'cherbourg': 0, 'queenstown': 1, 'southampton': 2 };
const IS_ALONE_MAP = { 'yes': 1, 'no': 0 };

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const SURVIVAL_THRESHOLD = 0.5;
const MAX_HISTORY_ITEMS = 10;

// --- Model Management ---
const MODELS_STORAGE_KEY = 'titanicAppManagedModels';

// Define the base models, mirroring the structure in FeaturePage
const baseBackendModels = [
    { displayName: "Random Forest", backendModel: "random_forest" },
    { displayName: "SVM", backendModel: "svm" },
    { displayName: "Logistic Regression", backendModel: "logistic_regression" },
    { displayName: "KNN", backendModel: "knn" },
    { displayName: "Decision Tree", backendModel: "decision_tree" },
];

// Define the models available for anonymous users
const defaultAnonymousModels = [
    { displayName: "Random Forest", backendModel: "random_forest" },
    { displayName: "SVM", backendModel: "svm" },
];

const getManagedModels = () => {
  try {
    const modelsJson = localStorage.getItem(MODELS_STORAGE_KEY);
    if (modelsJson) {
      const parsedModels = JSON.parse(modelsJson);
      if (Array.isArray(parsedModels) && parsedModels.length > 0 && parsedModels[0].displayName) {
        return parsedModels;
      }
    }
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(baseBackendModels));
    return [...baseBackendModels];
  } catch (error) {
    console.error("Error parsing managed models from localStorage:", error);
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(baseBackendModels));
    return [...baseBackendModels];
  }
};


function CalculatorPage() {
  const { isLoggedIn, userEmail } = useAuth();

  const [allManagedModels, setAllManagedModels] = useState([]);
  const [currentModelOptions, setCurrentModelOptions] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]); // Will store displayNames

  const initialPassengerState = {
    name: '', title: 'mr', sex: 'male', pClass: '1st',
    age: '', fare: '', traveledAlone: 'no', embarked: 'southampton',
  };

  const [passenger, setPassenger] = useState(initialPassengerState);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef(null);

  // Effect to load all models from storage once
  useEffect(() => {
      setAllManagedModels(getManagedModels());
  }, []);

  // Effect to set the visible models based on login status and loaded models
  useEffect(() => {
    const newModelOptions = isLoggedIn ? allManagedModels : defaultAnonymousModels;
    setCurrentModelOptions(newModelOptions);
    // Default to the first model being selected
    setSelectedModels(newModelOptions.length > 0 ? [newModelOptions[0].displayName] : []);
  }, [isLoggedIn, allManagedModels]);

  // Effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassenger(prevState => ({ ...prevState, [name]: value.toLowerCase() }));
  };

  const handleMultiModelChange = (modelDisplayName) => {
    setSelectedModels(prev =>
      prev.includes(modelDisplayName) ? prev.filter(name => name !== modelDisplayName) : [...prev, modelDisplayName]
    );
  };
  
  const handleSingleModelChange = (e) => {
    setSelectedModels(e.target.value ? [e.target.value] : []);
  };

  const handleReset = () => {
    setPassenger(initialPassengerState);
    setSelectedModels(currentModelOptions.length > 0 ? [currentModelOptions[0].displayName] : []);
    setPredictions([]);
    setError(null);
    setIsLoading(false);
    setIsModelDropdownOpen(false);
  };
  
  const savePredictionToHistory = (passengerInputs, predictionResultItem) => {
    if (!isLoggedIn || !userEmail) return;
    const historyKey = `predictionHistory_${userEmail}`;
    let userHistory = [];
    try {
        const storedHistory = localStorage.getItem(historyKey);
        if (storedHistory) userHistory = JSON.parse(storedHistory);
    } catch (e) {
        console.error("Error parsing history from localStorage:", e);
        userHistory = [];
    }
    const outcomeText = predictionResultItem.survival_probability >= SURVIVAL_THRESHOLD ? "Survived" : "Did not survive";
    
    // Find the display name for the model used
    const modelUsedObject = currentModelOptions.find(m => m.backendModel === predictionResultItem.model_name);
    const modelUsedName = modelUsedObject ? modelUsedObject.displayName : predictionResultItem.model_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const newHistoryEntry = {
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleString(),
        passengerName: passengerInputs.name || 'N/A',
        inputs: { /* ... input fields ... */ },
        modelUsed: modelUsedName,
        outcome: outcomeText,
        probability: predictionResultItem.survival_probability,
    };
    userHistory.unshift(newHistoryEntry);
    localStorage.setItem(historyKey, JSON.stringify(userHistory.slice(0, MAX_HISTORY_ITEMS)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModelDropdownOpen(false);
    
    if (selectedModels.length === 0) {
        setError("Please select at least one prediction model.");
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setPredictions([]);

    // --- Validation and data prep (same as before) ---
    const ageValue = passenger.age !== '' ? parseInt(passenger.age, 10) : null;
    const fareValue = passenger.fare !== '' ? parseFloat(passenger.fare) : null;
    if (ageValue === null || isNaN(ageValue) || ageValue < 0 || ageValue > 100) {
        setError("Age must be a valid number between 0 and 100.");
        setIsLoading(false); return;
    }
    if (fareValue === null || isNaN(fareValue) || fareValue < 0 || fareValue > 500) {
        setError("Fare must be a valid number between 0 and 500.");
        setIsLoading(false); return;
    }
    const pclassValue = PCLASS_MAP[passenger.pClass];
    const ageClassValue = (ageValue && pclassValue) ? parseFloat((ageValue * pclassValue).toFixed(2)) : 0.0;
    const passengerDataForAPI = {
      Title: passenger.title.charAt(0).toUpperCase() + passenger.title.slice(1),
      Pclass: pclassValue, Sex: SEX_MAP[passenger.sex], Age: ageValue,
      Fare: fareValue, IsAlone: IS_ALONE_MAP[passenger.traveledAlone],
      Embarked: EMBARKED_MAP[passenger.embarked], AgeClass: ageClassValue,
    };
    
    // --- THIS IS THE KEY CHANGE ---
    // Map selected display names to their corresponding backend model keys for the API.
    const modelNamesForAPI = selectedModels.map(displayName => {
        const modelObj = currentModelOptions.find(m => m.displayName === displayName);
        return modelObj ? modelObj.backendModel : null;
    }).filter(Boolean); // Filter out any nulls if a model wasn't found

    if (modelNamesForAPI.length !== selectedModels.length) {
        setError("An error occurred mapping selected models. Please refresh and try again.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passenger: passengerDataForAPI, model_names: modelNamesForAPI }),
      });

      if (!response.ok) {
        let errorDetailMessage = `Server returned status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) { errorDetailMessage = String(errorData.detail); }
        } catch (jsonParseError) { /* ignore */ }
        throw new Error(`HTTP error! ${errorDetailMessage}`);
      }
      
      const results = await response.json();
      setPredictions(results);
      if (isLoggedIn && userEmail && results) {
        results.forEach(prediction => savePredictionToHistory(passenger, prediction));
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const classOptions = ["1st", "2nd", "3rd"];
  const sexOptions = ["male", "female"];
  const embarkedOptions = ["cherbourg", "queenstown", "southampton"];
  const titleOptions = ["mr", "mrs", "miss", "master", "rare"];
  const yesNoOptions = ["yes", "no"];

  return (
    <div className="calculator-page">
      <h1>Survival Calculator</h1>
      <form className="calculator-form-grid" onSubmit={handleSubmit}>
        {/* --- Passenger Input Fields (unchanged) --- */}
        <div className="form-group col-span-2"> <label htmlFor="title">Title:</label> <select id="title" name="title" value={passenger.title} onChange={handleChange}> {titleOptions.map(option => <option key={option} value={option.toLowerCase()}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)} </select> </div>
        <div className="form-group col-span-4"> <label htmlFor="name">Name:</label> <input type="text" id="name" name="name" value={passenger.name} onChange={handleChange} placeholder="Passenger Name" /> </div>
        <div className="form-group col-span-2"> <label htmlFor="sex">Sex:</label> <select id="sex" name="sex" value={passenger.sex} onChange={handleChange}> {sexOptions.map(option => <option key={option} value={option.toLowerCase()}>{option}</option>)} </select> </div>
        <div className="form-group col-span-2"> <label htmlFor="pClass">PClass:</label> <select id="pClass" name="pClass" value={passenger.pClass} onChange={handleChange}> {classOptions.map(option => <option key={option} value={option.toLowerCase()}>{option}</option>)} </select> </div>
        <div className="form-group col-span-2"> <label htmlFor="age">Age:</label> <input type="number" id="age" name="age" min="0" max="100" value={passenger.age} onChange={handleChange} placeholder="e.g., 30" required /> </div>
        <div className="form-group fare-input-group col-span-3"> <label htmlFor="fare">Fare:</label> <div className="input-with-prefix"> <span>$</span> <input type="number" id="fare" name="fare" min="0" max="500" step="0.01" value={passenger.fare} onChange={handleChange} placeholder="e.g., 75.50" required /> </div> </div>
        <div className="form-group col-span-3"> <label htmlFor="traveledAlone">Traveled Alone:</label> <select id="traveledAlone" name="traveledAlone" value={passenger.traveledAlone} onChange={handleChange}> {yesNoOptions.map(option => <option key={option} value={option.toLowerCase()}>{option}</option>)} </select> </div>
        <div className="form-group col-span-3"> <label htmlFor="embarked">Embarked:</label> <select id="embarked" name="embarked" value={passenger.embarked} onChange={handleChange}> {embarkedOptions.map(option => <option key={option} value={option.toLowerCase()}>{option}</option>)} </select> </div>
        
        {/* --- Model Selection Component --- */}
        <div className="model-selection-group form-group col-span-3">
          <label id="model-label">{isLoggedIn ? 'Choose Models:' : 'Choose Model:'}</label>
          
          {currentModelOptions.length === 0 ? ( <p>No models available.</p> ) 
            : isLoggedIn ? (
            <div className="custom-multiselect-container" ref={modelDropdownRef}>
              <button type="button" className="multiselect-trigger" onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)} aria-haspopup="listbox" aria-expanded={isModelDropdownOpen}>
                <span className="selected-text">{selectedModels.length > 0 ? selectedModels.join(', ') : "Select a model..."}</span>
                <span className="dropdown-arrow">{isModelDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {isModelDropdownOpen && (
                <div className="multiselect-dropdown" role="listbox">
                  {currentModelOptions.map(model => (
                    <div key={model.displayName} className="checkbox-item" onClick={() => handleMultiModelChange(model.displayName)}>
                      <input type="checkbox" id={`model-${model.displayName.replace(/\s+/g, '-')}`} checked={selectedModels.includes(model.displayName)} readOnly />
                      <label htmlFor={`model-${model.displayName.replace(/\s+/g, '-')}`}>{model.displayName}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <select id="model" name="model" value={selectedModels[0] || ''} onChange={handleSingleModelChange}>
              {currentModelOptions.map(model => ( <option key={model.displayName} value={model.displayName}>{model.displayName}</option> ))}
            </select>
          )}
        </div>
        
        <div className="button-group col-span-6"> 
            <button type="submit" className="btn-submit" disabled={isLoading || selectedModels.length === 0}> 
                {isLoading ? 'Calculating...' : 'Submit'} 
            </button> 
            <button type="button" className="btn-reset" onClick={handleReset} disabled={isLoading}> 
                <span className="trash-icon" role="img" aria-label="trash icon">🗑️</span> Reset 
            </button> 
        </div>
      </form>

      {/* --- Results Section --- */}
      {isLoading && <div className="loading-message-container">Loading results...</div>}
      {error && <div className="error-message-container">Error: {error}</div>}
      {predictions.length > 0 && !isLoading && (
        <div className="results-section">
          <h3>Prediction Results:</h3>
          <ul>
            {predictions.map(pred => {
              const outcome = pred.survival_probability >= SURVIVAL_THRESHOLD ? "Survived" : "Did not survive";
              // Find the display name that corresponds to the returned backendModel key
              const modelUsed = currentModelOptions.find(m => m.backendModel === pred.model_name)?.displayName || pred.model_name;
              return (
                <li key={pred.model_name}>
                  <strong>{modelUsed}:</strong>
                  <span>{outcome}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CalculatorPage;


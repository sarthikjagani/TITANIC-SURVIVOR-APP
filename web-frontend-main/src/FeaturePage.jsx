// src/FeaturePage.jsx
import React, { useState, useEffect } from 'react';
import './style/FeaturePage.css';

const MODELS_STORAGE_KEY = 'titanicAppManagedModels';

// List of available features for model training.
const availableFeatures = [
  'Title', 'Pclass', 'Sex', 'Age', 'Fare', 'IsAlone', 'Embarked', 'AgeClass'
];

// Define the base models available in the backend.
// `displayName` is for the UI, and `backendModel` is the key the API expects.
const baseBackendModels = [
    { displayName: "Random Forest", backendModel: "random_forest" },
    { displayName: "SVM", backendModel: "svm" },
    { displayName: "Logistic Regression", backendModel: "logistic_regression" },
    { displayName: "KNN", backendModel: "knn" },
    { displayName: "Decision Tree", backendModel: "decision_tree" },
];

/**
 * Retrieves the list of model objects from localStorage.
 * Initializes with defaults if none are found.
 */
const getStoredModels = () => {
  try {
    const modelsJson = localStorage.getItem(MODELS_STORAGE_KEY);
    if (modelsJson) {
      const parsedModels = JSON.parse(modelsJson);
      // Basic validation to ensure it's an array of objects with the correct keys
      if (Array.isArray(parsedModels) && parsedModels.length > 0 && parsedModels[0].displayName) {
        return parsedModels;
      }
    }
    // If not found or invalid, set and return the default list.
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(baseBackendModels));
    return [...baseBackendModels];
  } catch (error) {
    console.error("Error parsing models from localStorage:", error);
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(baseBackendModels));
    return [...baseBackendModels];
  }
};

/**
 * Stores the given list of model objects into localStorage.
 * @param {object[]} models - An array of model objects to store.
 */
const storeModels = (models) => {
  try {
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(models));
  } catch (error) {
    console.error("Error saving models to localStorage:", error);
  }
};


function FeaturePage() {
  const [models, setModels] = useState([]);
  const [newModelName, setNewModelName] = useState('');
  const [selectedBackendModel, setSelectedBackendModel] = useState(baseBackendModels[0].backendModel);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setModels(getStoredModels());
  }, []);

  const handleFeatureToggle = (featureName) => {
    setSelectedFeatures(prev =>
      prev.includes(featureName)
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName]
    );
  };

  const simulateTrainingApiCall = (modelName, backendModel, features) => {
    console.log(`Simulating training for model "${modelName}" (using ${backendModel}) with features:`, features);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Model "${modelName}" trained successfully.` });
      }, 1500);
    });
  };

  const handleTrainModel = async (e) => {
    e.preventDefault();
    setFeedbackMessage({ type: '', text: '' });

    if (!newModelName.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Model name cannot be empty.' });
      return;
    }
    if (models.some(m => m.displayName.toLowerCase() === newModelName.trim().toLowerCase())) {
      setFeedbackMessage({ type: 'error', text: 'A model with this name already exists.' });
      return;
    }
    if (selectedFeatures.length < 2) {
      setFeedbackMessage({ type: 'error', text: 'Please select at least two features to train the model.' });
      return;
    }

    setIsTraining(true);

    const result = await simulateTrainingApiCall(newModelName.trim(), selectedBackendModel, selectedFeatures);

    setIsTraining(false);

    if (result.success) {
      const newModelObject = {
        displayName: newModelName.trim(),
        backendModel: selectedBackendModel,
        features: selectedFeatures // Storing features for future reference
      };
      const updatedModels = [...models, newModelObject];
      storeModels(updatedModels);
      setModels(updatedModels);
      setFeedbackMessage({ type: 'success', text: result.message });
      setNewModelName('');
      setSelectedFeatures([]);
      setSelectedBackendModel(baseBackendModels[0].backendModel);
    } else {
      setFeedbackMessage({ type: 'error', text: result.message || "An unknown error occurred during training." });
    }
  };

  const handleDeleteModel = (modelNameToDelete) => {
    if (window.confirm(`Are you sure you want to delete the model: "${modelNameToDelete}"?`)) {
      const updatedModels = models.filter(model => model.displayName !== modelNameToDelete);
      storeModels(updatedModels);
      setModels(updatedModels);
      setFeedbackMessage({ type: 'success', text: `Model "${modelNameToDelete}" has been deleted.` });
    }
  };

  const handleResetModels = () => {
    if (window.confirm("Are you sure you want to reset all models to their default set?")) {
      storeModels(baseBackendModels);
      setModels(baseBackendModels);
      setFeedbackMessage({ type: 'success', text: "Models have been reset to the default set." });
    }
  };

  return (
    <div className="feature-page-container">
      <h1>Model Management (Admin)</h1>
      <p>Manage models available to users in the calculator. Changes take effect immediately.</p>

      <div className="training-section">
        <h2>Train a New Model</h2>
        <form onSubmit={handleTrainModel} noValidate>
          <div className="form-group-textfield">
            <label htmlFor="modelName">New Model Display Name</label>
            <input
              type="text"
              id="modelName"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              placeholder="e.g., My Custom RF Model"
              disabled={isTraining}
            />
          </div>

          {/* --- NEW: Dropdown to select the base model --- */}
          <div className="form-group-textfield">
            <label htmlFor="backendModel">Base Algorithm</label>
            <select
                id="backendModel"
                value={selectedBackendModel}
                onChange={(e) => setSelectedBackendModel(e.target.value)}
                disabled={isTraining}
                style={{ width: '100%', padding: '10px 14px', fontSize: '1em', borderRadius: '5px', border: '1px solid #ccc' }}
            >
                {baseBackendModels.map(model => (
                    <option key={model.backendModel} value={model.backendModel}>
                        {model.displayName}
                    </option>
                ))}
            </select>
          </div>

          <div className="form-group-features">
            <label>Select Features for Training</label>
            <div className="features-checkbox-group">
              {availableFeatures.map(feature => (
                <div key={feature} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`feature-${feature}`}
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    disabled={isTraining}
                  />
                  <label htmlFor={`feature-${feature}`}>{feature}</label>
                </div>
              ))}
            </div>
          </div>
          
          <button type="submit" className="train-btn" disabled={isTraining}>
            {isTraining ? 'Training...' : 'Train Model'}
          </button>
        </form>
        {feedbackMessage.text && (
          <div className={`feedback-message ${feedbackMessage.type}`}>
            {feedbackMessage.text}
          </div>
        )}
      </div>

      <hr className="section-divider" />

      <div className="management-section">
        <h2>Existing Models</h2>
        {models.length > 0 ? (
          <ul className="models-list">
            {models.map((model) => (
              <li key={model.displayName} className="model-item">
                <span>{model.displayName}</span>
                <button
                  onClick={() => handleDeleteModel(model.displayName)}
                  className="delete-btn"
                  aria-label={`Delete ${model.displayName} model`}
                  disabled={isTraining}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No models are currently configured.</p>
        )}
        <button
          onClick={handleResetModels}
          className="reset-models-btn"
          disabled={isTraining}
        >
          Reset to Default Models
        </button>
      </div>
    </div>
  );
}

export default FeaturePage;

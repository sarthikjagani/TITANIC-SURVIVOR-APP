// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- Import AuthProvider

import './style/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* --- Wrap App with AuthProvider --- */}
      <AuthProvider>
        <App />
      </AuthProvider>
      {/* ---------------------------------- */}
    </BrowserRouter>
  </React.StrictMode>
);
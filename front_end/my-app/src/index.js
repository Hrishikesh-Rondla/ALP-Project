// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the AppWrapper, which contains the BrowserRouter
import AppWrapper from './App';

// If you have a main CSS file for bootstrap or custom styles, import it here
// For example:
// import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode helps find potential problems in an application.
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
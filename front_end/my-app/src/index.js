
import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Import the ThemeProvider you created
import { ThemeProvider } from './context/ThemeContext'; 

import AppWrapper from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap the entire AppWrapper with the ThemeProvider */}
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  </React.StrictMode>
);
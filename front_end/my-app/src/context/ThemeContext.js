// frontend/src/context/ThemeContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context with a default value
const ThemeContext = createContext();

// Create a custom hook to use the ThemeContext easily
export const useTheme = () => useContext(ThemeContext);

// Create the provider component
export const ThemeProvider = ({ children }) => {
    // State to hold the current theme. We get the initial value from localStorage or default to 'light'.
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Apply the theme to the root <html> element whenever the theme state changes.
        document.documentElement.setAttribute('data-theme', theme);
        // Save the theme choice to localStorage.
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Function to toggle between light and dark
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // The value that will be available to all consuming components
    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
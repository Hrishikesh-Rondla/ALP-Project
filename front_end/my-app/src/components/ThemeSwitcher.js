


// frontend/src/components/ThemeSwitcher.js (UPDATED with floating styles)

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();

    // CSS styles to make the button float in the top-right corner
    const switcherStyle = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1050, // Ensures it's on top of other elements
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background-card)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    };

    return (
        <button
            onClick={toggleTheme}
            style={switcherStyle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <Moon size={20} color="var(--text-secondary)" /> : <Sun size={20} color="var(--text-secondary)" />}
        </button>
    );
};

export default ThemeSwitcher;
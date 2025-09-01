// app/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

const themes = {
  light: { c1: '#FFFFFF', c2: '#000000'},
  dark: { c1: '#000000', c2: '#FFFFFF'},
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  const theme = themes[mode];

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
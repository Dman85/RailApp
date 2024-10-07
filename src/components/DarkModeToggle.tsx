import React from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, setDarkMode, className, children }) => {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${className}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {children}
    </button>
  );
};

export default DarkModeToggle;
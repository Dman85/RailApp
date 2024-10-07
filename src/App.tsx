import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import IntroVideo from './components/IntroVideo';
import Map from './components/Map';
import DarkModeToggle from './components/DarkModeToggle';
import { MapProvider } from './contexts/MapContext';
import { Sun, Moon } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleIntroEnd = () => {
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MapProvider>
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          {showIntro ? (
            <IntroVideo onEnd={handleIntroEnd} />
          ) : (
            <div className="relative w-full h-screen">
              <Map />
              <DarkModeToggle
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                className="absolute top-4 right-4 z-[1000]"
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </DarkModeToggle>
            </div>
          )}
        </div>
      </MapProvider>
    </QueryClientProvider>
  );
}

export default App;
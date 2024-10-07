import React, { createContext, useContext, useState } from 'react';

interface MapContextType {
  followMe: boolean;
  setFollowMe: (value: boolean) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [followMe, setFollowMe] = useState(false);

  return (
    <MapContext.Provider value={{ followMe, setFollowMe }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
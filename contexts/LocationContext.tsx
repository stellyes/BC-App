import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  isLocationVerified: boolean;
  isInCalifornia: boolean | null;
  verifyLocation: (inCalifornia: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [isInCalifornia, setIsInCalifornia] = useState<boolean | null>(null);

  const verifyLocation = (inCalifornia: boolean) => {
    setIsInCalifornia(inCalifornia);
    setIsLocationVerified(true);
  };

  return (
    <LocationContext.Provider value={{ isLocationVerified, isInCalifornia, verifyLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

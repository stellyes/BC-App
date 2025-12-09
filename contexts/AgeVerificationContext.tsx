import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AgeVerificationContextType {
  isAgeVerified: boolean;
  verifyAge: () => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export function AgeVerificationProvider({ children }: { children: ReactNode }) {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const verifyAge = () => {
    setIsAgeVerified(true);
  };

  return (
    <AgeVerificationContext.Provider value={{ isAgeVerified, verifyAge }}>
      {children}
    </AgeVerificationContext.Provider>
  );
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
}

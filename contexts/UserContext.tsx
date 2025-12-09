import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  firstName: string;
  lastName: string;
  nickname?: string;
  dateOfBirth: string;
  driversLicense: string;
  idExpiryDate: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
  rewardsBalance: number;
  pastPurchasesCount: number;
  hasMMID?: boolean;
}

interface UserContextType {
  isLoggedIn: boolean;
  userData: UserData | null;
  login: () => void;
  logout: () => void;
}

const defaultUserData: UserData = {
  firstName: 'John',
  lastName: 'Doe',
  nickname: 'JD',
  dateOfBirth: '01/15/1990',
  driversLicense: 'D1234567',
  idExpiryDate: '01/15/2028',
  gender: 'Male',
  email: 'john.doe@email.com',
  phone: '(415) 555-0123',
  address: '123 Market St, San Francisco, CA 94103',
  rewardsBalance: 25.50,
  pastPurchasesCount: 12,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const login = () => {
    setIsLoggedIn(true);
    setUserData(defaultUserData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

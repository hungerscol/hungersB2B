import React from 'react';
import { useLocation } from './GlobalStoreContext.tsx';

export const useCountry = () => {
  const { location, setLocation } = useLocation();
  return {
    country: location,
    setCountry: (code: string) => setLocation(code as any)
  };
};

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
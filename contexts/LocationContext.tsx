import React from 'react';
import { useLocation as useGlobalLocation } from './GlobalStoreContext.tsx';
export const useLocation = useGlobalLocation;
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

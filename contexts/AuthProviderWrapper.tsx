
import React from 'react';
import { AuthProvider } from './AuthContext.tsx';

export const AuthProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProviderWrapper;

import React from 'react';
import { ShoppingCartProvider as Provider } from './ShoppingCartContext.tsx';

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider>{children}</Provider>;
};

export default ShoppingCartProvider;
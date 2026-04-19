
// Fix: Added React import to resolve 'Cannot find namespace React' errors
import React from 'react';
import { useShoppingCart as useGlobalCart } from './GlobalStoreContext.tsx';
export const useShoppingCart = useGlobalCart;
export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, LocationCode } from '../types.ts';
import Cookies from 'js-cookie';

type Action = 
  | { type: 'ADD_TO_CART'; payload: { item: MenuItem; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOCATION'; payload: LocationCode };

interface GlobalState {
  cart: CartItem[];
  location: LocationCode;
}

const initialState: GlobalState = {
  cart: [],
  location: (Cookies.get('user_location') as LocationCode) || 'BOG'
};

function globalReducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.menuItem.id === action.payload.item.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i => 
            i.menuItem.id === action.payload.item.id 
              ? { ...i, quantity: i.quantity + action.payload.quantity } 
              : i
          )
        };
      }
      return { ...state, cart: [...state.cart, { menuItem: action.payload.item, quantity: action.payload.quantity }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.menuItem.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(i => 
          i.menuItem.id === action.payload.itemId ? { ...i, quantity: action.payload.quantity } : i
        ).filter(i => i.quantity > 0)
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_LOCATION':
      if (state.location === action.payload) return state;
      Cookies.set('user_location', action.payload, { expires: 30 });
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

const GlobalStoreContext = createContext<{ state: GlobalState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const GlobalStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState, (initial) => {
    const savedCart = localStorage.getItem('hungers_cart');
    if (savedCart) {
        try {
            const parsed = JSON.parse(savedCart);
            return { ...initial, cart: Array.isArray(parsed) ? parsed : [] };
        } catch (e) {
            localStorage.removeItem('hungers_cart');
        }
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('hungers_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <GlobalStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(GlobalStoreContext);
  if (!context) throw new Error('useShoppingCart must be used within GlobalStoreProvider');
  const { state, dispatch } = context;
  
  return React.useMemo(() => ({
    cart: state.cart,
    addToCart: (item: MenuItem, quantity: number) => dispatch({ type: 'ADD_TO_CART', payload: { item, quantity } }),
    removeFromCart: (itemId: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: itemId }),
    updateQuantity: (itemId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' })
  }), [state.cart, dispatch]);
};

export const useLocation = () => {
  const context = useContext(GlobalStoreContext);
  if (!context) throw new Error('useLocation must be used within GlobalStoreProvider');
  const { state, dispatch } = context;
  
  return React.useMemo(() => ({
    location: state.location,
    setLocation: (location: LocationCode) => dispatch({ type: 'SET_LOCATION', payload: location })
  }), [state.location, dispatch]);
};

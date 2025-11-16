import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Property } from '../types';

interface CartContextType {
  cartItems: Property[];
  addToCart: (property: Property) => void;
  removeFromCart: (propertyId: string) => void;
  isInCart: (propertyId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Property[]>([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartProperties');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const updateLocalStorage = (updatedCart: Property[]) => {
    localStorage.setItem('cartProperties', JSON.stringify(updatedCart));
  };

  const addToCart = (property: Property) => {
    setCartItems(prevItems => {
      const newCart = [...prevItems, property];
      updateLocalStorage(newCart);
      return newCart;
    });
  };

  const removeFromCart = (propertyId: string) => {
    setCartItems(prevItems => {
      const newCart = prevItems.filter(p => p.id !== propertyId);
      updateLocalStorage(newCart);
      return newCart;
    });
  };

  const isInCart = (propertyId: string): boolean => {
    return cartItems.some(p => p.id === propertyId);
  };
  
  const value = { cartItems, addToCart, removeFromCart, isInCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
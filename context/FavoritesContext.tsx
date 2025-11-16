import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Property } from '../types';

interface FavoritesContextType {
  favorites: Property[];
  addFavorite: (property: Property) => void;
  removeFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Property[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteProperties');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const updateLocalStorage = (updatedFavorites: Property[]) => {
    localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
  };

  const addFavorite = (property: Property) => {
    setFavorites(prevFavorites => {
      const newFavorites = [...prevFavorites, property];
      updateLocalStorage(newFavorites);
      return newFavorites;
    });
  };

  const removeFavorite = (propertyId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(p => p.id !== propertyId);
      updateLocalStorage(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (propertyId: string): boolean => {
    return favorites.some(p => p.id === propertyId);
  };
  
  const value = { favorites, addFavorite, removeFavorite, isFavorite };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// src/context/FavoritesContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface FavoritesContextProps {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextProps>({
  favoriteIds: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  clearFavorites: () => {},
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const addFavorite = (id: string) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFavorite = (id: string) => {
    setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  return useContext(FavoritesContext);
}

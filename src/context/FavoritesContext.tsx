import React, { createContext, useState, useContext } from 'react';

interface FavoritesContextProps {
  favoriteIds: string[];
  userKey: string | null;
  setUserKey: (userKey: string) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  loadFavorites: (userKey: string) => void;
}

const FavoritesContext = createContext<FavoritesContextProps>({
  favoriteIds: [],
  userKey: null,
  setUserKey: () => {},
  addFavorite: () => {},
  removeFavorite: () => {},
  clearFavorites: () => {},
  loadFavorites: () => {},
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userKey, setUserKey] = useState<string | null>(null);

  // Save favorites to localStorage using the userKey as key
  const persistFavorites = (key: string, favorites: string[]) => {
    localStorage.setItem(`favorites_${key}`, JSON.stringify(favorites));
  };

  const loadFavorites = (key: string) => {
    setUserKey(key);
    const stored = localStorage.getItem(`favorites_${key}`);
    if (stored) {
      setFavoriteIds(JSON.parse(stored));
    } else {
      setFavoriteIds([]);
    }
  };

  const addFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const newFavorites = prev.includes(id) ? prev : [...prev, id];
      if (userKey) {
        persistFavorites(userKey, newFavorites);
      }
      return newFavorites;
    });
  };

  const removeFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const newFavorites = prev.filter((favId) => favId !== id);
      if (userKey) {
        persistFavorites(userKey, newFavorites);
      }
      return newFavorites;
    });
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
    setUserKey(null);
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, userKey, setUserKey, addFavorite, removeFavorite, clearFavorites, loadFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  return useContext(FavoritesContext);
}

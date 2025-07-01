import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { getDogsByIds, Dog, matchDogs } from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Toolbar,
} from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import DogCard from '../components/DogCard';

interface FavoritesPageProps {
  mode: 'light' | 'dark';
  onToggleDarkMode: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  mode,
  onToggleDarkMode,
}) => {
  const navigate = useNavigate();
  const { favoriteIds, removeFavorite } = useFavorites();
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        if (favoriteIds.length > 0) {
          const dogs = await getDogsByIds(favoriteIds);
          setFavoriteDogs(dogs);
        } else {
          setFavoriteDogs([]);
        }
      } catch {
        setError('Failed to load favorite dogs');
      }
    })();
  }, [favoriteIds]);

  const handleMatch = async () => {
    if (favoriteIds.length === 0) {
      setError('No favorites selected to match.');
      return;
    }
    try {
      const matchedId = await matchDogs(favoriteIds);
      navigate('/match', { state: { matchedId } });
    } catch {
      setError('Failed to generate match.');
    }
  };

  return (
    <>
      <NavigationBar mode={mode} onToggleDarkMode={onToggleDarkMode} />
      <Toolbar />

      <Container>
        <Typography variant="h4" marginY={2}>
          Your Favorites
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          onClick={handleMatch}
          disabled={favoriteIds.length === 0}
        >
          Generate a Match
        </Button>
        <Box
          mt={2}
          display="grid"
          gridTemplateColumns="repeat(auto-fill,minmax(250px,1fr))"
          gap={2}
        >
          {favoriteDogs.map(dog => (
            <DogCard
              key={dog.id}
              dog={dog}
              onFavorite={() => removeFavorite(dog.id)}
              onUnfavorite={() => removeFavorite(dog.id)}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default FavoritesPage;

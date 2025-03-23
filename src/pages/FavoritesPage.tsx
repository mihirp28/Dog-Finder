// src/pages/FavoritesPage.tsx

import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { getDogsByIds, Dog, matchDogs } from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

const FavoritesPage: React.FC = () => {
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
      } catch (err) {
        console.error(err);
        setError('Failed to load favorite dogs');
      }
    })();
  }, [favoriteIds]);

  const handleMatch = async () => {
    try {
      if (favoriteIds.length === 0) {
        setError('No favorites selected to match.');
        return;
      }
      const matchedId = await matchDogs(favoriteIds);
      // store matchedId in state or navigate to match page
      navigate('/match', { state: { matchedId } });
    } catch (err) {
      console.error(err);
      setError('Failed to generate match.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" marginY={2}>
        Your Favorites
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handleMatch} disabled={favoriteIds.length === 0}>
        Generate a Match
      </Button>
      <Box display="flex" flexWrap="wrap" gap={2} marginTop={2}>
        {favoriteDogs.map((dog) => (
          <Card key={dog.id} style={{ width: 250 }}>
            <CardMedia
              component="img"
              image={dog.img}
              alt={dog.name}
              height="200"
            />
            <CardContent>
              <Typography variant="h6">{dog.name}</Typography>
              <Typography>Breed: {dog.breed}</Typography>
              <Typography>Age: {dog.age}</Typography>
              <Typography>ZIP: {dog.zip_code}</Typography>
              <Button variant="outlined" onClick={() => removeFavorite(dog.id)}>
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default FavoritesPage;

// src/components/DogCard.tsx

import React from 'react';
import { Dog } from '../api';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

interface Props {
  dog: Dog;
  onFavorite?: () => void;
}

const DogCard: React.FC<Props> = ({ dog, onFavorite }) => {
  return (
    <Card style={{ width: 250 }}>
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
        {onFavorite && (
          <Button variant="contained" onClick={onFavorite} style={{ marginTop: '1rem' }}>
            Add to Favorites
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DogCard;

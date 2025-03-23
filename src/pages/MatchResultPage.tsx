// src/pages/MatchResultPage.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dog, getDogsByIds } from '../api';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from '@mui/material';

const MatchResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  
  // matchedId is passed via react-router
  const matchedId = (location.state as { matchedId?: string })?.matchedId;

  useEffect(() => {
    (async () => {
      if (!matchedId) return;
      try {
        const [dog] = await getDogsByIds([matchedId]);
        setMatchedDog(dog);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [matchedId]);

  if (!matchedId) {
    return (
      <Container>
        <Typography variant="h5" color="error" marginY={4}>
          No matched dog found. Go back and select favorites!
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/search')}>Return to Search</Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" marginY={2}>Your Match!</Typography>
      {matchedDog ? (
        <Card style={{ maxWidth: 400, margin: 'auto' }}>
          <CardMedia
            component="img"
            image={matchedDog.img}
            alt={matchedDog.name}
            height="300"
          />
          <CardContent>
            <Typography variant="h5">{matchedDog.name}</Typography>
            <Typography>Breed: {matchedDog.breed}</Typography>
            <Typography>Age: {matchedDog.age}</Typography>
            <Typography>ZIP: {matchedDog.zip_code}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography>Loading matched dog...</Typography>
      )}
      <Button variant="contained" onClick={() => navigate('/search')} style={{ marginTop: '1rem' }}>
        Back to Search
      </Button>
    </Container>
  );
};

export default MatchResultPage;

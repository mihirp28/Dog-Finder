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
  Toolbar,
} from '@mui/material';
import NavigationBar from '../components/NavigationBar';

interface MatchResultPageProps {
  mode: 'light' | 'dark';
  onToggleDarkMode: () => void;
}

const MatchResultPage: React.FC<MatchResultPageProps> = ({
  mode,
  onToggleDarkMode,
}) => {
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
      <>
        <NavigationBar mode={mode} onToggleDarkMode={onToggleDarkMode} />
        <Toolbar />
        <Container>
          <Typography variant="h5" color="error" marginY={4}>
            No matched dog found. Go back and select favorites!
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/search')}>
            Return to favorites
          </Button>
        </Container>
      </>
    ); 
  }

  return (
    <>
      <NavigationBar mode={mode} onToggleDarkMode={onToggleDarkMode} />
      <Toolbar />
      <Container>
        <Typography variant="h3" marginY={2}>
          Your Match!
        </Typography>
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
        <Button
          variant="contained"
          onClick={() => navigate('/favorites')}
          style={{ marginTop: '1rem' }}
        >
          Back to Search
        </Button>
      </Container>
    </>
  );
};

export default MatchResultPage;

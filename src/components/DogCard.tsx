import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  IconButton,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { Dog } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import { getLocations } from '../api';
import DogDetailModal from './DogDetailsModal';

interface Location {
  zip_code: string;
  city: string;
  state: string;
  county: string;
}

interface Props {
  dog: Dog;
  onFavorite?: () => void;
  onUnfavorite?: () => void;
}

const DogCard: React.FC<Props> = ({ dog, onFavorite, onUnfavorite }) => {
  const theme = useTheme();
  const { favoriteIds } = useFavorites();
  const isFavorited = favoriteIds.includes(dog.id);

  const [hover, setHover] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // fetch zip → city/state/county
  useEffect(() => {
    (async () => {
      try {
        const locs = await getLocations([dog.zip_code]);
        if (locs.length) setLocation(locs[0]);
      } catch (err) {
        console.error('ZIP lookup failed', err);
      }
    })();
  }, [dog.zip_code]);

  const toggleFavorite = () => {
    if (isFavorited) onUnfavorite?.();
    else onFavorite?.();
  };

  return (
    <>
      <Card
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          width: 250,
          height: 350,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 2,
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Flippable image area */}
        <Box
          sx={{
            position: 'relative',
            height: 210,
            perspective: 1000,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: hover ? 'rotateY(180deg)' : 'none',
              position: 'relative',
            }}
          >
            {/* Front side */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            >
              {/* blurred background */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${dog.img})`,
                  backgroundSize: 'cover',
                  filter: 'blur(8px)',
                  transform: 'scale(1.1)',
                  zIndex: 1,
                }}
              />
              <CardMedia
                component="img"
                src={dog.img}
                alt={dog.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 2,
                }}
              />
            </Box>

            {/* Back side */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                top: 0,
                left: 0,
                transform: 'rotateY(180deg)',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                boxSizing: 'border-box',
              }}
            >
              <Typography variant="body2">Age: {dog.age}</Typography>
              <Typography variant="body2">ZIP: {dog.zip_code}</Typography>
              {location ? (
                <>
                  <Typography variant="body2">
                    City: {location.city}
                  </Typography>
                  <Typography variant="body2">
                    State: {location.state}
                  </Typography>
                  <Typography variant="body2">
                    County: {location.county}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2">Loading…</Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Bottom controls */}
        <Box
          sx={{
            flex: 1,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box textAlign="center">
            <Typography variant="subtitle1" noWrap>
              {dog.name}
            </Typography>
            <Typography variant="body2" noWrap>
              Breed: {dog.breed}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={toggleFavorite} sx={{ color: isFavorited ? 'error.main' : 'inherit' }}>
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton onClick={() => setModalOpen(true)}>
              <ZoomOutMapIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>

      <DogDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dog={dog}
        location={location}
        isFavorited={isFavorited}
        toggleFavorite={toggleFavorite}
      />
    </>
  );
};

export default DogCard;

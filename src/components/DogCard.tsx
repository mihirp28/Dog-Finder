// src/components/DogCard.tsx
import React from 'react';
import { CardMedia, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Dog } from '../api';
import { useFavorites } from '../context/FavoritesContext';

interface Props {
  dog: Dog;
  // Callback to call when dog is added to favorites
  onFavorite?: () => void;
  // Callback to call when dog is removed from favorites
  onUnfavorite?: () => void;
}

const DogCard: React.FC<Props> = ({ dog, onFavorite, onUnfavorite }) => {
  const { favoriteIds } = useFavorites();
  const isFavorited = favoriteIds.includes(dog.id);
  const [flipped, setFlipped] = React.useState(false);

  // Container style with perspective for 3D effect
  const cardContainerStyle: React.CSSProperties = {
    width: 250,
    height: 300,
    perspective: '1000px',
  };

  // Inner container holds both faces and rotates on hover
  const cardInnerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    transform: flipped ? 'rotateY(180deg)' : 'none',
  };

  // Common face style
  const cardFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  };

  // Front face: show only image
  const cardFrontStyle: React.CSSProperties = {
    ...cardFaceStyle,
  };

  // Back face: show details; divided into two parts (60% top, 40% bottom)
  const cardBackStyle: React.CSSProperties = {
    ...cardFaceStyle,
    transform: 'rotateY(180deg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '0.5rem',
    boxSizing: 'border-box',
    backgroundColor: '#f8f8f8',
  };

  // Toggle favorite state by calling the appropriate callback
  const toggleFavorite = () => {
    if (isFavorited) {
      if (onUnfavorite) onUnfavorite();
    } else {
      if (onFavorite) onFavorite();
    }
  };

  return (
    <div
      style={cardContainerStyle}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div style={cardInnerStyle}>
        {/* Front side: show image */}
        <div style={cardFrontStyle}>
          <CardMedia
            component="img"
            image={dog.img}
            alt={dog.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Back side: details and favorite icon */}
        <div style={cardBackStyle}>
          {/* Top 60%: Dog Name */}
          <div
            style={{
              flex: 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6">{dog.name}</Typography>
          </div>
          {/* Bottom 40%: Breed and Heart Icon */}
          <div
            style={{
              flex: 0.4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1">Breed: {dog.breed}</Typography>
            <IconButton onClick={toggleFavorite} style={{ transition: 'color 0.3s ease' }}>
              {isFavorited ? (
                <FavoriteIcon style={{ color: 'red', transition: 'color 0.3s ease' }} />
              ) : (
                <FavoriteBorderIcon style={{ transition: 'color 0.3s ease' }} />
              )}
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogCard;

// src/components/DogCard.tsx
import React, { useState, useEffect } from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// Instead of ZoomInIcon, import ZoomOutMapIcon (diagonal arrows)
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
  const { favoriteIds } = useFavorites();
  const isFavorited = favoriteIds.includes(dog.id);

  const [hover, setHover] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locations = await getLocations([dog.zip_code]);
        if (locations && locations.length > 0) {
          setLocation(locations[0]);
        }
      } catch (error) {
        console.error('Error fetching location for ZIP:', dog.zip_code, error);
      }
    };
    fetchLocation();
  }, [dog.zip_code]);

  const toggleFavorite = () => {
    if (isFavorited) {
      onUnfavorite?.();
    } else {
      onFavorite?.();
    }
  };

  // --- Styles ---
  const cardContainerStyle: React.CSSProperties = {
    width: '250px',
    height: '350px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '6px',
    overflow: 'hidden',
  };

  const topImageContainer: React.CSSProperties = {
    position: 'relative',
    height: '210px',
    perspective: '1000px',
  };

  const flipper: React.CSSProperties = {
    width: '100%',
    height: '100%',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    transform: hover ? 'rotateY(180deg)' : 'none',
    position: 'relative',
  };

  const faceCommon: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    top: 0,
    left: 0,
  };

  const frontFace: React.CSSProperties = {
    ...faceCommon,
    zIndex: 2,
  };

  const backFace: React.CSSProperties = {
    ...faceCommon,
    transform: 'rotateY(180deg)',
    backgroundColor: '#f8f8f8',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.5rem',
    boxSizing: 'border-box',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'relative',
    zIndex: 2,
  };

  const blurBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${dog.img})`,
    backgroundSize: 'cover',
    filter: 'blur(8px)',
    transform: 'scale(1.1)',
    zIndex: 1,
  };

  const bottomContent: React.CSSProperties = {
    height: '140px',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  return (
    <>
      <div style={cardContainerStyle}>
        {/* TOP: Flippable image area */}
        <div
          style={topImageContainer}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div style={flipper}>
            {/* FRONT IMAGE */}
            <div style={frontFace}>
              <div style={blurBackgroundStyle} />
              <img src={dog.img} alt={dog.name} style={imageStyle} />
            </div>
            {/* BACK INFO */}
            <div style={backFace}>
              <Typography variant="body2">Age: {dog.age}</Typography>
              <Typography variant="body2">ZIP: {dog.zip_code}</Typography>
              {location ? (
                <>
                  <Typography variant="body2">City: {location.city}</Typography>
                  <Typography variant="body2">State: {location.state}</Typography>
                  <Typography variant="body2">County: {location.county}</Typography>
                </>
              ) : (
                <Typography variant="body2">Loading...</Typography>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM: Static area */}
        <div style={bottomContent}>
          <Typography variant="h6" noWrap>
            {dog.name}
          </Typography>
          <Typography variant="body2" noWrap>
            Breed: {dog.breed}
          </Typography>
          <Box display="flex" gap={1}>
            <IconButton onClick={toggleFavorite} style={{ transition: 'color 0.3s ease' }}>
              {isFavorited ? (
                <FavoriteIcon style={{ color: 'red' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            {/* Enlarge Button -> ZoomOutMapIcon (diagonal arrows) */}
            <IconButton onClick={() => setModalOpen(true)}>
              <ZoomOutMapIcon />
            </IconButton>
          </Box>
        </div>
      </div>

      {/* Dog Detail Modal */}
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

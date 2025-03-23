import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Slider,
  Box,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Dog } from '../api';

interface Location {
  city: string;
  state: string;
  county: string;
}

interface DogDetailModalProps {
  open: boolean;
  onClose: () => void;
  dog: Dog;
  location?: Location | null;
  isFavorited: boolean;
  toggleFavorite: () => void;
}

const DogDetailModal: React.FC<DogDetailModalProps> = ({
  open,
  onClose,
  dog,
  location,
  isFavorited,
  toggleFavorite,
}) => {
  // Zoom state: 1 = 100%, up to 2 (200%)
  const [zoom, setZoom] = useState<number>(1);

  const handleZoomChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setZoom(newValue);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {dog.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Image area with zoom slider */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            component="img"
            src={dog.img}
            alt={dog.name}
            sx={{
              transform: `scale(${zoom})`,
              transition: 'transform 0.3s',
              maxWidth: '100%',
              maxHeight: '400px',
            }}
          />
          <Box width="80%" mt={2}>
            <Typography variant="body2">Zoom</Typography>
            <Slider
              value={zoom}
              onChange={handleZoomChange}
              min={1}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>

        {/* Dog details */}
        <Box mt={2}>
          <Typography variant="subtitle1">Breed: {dog.breed}</Typography>
          <Typography variant="subtitle1">Age: {dog.age}</Typography>
          <Typography variant="subtitle1">ZIP: {dog.zip_code}</Typography>
          {location ? (
            <>
              <Typography variant="subtitle2">City: {location.city}</Typography>
              <Typography variant="subtitle2">State: {location.state}</Typography>
              <Typography variant="subtitle2">County: {location.county}</Typography>
            </>
          ) : (
            <Typography variant="subtitle2">Location data unavailable</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <IconButton onClick={toggleFavorite}>
          <FavoriteIcon sx={{ color: isFavorited ? 'red' : 'inherit' }} />
        </IconButton>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DogDetailModal;

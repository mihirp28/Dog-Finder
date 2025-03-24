// src/components/LeftFilterPanel.tsx

import React from 'react';
import { Box, Slider, Typography, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

interface LeftFilterPanelProps {
  breeds: string[];
  selectedBreed: string;
  handleBreedChange: (event: React.SyntheticEvent, value: string | null) => void;
  ageRange: number[];
  setAgeRange: (newRange: number[]) => void;
}

const LeftFilterPanel: React.FC<LeftFilterPanelProps> = ({
  breeds,
  selectedBreed,
  handleBreedChange,
  ageRange,
  setAgeRange,
}) => {

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setAgeRange(newValue);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Breed Filter */}
      <Autocomplete
        options={breeds}
        value={selectedBreed}
        onChange={handleBreedChange}
        renderInput={(params) => <TextField {...params} label="Breed" variant="outlined" />}
        sx={{ minWidth: 200 }}
      />

      {/* Age Slider */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>Age Filter</Typography>
        <Slider
          value={ageRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={0}
          max={20}  // or whatever max age you want
        />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Min: {ageRange[0]}</Typography>
          <Typography variant="body2">Max: {ageRange[1]}+</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LeftFilterPanel;

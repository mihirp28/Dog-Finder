import React from 'react';
import { Box, Slider, Typography, TextField, Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { US_STATES } from '../api/locationApi';

interface LeftFilterPanelProps {
  // Breed
  allBreeds: string[];
  selectedBreeds: string[];
  onBreedChange: (newBreeds: string[]) => void;

  // Age
  ageRange: number[];
  setAgeRange: (newRange: number[]) => void;

  // Multi-location filters
  selectedStates: string[];
  onStateChange: (vals: string[]) => void;

  selectedCities: string[];
  onCityChange: (vals: string[]) => void;

  selectedCounties: string[];
  onCountyChange: (vals: string[]) => void;

  selectedZips: string[];
  onZipChange: (vals: string[]) => void;

  // Options for dropdowns (seeded once on mount)
  availableCities: string[];
  availableCounties: string[];
  availableZips: string[];

  // Final “Apply” callback
  onApplyLocationFilter: () => void;
}

const LeftFilterPanel: React.FC<LeftFilterPanelProps> = ({
  allBreeds,
  selectedBreeds,
  onBreedChange,
  ageRange,
  setAgeRange,
  selectedStates,
  onStateChange,
  selectedCities,
  onCityChange,
  selectedCounties,
  onCountyChange,
  selectedZips,
  onZipChange,
  availableCities,
  availableCounties,
  availableZips,
  onApplyLocationFilter,
}) => {
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) setAgeRange(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Breed Filter */}
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Breed Filter
      </Typography>
      <Autocomplete
        multiple
        options={allBreeds}
        value={selectedBreeds}
        onChange={(_, v) => onBreedChange(v as string[])}
        renderInput={(params) => (
          <TextField {...params} label="Breeds" variant="outlined" />
        )}
        sx={{ minWidth: 200 }}
      />

      {/* Age Filter */}
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Age Filter
      </Typography>
      <Slider
        value={ageRange}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={0}
        max={20}
      />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">Min: {ageRange[0]}</Typography>
        <Typography variant="body2">Max: {ageRange[1]}+</Typography>
      </Box>

      {/* Location Filter */}
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Location Filter
      </Typography>

      {/* States */}
      <Autocomplete
        multiple
        size="small"
        options={US_STATES}
        value={selectedStates}
        onChange={(_, v) => onStateChange(v as string[])}
        renderInput={(params) => (
          <TextField
            {...params}
            label="States"
            placeholder="Select states"
            variant="outlined"
            fullWidth
          />
        )}
        sx={{ mb: 2 }}
      />

      {/* Cities */}
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={availableCities}
        value={selectedCities}
        onChange={(_, v) => onCityChange(v as string[])}
        renderInput={(params) => (
          <TextField {...params} label="Cities" variant="outlined" fullWidth />
        )}
      />

      {/* Counties */}
      <Autocomplete
        multiple
        size="small"
        options={availableCounties}
        value={selectedCounties}
        onChange={(_, v) => onCountyChange(v as string[])}
        renderInput={(params) => (
          <TextField {...params} label="Counties" variant="outlined" fullWidth />
        )}
      />

      {/* ZIP Codes */}
      <Autocomplete
        multiple
        size="small"
        options={availableZips}
        value={selectedZips}
        onChange={(_, v) => onZipChange(v as string[])}
        renderInput={(params) => (
          <TextField {...params} label="ZIP Codes" variant="outlined" fullWidth />
        )}
      />

      <Button variant="contained" onClick={onApplyLocationFilter}>
        Apply Location Filter
      </Button>
    </Box>
  );
};

export default LeftFilterPanel;

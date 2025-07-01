import React from 'react';
import { Box, Slider, Typography, TextField, Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

interface LeftFilterPanelProps {
  // Multiple breed filter
  allBreeds: string[];
  selectedBreeds: string[];
  onBreedChange: (newBreeds: string[]) => void;
  
  // Age filter
  ageRange: number[];
  setAgeRange: (newRange: number[]) => void;

  // Location filters
  availableCities: string[];
  availableStates: string[];
  availableCounties: string[];
  availableZips: string[];

  city: string;
  stateVal: string;
  county: string;
  zipCode: string;
  onCityChange: (val: string) => void;
  onStateChange: (val: string) => void;
  onCountyChange: (val: string) => void;
  onZipChange: (val: string) => void;

  // Callback for applying location filters
  onApplyLocationFilter: () => void;
}

const LeftFilterPanel: React.FC<LeftFilterPanelProps> = ({
  allBreeds,
  selectedBreeds,
  onBreedChange,
  ageRange,
  setAgeRange,
  availableCities,
  availableStates,
  availableCounties,
  availableZips,
  city,
  stateVal,
  county,
  zipCode,
  onCityChange,
  onStateChange,
  onCountyChange,
  onZipChange,
  onApplyLocationFilter,
}) => {
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setAgeRange(newValue);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Multiple Breed Filter */}
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Breed Filter
      </Typography>
      <Autocomplete
        multiple
        options={allBreeds}
        value={selectedBreeds}
        onChange={(event, newValue) => onBreedChange(newValue)}
        renderInput={(params) => <TextField {...params} label="Breeds" variant="outlined" />}
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

      {/* Location Filters */}
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Location Filter
      </Typography>

      {/* State typeahead (2-letter) */}
      <Autocomplete
        size="small"
        freeSolo={false}
        options={availableStates}
        inputValue={stateVal}
        onInputChange={(e, val) => onStateChange(val.toUpperCase())}
        renderInput={(params) => (
          <TextField
            {...params}
            label="State"
            placeholder="Type 2 letters"
            variant="outlined"
            fullWidth
          />
        )}
        sx={{ mb: 2 }}
      />

      {/* City filter as an Autocomplete */}
      <Autocomplete
        options={availableCities}
        value={city}
        onChange={(event, newValue) => onCityChange(newValue || '')}
        renderInput={(params) => <TextField {...params} label="City" variant="outlined" fullWidth />}
      />

      {/* County dropdown */}
      <Autocomplete
        options={availableCounties}
        value={county}
        onChange={(event, newValue) => onCountyChange(newValue || '')}
        renderInput={(params) => <TextField {...params} label="County" variant="outlined" fullWidth />}
      />

      {/* ZIP Code dropdown */}
      <Autocomplete
        options={availableZips}
        value={zipCode}
        onChange={(event, newValue) => onZipChange(newValue || '')}
        renderInput={(params) => <TextField {...params} label="ZIP Code" variant="outlined" fullWidth />}
      />
      <Button variant="contained" onClick={onApplyLocationFilter}>
        Apply Location Filter
      </Button>
    </Box>
  );
};

export default LeftFilterPanel;

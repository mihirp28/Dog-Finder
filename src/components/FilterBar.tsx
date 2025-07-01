import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, IconButton, TextField, Slider, Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { SelectChangeEvent } from '@mui/material/Select';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface FilterBarProps {
  // Existing breed logic
  selectedBreed: string;
  handleBreedChange: (event: React.SyntheticEvent, value: string | null) => void;
  breeds: string[];

  // Sorting logic
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSortFieldChange: (newField: string) => void;
  toggleSortDirection: () => void;

  // Age slider logic
  ageRange: number[];            // e.g. [0, 20]
  setAgeRange: (newRange: number[]) => void;
  onAgeFilterApply?: () => void; // optional callback if you want a "Go" button
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedBreed,
  handleBreedChange,
  breeds,
  sortField,
  sortDirection,
  handleSortFieldChange,
  toggleSortDirection,
  ageRange,
  setAgeRange,
  onAgeFilterApply,
}) => {

  const handleSortFieldSelect = (event: SelectChangeEvent<string>) => {
    handleSortFieldChange(event.target.value);
  };

  // Called when the user drags the slider
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setAgeRange(newValue);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} padding="1rem">
      {/* Top Row: Breed Autocomplete & Sort */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Autocomplete
          options={breeds}
          value={selectedBreed}
          onChange={handleBreedChange}
          renderInput={(params) => <TextField {...params} label="Breed" variant="outlined" />}
          style={{ minWidth: 200 }}
        />

        <Box display="flex" alignItems="center" gap={1}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-field-label">Sort By</InputLabel>
            <Select
              labelId="sort-field-label"
              label="Sort By"
              value={sortField}
              onChange={handleSortFieldSelect}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="breed">Breed</MenuItem>
              <MenuItem value="age">Age</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={toggleSortDirection}>
            {sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Age Slider Section */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box minWidth={200}>
          <Slider
            value={ageRange}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={0}
            max={20} 
          />
          <Box display="flex" justifyContent="space-between">
            <span>Min Age: {ageRange[0]}</span>
            <span>Max Age: {ageRange[1]}+</span>
          </Box>
        </Box>
        {/* Optional "Go" button to confirm age selection */}
        {onAgeFilterApply && (
          <Button variant="contained" onClick={onAgeFilterApply}>
            Go
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FilterBar;

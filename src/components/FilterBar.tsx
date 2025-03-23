// src/components/FilterBar.tsx
import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface FilterBarProps {
  selectedBreed: string;
  handleBreedChange: (event: SelectChangeEvent<string>) => void;
  breeds: string[];
  sortParam: string;
  handleSortChange: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedBreed,
  handleBreedChange,
  breeds,
  sortParam,
  handleSortChange,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding="1rem">
      <FormControl variant="outlined" style={{ minWidth: 200 }}>
        <InputLabel id="breed-label">Breed</InputLabel>
        <Select
          labelId="breed-label"
          value={selectedBreed}
          onChange={handleBreedChange}
          label="Breed"
        >
          <MenuItem value="">
            <em>All Breeds</em>
          </MenuItem>
          {breeds.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {breed}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleSortChange}>
        Sort by Breed: {sortParam === 'breed:asc' ? 'Ascending' : 'Descending'}
      </Button>
    </Box>
  );
};

export default FilterBar;

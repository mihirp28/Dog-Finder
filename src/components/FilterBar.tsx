// src/components/FilterBar.tsx
import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

interface FilterBarProps {
  selectedBreed: string;
  // Note: onChange now receives (event, value)
  handleBreedChange: (event: React.SyntheticEvent, value: string | null) => void;
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
      <Autocomplete
        options={breeds}
        value={selectedBreed}
        onChange={handleBreedChange}
        renderInput={(params) => <TextField {...params} label="Breed" variant="outlined" />}
        style={{ minWidth: 200 }}
      />
      <Button variant="outlined" onClick={handleSortChange}>
        Sort by Breed: {sortParam === 'breed:asc' ? 'Ascending' : 'Descending'}
      </Button>
    </Box>
  );
};

export default FilterBar;

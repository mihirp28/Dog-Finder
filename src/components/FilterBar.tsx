// src/components/FilterBar.tsx
import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, IconButton, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { SelectChangeEvent } from '@mui/material/Select';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface FilterBarProps {
  selectedBreed: string;
  // onChange now receives (event, value)
  handleBreedChange: (event: React.SyntheticEvent, value: string | null) => void;
  breeds: string[];
  // New sort props:
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSortFieldChange: (newField: string) => void;
  toggleSortDirection: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedBreed,
  handleBreedChange,
  breeds,
  sortField,
  sortDirection,
  handleSortFieldChange,
  toggleSortDirection,
}) => {
  // Updated callback type using SelectChangeEvent
  const handleSortFieldSelect = (event: SelectChangeEvent<string>) => {
    handleSortFieldChange(event.target.value);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding="1rem">
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
  );
};

export default FilterBar;

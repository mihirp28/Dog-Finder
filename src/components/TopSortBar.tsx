import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface TopSortBarProps {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSortFieldChange: (field: string) => void;
  toggleSortDirection: () => void;
}

const TopSortBar: React.FC<TopSortBarProps> = ({
  sortField,
  sortDirection,
  handleSortFieldChange,
  toggleSortDirection,
}) => {
  const handleSortFieldSelect = (event: SelectChangeEvent<string>) => {
    handleSortFieldChange(event.target.value);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <FormControl variant="outlined" size="small">
        <InputLabel id="sort-field-label">Sort By</InputLabel>
        <Select
          labelId="sort-field-label"
          label="Sort By"
          value={sortField}
          onChange={handleSortFieldSelect}
          sx={{ width: 120 }}
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
  );
};

export default TopSortBar;

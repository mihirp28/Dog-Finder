// src/pages/SearchPage.tsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box
} from '@mui/material';
// IMPORTANT: import SelectChangeEvent
import { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

import { getAllBreeds, searchDogs, getDogsByIds, Dog } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import DogCard from '../components/DogCard';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { addFavorite, favoriteIds } = useFavorites();

  // State for the list of all possible breeds
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');

  // Sorting: "breed:asc" by default
  const [sortParam, setSortParam] = useState('breed:asc');

  // Pagination
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFrom, setCurrentFrom] = useState(0);
  const [pageSize] = useState(25); // default 25 per page

  // Load all breed options on mount
  useEffect(() => {
    (async () => {
      try {
        const allBreeds = await getAllBreeds();
        setBreeds(allBreeds);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Whenever filter/sort/pagination changes, fetch a new batch of dogs
  useEffect(() => {
    (async () => {
      try {
        const queryParams = {
          breeds: selectedBreed ? [selectedBreed] : undefined,
          sort: sortParam,
          size: pageSize,
          from: currentFrom,
        };

        // Step 1: Fetch list of matching IDs
        const searchRes = await searchDogs(queryParams);
        setTotalResults(searchRes.total);

        // Step 2: Fetch the dog objects by those IDs
        const dogData = await getDogsByIds(searchRes.resultIds);
        setDogs(dogData);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selectedBreed, sortParam, currentFrom, pageSize]);

  // IMPORTANT: Use SelectChangeEvent<string> for MUI's Select onChange
  const handleBreedChange = (event: SelectChangeEvent<string>) => {
    setSelectedBreed(event.target.value);
    setCurrentFrom(0); // reset pagination if filter changes
  };

  const handleSortChange = () => {
    // Toggle between breed:asc and breed:desc
    const newSort = sortParam === 'breed:asc' ? 'breed:desc' : 'breed:asc';
    setSortParam(newSort);
    setCurrentFrom(0);
  };

  const handleNextPage = () => {
    setCurrentFrom((prev) => prev + pageSize);
  };

  const handlePrevPage = () => {
    setCurrentFrom((prev) => Math.max(0, prev - pageSize));
  };

  return (
    <Container>
      {/* Header Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
        <Typography variant="h4">Search Dogs</Typography>
        <Button variant="outlined" onClick={() => navigate('/favorites')}>
          Favorites ({favoriteIds.length})
        </Button>
      </Box>

      {/* Filter & Sort Controls */}
      <Box display="flex" gap={2} marginY={2}>
        {/* Breed Filter */}
        <FormControl variant="outlined">
          <InputLabel id="breed-label">Breed</InputLabel>
          <Select
            labelId="breed-label"
            label="Breed"
            value={selectedBreed}
            onChange={handleBreedChange}
            style={{ minWidth: 200 }}
          >
            <MenuItem value="">All Breeds</MenuItem>
            {breeds.map((breed) => (
              <MenuItem key={breed} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Toggle */}
        <Button onClick={handleSortChange}>
          Sort by Breed: {sortParam === 'breed:asc' ? 'Ascending' : 'Descending'}
        </Button>
      </Box>

      {/* Pagination Info & Controls */}
      <Typography variant="body1">
        Showing {dogs.length} of {totalResults} results
      </Typography>
      <Box display="flex" gap={2} marginY={2}>
        <Button disabled={currentFrom === 0} onClick={handlePrevPage}>
          Prev
        </Button>
        <Button disabled={currentFrom + pageSize >= totalResults} onClick={handleNextPage}>
          Next
        </Button>
      </Box>

      {/* Dog Cards */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        {dogs.map((dog) => (
          <DogCard key={dog.id} dog={dog} onFavorite={() => addFavorite(dog.id)} />
        ))}
      </Box>
    </Container>
  );
};

export default SearchPage;

import React, { useState, useEffect } from 'react';
import { Container, Box, Toolbar } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material/Select';

import NavigationBar from '../components/NavigationBar';
import FilterBar from '../components/FilterBar';
import PaginationControls from '../components/PaginationControls';
import Footer from '../components/Footer';
import DogCard from '../components/DogCard';
import { getAllBreeds, searchDogs, getDogsByIds, Dog } from '../api';
import { useFavorites } from '../context/FavoritesContext';

const SearchPage: React.FC = () => {
  const { addFavorite } = useFavorites();
  const { removeFavorite } = useFavorites();

  // Filters, sorting, and pagination states
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  
  // New sort state: sortField and sortDirection
  const [sortField, setSortField] = useState<string>('breed'); // default sort field
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // default direction
  
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFrom, setCurrentFrom] = useState(0);
  const pageSize = 28;

  useEffect(() => {
    (async () => {
      try {
        const allBreeds = await getAllBreeds();
        setBreeds(allBreeds);
      } catch (err) {
        console.error('Error fetching breeds:', err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Combine sortField and sortDirection (e.g., "name:asc")
        const sortParam = `${sortField}:${sortDirection}`;
        const queryParams = {
          breeds: selectedBreed ? [selectedBreed] : undefined,
          sort: sortParam,
          size: pageSize,
          from: currentFrom,
        };
        const searchRes = await searchDogs(queryParams);
        setTotalResults(searchRes.total);

        const dogData = await getDogsByIds(searchRes.resultIds);
        setDogs(dogData);
      } catch (err) {
        console.error('Error fetching dogs:', err);
      }
    })();
  }, [selectedBreed, sortField, sortDirection, currentFrom, pageSize]);

  // Updated: handleBreedChange now receives (event, value)
  const handleBreedChange = (event: React.SyntheticEvent, value: string | null) => {
    setSelectedBreed(value || '');
    setCurrentFrom(0);
  };

  // Handler for sort field change
  const handleSortFieldChange = (newField: string) => {
    setSortField(newField);
    setCurrentFrom(0);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentFrom(0);
  };

  // Pagination next/prev
  const handleNextPage = () => setCurrentFrom(prev => prev + pageSize);
  const handlePrevPage = () => setCurrentFrom(prev => Math.max(0, prev - pageSize));

  // NEW: Jump to a specific page
  const handlePageJump = (pageNumber: number) => {
    const newFrom = (pageNumber - 1) * pageSize;
    setCurrentFrom(newFrom);
  };

  return (
    <>
      <NavigationBar />
      <Toolbar /> {/* Spacer for fixed navbar */}
      <Container>
        <FilterBar
          selectedBreed={selectedBreed}
          handleBreedChange={handleBreedChange}
          breeds={breeds}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSortFieldChange={handleSortFieldChange}
          toggleSortDirection={toggleSortDirection}
        />

        {/* Top pagination controls */}
        {/* <PaginationControls
          currentFrom={currentFrom}
          pageSize={pageSize}
          totalResults={totalResults}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handlePageJump={handlePageJump} // pass the new callback
        /> */}

        {/* Results */}
        <Box display="flex" flexWrap="wrap" gap={6}>
          {dogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              onFavorite={() => addFavorite(dog.id)}
              onUnfavorite={() => removeFavorite(dog.id)}
            />
          ))}
        </Box>

        {/* Bottom pagination controls */}
        <PaginationControls
          currentFrom={currentFrom}
          pageSize={pageSize}
          totalResults={totalResults}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handlePageJump={handlePageJump}
        />
      </Container>
      <Footer />
    </>
  );
};

export default SearchPage;

// src/pages/SearchPage.tsx

import React, { useState, useEffect } from 'react';
import { Container, Box, Toolbar } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import NavigationBar from '../components/NavigationBar';
import FilterBar from '../components/FilterBar';
import PaginationControls from '../components/PaginationControls';
import Footer from '../components/Footer';
import DogCard from '../components/DogCard';
import { getAllBreeds, searchDogs, getDogsByIds, Dog } from '../api';
import { useFavorites } from '../context/FavoritesContext';

const SearchPage: React.FC = () => {
  const { addFavorite } = useFavorites();

  // Filters, sorting, and pagination states
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [sortParam, setSortParam] = useState('breed:asc');
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
  }, [selectedBreed, sortParam, currentFrom, pageSize]);

  // Updated: handleBreedChange now receives (event, value)
  const handleBreedChange = (event: React.SyntheticEvent, value: string | null) => {
    setSelectedBreed(value || '');
    setCurrentFrom(0);
  };

  // Toggle sorting
  const handleSortChange = () => {
    const newSort = sortParam === 'breed:asc' ? 'breed:desc' : 'breed:asc';
    setSortParam(newSort);
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
          sortParam={sortParam}
          handleSortChange={handleSortChange}
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
          {dogs.map(dog => (
            <DogCard key={dog.id} dog={dog} onFavorite={() => addFavorite(dog.id)} />
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

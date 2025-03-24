// src/pages/SearchPage.tsx

import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import DogCard from '../components/DogCard';
import PaginationControls from '../components/PaginationControls';
import LeftFilterPanel from '../components/LeftFilterPanel';
import TopSortBar from '../components/TopSortBar';
import { getAllBreeds, searchDogs, getDogsByIds, Dog } from '../api';
import { useFavorites } from '../context/FavoritesContext';

const SearchPage: React.FC = () => {
  const { addFavorite, removeFavorite } = useFavorites();

  // Breed & sorting
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [sortField, setSortField] = useState<string>('breed');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Age range
  const [ageRange, setAgeRange] = useState<number[]>([0, 20]);

  // Dogs & pagination
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFrom, setCurrentFrom] = useState(0);
  const pageSize = 28;

  // Fetch breed list
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

  // Fetch dogs whenever filters/pagination changes
  useEffect(() => {
    (async () => {
      try {
        const sortParam = `${sortField}:${sortDirection}`;
        const queryParams = {
          breeds: selectedBreed ? [selectedBreed] : undefined,
          sort: sortParam,
          ageMin: ageRange[0],
          ageMax: ageRange[1],
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
  }, [selectedBreed, sortField, sortDirection, ageRange, currentFrom, pageSize]);

  // Handlers
  const handleBreedChange = (event: React.SyntheticEvent, value: string | null) => {
    setSelectedBreed(value || '');
    setCurrentFrom(0);
  };
  const handleSortFieldChange = (field: string) => {
    setSortField(field);
    setCurrentFrom(0);
  };
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentFrom(0);
  };

  // Pagination
  const handleNextPage = () => setCurrentFrom((prev) => prev + pageSize);
  const handlePrevPage = () => setCurrentFrom((prev) => Math.max(0, prev - pageSize));
  const handlePageJump = (pageNumber: number) => {
    setCurrentFrom((pageNumber - 1) * pageSize);
  };

  // Calculate displayed range (e.g., "1–28 of 120")
  const startIndex = totalResults === 0 ? 0 : currentFrom + 1;
  const endIndex = Math.min(currentFrom + pageSize, totalResults);

  return (
    <>
      <NavigationBar />
      <Toolbar /> {/* Spacer for fixed navbar */}
      
      {/* Full-width Box so we can control spacing exactly */}
      <Box sx={{ width: '100%', mt: 0 }}>
        <Box display="flex">
          {/* LEFT FILTER PANEL */}
          <Box
            sx={{
              width: 250,
              backgroundColor: '#f8f8f8',
              borderRight: '1px solid #ccc',
              p: 2,
              flexShrink: 0,
            }}
          >
            <LeftFilterPanel
              breeds={breeds}
              selectedBreed={selectedBreed}
              handleBreedChange={handleBreedChange}
              ageRange={ageRange}
              setAgeRange={setAgeRange}
            />
          </Box>

          {/* RIGHT MAIN CONTENT */}
          <Box sx={{ flex: 1, p: 2 }}>
            {/* TOP ROW: results count on left, sort bar on right */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              {/* Left side: results count */}
              <Box>
                {startIndex}–{endIndex} of {totalResults} results
              </Box>

              {/* Right side: sort bar */}
              <TopSortBar
                sortField={sortField}
                sortDirection={sortDirection}
                handleSortFieldChange={handleSortFieldChange}
                toggleSortDirection={toggleSortDirection}
              />
            </Box>

            {/* (Optional) Top pagination controls */}
            {/* <PaginationControls
              currentFrom={currentFrom}
              pageSize={pageSize}
              totalResults={totalResults}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              handlePageJump={handlePageJump}
            /> */}

            {/* DOG CARDS with a responsive grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 4,
              }}
            >
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
            <Box mt={2}>
              <PaginationControls
                currentFrom={currentFrom}
                pageSize={pageSize}
                totalResults={totalResults}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                handlePageJump={handlePageJump}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default SearchPage;

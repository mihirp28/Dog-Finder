// src/pages/SearchPage.tsx

import React, { useState, useEffect } from 'react';
import { Container, Box, Toolbar } from '@mui/material';
import { useLocation } from 'react-router-dom';

import NavigationBar from '../components/NavigationBar';
import FilterBar from '../components/FilterBar';
import PaginationControls from '../components/PaginationControls';
import Footer from '../components/Footer';
import DogCard from '../components/DogCard';
import { getAllBreeds, searchDogs, getDogsByIds, Dog } from '../api';
import { useFavorites } from '../context/FavoritesContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage: React.FC = () => {
  const query = useQuery();
  const nameFilter = query.get('name') || ''; // The dog name typed in NavBar

  const { addFavorite, removeFavorite } = useFavorites();

  // Breed filter, sorting, pagination
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [sortParam, setSortParam] = useState('breed:asc');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFrom, setCurrentFrom] = useState(0);
  const pageSize = 28;

  // Load all breeds
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

  // Fetch dogs by breed/pagination
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

  // Client-side filter by name
  useEffect(() => {
    if (!nameFilter.trim()) {
      // No name param => show all dogs
      setFilteredDogs(dogs);
    } else {
      // Filter ignoring case, partial match
      const lowerName = nameFilter.toLowerCase();
      const filtered = dogs.filter((d) =>
        d.name.toLowerCase().includes(lowerName)
      );
      setFilteredDogs(filtered);
    }
  }, [nameFilter, dogs]);

  // Breed filter changes
  const handleBreedChange = (
    event: React.SyntheticEvent,
    value: string | null
  ) => {
    setSelectedBreed(value || '');
    setCurrentFrom(0);
  };

  // Toggle sorting
  const handleSortChange = () => {
    const newSort = sortParam === 'breed:asc' ? 'breed:desc' : 'breed:asc';
    setSortParam(newSort);
    setCurrentFrom(0);
  };

  // Pagination
  const handleNextPage = () => setCurrentFrom((prev) => prev + pageSize);
  const handlePrevPage = () => setCurrentFrom((prev) => Math.max(0, prev - pageSize));
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

        <Box display="flex" flexWrap="wrap" gap={6}>
          {filteredDogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              onFavorite={() => addFavorite(dog.id)}
              onUnfavorite={() => removeFavorite(dog.id)}
            />
          ))}
        </Box>

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

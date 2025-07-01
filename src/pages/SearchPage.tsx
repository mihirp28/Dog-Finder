import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import DogCard from '../components/DogCard';
import PaginationControls from '../components/PaginationControls';
import LeftFilterPanel from '../components/LeftFilterPanel';
import TopSortBar from '../components/TopSortBar';
import { getAllBreeds, searchDogs, getDogsByIds, Dog } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import {
  getAllCities,
  getAllCounties,
  getAllZips,
  searchLocations,
} from '../api/locationApi';

interface SearchPageProps {
  mode: 'light' | 'dark';
  onToggleDarkMode: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
  mode,
  onToggleDarkMode,
}) => {
  const { addFavorite, removeFavorite } = useFavorites();

  // Breed, sort & age
  const [allBreeds, setAllBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('breed');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    'asc'
  );
  const [ageRange, setAgeRange] = useState<number[]>([0, 20]);

  // Multi‐select location filters
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedZips, setSelectedZips] = useState<string[]>([]);
  const [locationZips, setLocationZips] = useState<string[]>([]);

  // Dropdown options (loaded once)
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableCounties, setAvailableCounties] = useState<string[]>([]);
  const [availableZips, setAvailableZips] = useState<string[]>([]);

  // Dog results + pagination
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFrom, setCurrentFrom] = useState(0);
  const pageSize = 28;

  // URL‐driven name filter
  const [searchParams, setSearchParams] = useSearchParams();
  const nameFilter = searchParams
    .get('name')
    ?.trim()
    .toLowerCase() || '';

  // 1️⃣ Load all breeds
  useEffect(() => {
    (async () => {
      try {
        setAllBreeds(await getAllBreeds());
      } catch (err) {
        console.error('Error fetching breeds:', err);
      }
    })();
  }, []);

  // 2️⃣ Seed location dropdowns once
  useEffect(() => {
    (async () => {
      try {
        const [cities, counties, zips] = await Promise.all([
          getAllCities(),
          getAllCounties(),
          getAllZips(),
        ]);
        setAvailableCities(cities);
        setAvailableCounties(counties);
        setAvailableZips(zips);
      } catch (err) {
        console.error('Error fetching location options:', err);
      }
    })();
  }, []);

  // 3️⃣ Fetch dogs when filters or page change
  useEffect(() => {
    (async () => {
      try {
        const sortParam = `${sortField}:${sortDirection}`;
        const params = {
          breeds: selectedBreeds.length ? selectedBreeds : undefined,
          zipCodes: locationZips.length ? locationZips : undefined,
          sort: sortParam,
          ageMin: ageRange[0],
          ageMax: ageRange[1],
          size: pageSize,
          from: currentFrom,
        };

        const { total, resultIds } = await searchDogs(params);
        setTotalResults(total);
        setDogs(await getDogsByIds(resultIds));
      } catch (err) {
        console.error('Error fetching dogs:', err);
      }
    })();
  }, [
    selectedBreeds,
    locationZips,
    sortField,
    sortDirection,
    ageRange,
    currentFrom,
  ]);

  // Apply location filters → union of matching ZIPs; clear name query
  const handleApplyLocationFilter = async () => {
    try {
      const stateZips =
        selectedStates.length > 0
          ? (
              await searchLocations({
                states: selectedStates,
                size: 10000,
              })
            ).zipCodes
          : [];

      const cityZips = (
        await Promise.all(
          selectedCities.map(city =>
            searchLocations({ city, size: 10000 }).then(
              r => r.zipCodes
            )
          )
        )
      ).flat();

      const countyZips = (
        await Promise.all(
          selectedCounties.map(county =>
            searchLocations({ county, size: 10000 }).then(
              r => r.zipCodes
            )
          )
        )
      ).flat();

      const allZ = Array.from(
        new Set([
          ...stateZips,
          ...cityZips,
          ...countyZips,
          ...selectedZips,
        ])
      );

      setLocationZips(allZ);
      setCurrentFrom(0);

      // remove any ?name= so filters show results again
      setSearchParams({});
    } catch (err) {
      console.error('Error applying location filter:', err);
    }
  };

  // Handlers for breed, sort, pagination
  const handleBreedChange = (vals: string[]) => {
    setSelectedBreeds(vals);
    setCurrentFrom(0);
  };
  const handleSortFieldChange = (f: string) => {
    setSortField(f);
    setCurrentFrom(0);
  };
  const toggleSortDirection = () => {
    setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
    setCurrentFrom(0);
  };
  const handleNextPage = () => setCurrentFrom(p => p + pageSize);
  const handlePrevPage = () =>
    setCurrentFrom(p => Math.max(0, p - pageSize));
  const handlePageJump = (page: number) =>
    setCurrentFrom((page - 1) * pageSize);

  // Client‐side name filter
  const filteredDogs = nameFilter
    ? dogs.filter(d =>
        d.name.toLowerCase().includes(nameFilter)
      )
    : dogs;

  // Display range respects name-filter when present
  const startIndex = nameFilter
    ? filteredDogs.length > 0
      ? 1
      : 0
    : totalResults
    ? currentFrom + 1
    : 0;
  const endIndex = nameFilter
    ? filteredDogs.length
    : Math.min(currentFrom + pageSize, totalResults);
  const displayTotal = nameFilter ? filteredDogs.length : totalResults;

  return (
    <>
      <NavigationBar
        mode={mode}
        onToggleDarkMode={onToggleDarkMode}
      />
      <Toolbar /> {/* spacer for fixed AppBar */}

      <Box sx={{ width: '100%', mt: 0 }}>
        <Box display="flex">
          {/* LEFT FILTER PANEL */}
          <Box
            sx={{
              width: 250,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              p: 2,
              flexShrink: 0,
            }}
          >
            <LeftFilterPanel
              allBreeds={allBreeds}
              selectedBreeds={selectedBreeds}
              onBreedChange={handleBreedChange}
              ageRange={ageRange}
              setAgeRange={setAgeRange}
              selectedStates={selectedStates}
              onStateChange={setSelectedStates}
              selectedCities={selectedCities}
              onCityChange={setSelectedCities}
              selectedCounties={selectedCounties}
              onCountyChange={setSelectedCounties}
              selectedZips={selectedZips}
              onZipChange={setSelectedZips}
              availableCities={availableCities}
              availableCounties={availableCounties}
              availableZips={availableZips}
              onApplyLocationFilter={handleApplyLocationFilter}
            />
          </Box>

          {/* MAIN CONTENT */}
          <Box sx={{ flex: 1, p: 2 }}>
            {/* Results & Sort */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                {startIndex}–{endIndex} of {displayTotal} results
              </Box>
              <TopSortBar
                sortField={sortField}
                sortDirection={sortDirection}
                handleSortFieldChange={handleSortFieldChange}
                toggleSortDirection={toggleSortDirection}
              />
            </Box>

            {/* Dog Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill,minmax(250px,1fr))',
                gap: 4,
              }}
            >
              {filteredDogs.map(dog => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  onFavorite={() => addFavorite(dog.id)}
                  onUnfavorite={() => removeFavorite(dog.id)}
                />
              ))}
            </Box>

            {/* Pagination */}
            <Box mt={2}>
              <PaginationControls
                currentFrom={currentFrom}
                pageSize={pageSize}
                totalResults={displayTotal}
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

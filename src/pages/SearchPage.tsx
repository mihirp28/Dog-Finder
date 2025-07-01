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
import { getAllCities, getAllCounties, getAllZips, searchLocations, searchStates } from '../api/locationApi';

const SearchPage: React.FC = () => {
  const { addFavorite, removeFavorite } = useFavorites();

  // Multiple Breed Filter
  const [allBreeds, setAllBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

  // Sorting
  const [sortField, setSortField] = useState<string>('breed');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Age range
  const [ageRange, setAgeRange] = useState<number[]>([0, 20]);

  // Location Filters
  const [city, setCity] = useState<string>('');
  const [stateVal, setStateVal] = useState<string>('');
  const [county, setCounty] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [locationZips, setLocationZips] = useState<string[]>([]);
  
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableCounties, setAvailableCounties] = useState<string[]>([]);
  const [availableZips, setAvailableZips] = useState<string[]>([]);

  // Dogs & pagination
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFrom, setCurrentFrom] = useState(0);
  const pageSize = 28;

  // Fetch breed list on mount
  useEffect(() => {
    (async () => {
      try {
        const fetchedBreeds = await getAllBreeds();
        setAllBreeds(fetchedBreeds);
      } catch (err) {
        console.error('Error fetching breeds:', err);
      }
    })();
  }, []);

  // Fetch available city, county, and ZIP options on mount
  useEffect(() => {
    (async () => {
      try {
        const cities = await getAllCities();
        const counties = await getAllCounties();
        const zips = await getAllZips();
        setAvailableCities(cities);
        setAvailableCounties(counties);
        setAvailableZips(zips);
      } catch (err) {
        console.error('Error fetching location options:', err);
      }
    })();
  }, []);

  // Fetch dogs whenever filters/pagination changes
  useEffect(() => {
    (async () => {
      try {
        const sortParam = `${sortField}:${sortDirection}`;
        const combinedZips: string[] = [...locationZips];
        if (zipCode.trim()) combinedZips.push(zipCode.trim());

        const queryParams = {
          breeds: selectedBreeds.length ? selectedBreeds : undefined,
          zipCodes: combinedZips.length ? combinedZips : undefined,
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
  }, [selectedBreeds, locationZips, zipCode, sortField, sortDirection, ageRange, currentFrom]);

  // Handlers for multiple breed selection
  const handleBreedChange = (newBreeds: string[]) => {
    setSelectedBreeds(newBreeds);
    setCurrentFrom(0);
  };

  // Handlers for location filters
  const handleCityChange = (val: string) => setCity(val);
  const handleStateChange = (val: string) => setStateVal(val);
  const handleCountyChange = (val: string) => setCounty(val);
  const handleZipChange = (val: string) => setZipCode(val);

  // When user clicks "Apply Location Filter"
  const handleApplyLocationFilter = async () => {
    try {
      const locBody: any = {};
      if (city.trim()) locBody.city = city.trim();
      if (stateVal.trim()) locBody.states = [stateVal.trim()];
      if (county.trim()) locBody.county = county.trim();

      if (Object.keys(locBody).length > 0) {
        const { zipCodes } = await searchLocations(locBody);
        setLocationZips(zipCodes);
      } else {
        setLocationZips([]);
      }
      setCurrentFrom(0);
    } catch (err) {
      console.error('Error applying location filter:', err);
    }
  };

  // Sorting Handlers
  const handleSortFieldChange = (field: string) => {
    setSortField(field);
    setCurrentFrom(0);
  };
  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentFrom(0);
  };

  // Pagination Handlers
  const handleNextPage = () => setCurrentFrom(prev => prev + pageSize);
  const handlePrevPage = () => setCurrentFrom(prev => Math.max(0, prev - pageSize));
  const handlePageJump = (pageNumber: number) => {
    setCurrentFrom((pageNumber - 1) * pageSize);
  };

  // Calculate displayed range
  const startIndex = totalResults === 0 ? 0 : currentFrom + 1;
  const endIndex = Math.min(currentFrom + pageSize, totalResults);

  return (
    <>
      <NavigationBar />
      <Toolbar />
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
              allBreeds={allBreeds}
              selectedBreeds={selectedBreeds}
              onBreedChange={handleBreedChange}
              ageRange={ageRange}
              setAgeRange={setAgeRange}
              city={city}
              onCityChange={handleCityChange}
              stateVal={stateVal}
              onStateChange={handleStateChange}
              county={county}
              onCountyChange={handleCountyChange}
              zipCode={zipCode}
              onZipChange={handleZipChange}
              onApplyLocationFilter={handleApplyLocationFilter}
              availableCities={availableCities}
              availableStates={searchStates(stateVal)}
              availableCounties={availableCounties}
              availableZips={availableZips}
            />
          </Box>

          {/* RIGHT MAIN CONTENT */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>{startIndex}–{endIndex} of {totalResults} results</Box>
              <TopSortBar
                sortField={sortField}
                sortDirection={sortDirection}
                handleSortFieldChange={handleSortFieldChange}
                toggleSortDirection={toggleSortDirection}
              />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 4,
              }}
            >
              {dogs.map(dog => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  onFavorite={() => addFavorite(dog.id)}
                  onUnfavorite={() => removeFavorite(dog.id)}
                />
              ))}
            </Box>
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

import axios from 'axios';
import { Location } from '../api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://frontend-take-home-service.fetch.com';

//Static 50 US state codes
export const US_STATES: string[] = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

/**
 * Filter the static list of states by prefix.
 */
export function searchStates(prefix: string): string[] {
  const input = prefix.trim().toUpperCase();
  // Only return matches when at least one character is entered
  if (input.length === 0) return [];
  return US_STATES.filter(s => s.startsWith(input));
}

/**
 * Fetches a list of all locations, then extracts and returns a unique array of city names.
 */
export async function getAllCities(): Promise<string[]> {
  try {
    const res = await axios.post<{ results: Location[]; total: number }>(
      `${API_BASE_URL}/locations/search`,
      { size: 10000 },
      { withCredentials: true }
    );
    const locations = res.data.results;
    const cities = Array.from(
      new Set(locations.map(loc => loc.city).filter(Boolean))
    );
    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

export async function getAllStates(): Promise<string[]> {
  try {
    const res = await axios.post<{ results: Location[]; total: number }>(
      `${API_BASE_URL}/locations/search`,
      { size: 10000 },
      { withCredentials: true }
    );
    const locations = res.data.results;
    const states = Array.from(
      new Set(locations.map(loc => loc.state).filter(Boolean))
    );
    return states;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
}
  
export async function getAllCounties(): Promise<string[]> {
  try {
    const res = await axios.post<{ results: Location[]; total: number }>(
      `${API_BASE_URL}/locations/search`,
      { size: 10000 },
      { withCredentials: true }
    );
    const locations = res.data.results;
    const counties = Array.from(
      new Set(locations.map(loc => loc.county).filter(Boolean))
    );
    return counties;
  } catch (error) {
    console.error('Error fetching counties:', error);
    return [];
  }
}
  
export async function getAllZips(): Promise<string[]> {
  try {
    const res = await axios.post<{ results: Location[]; total: number }>(
      `${API_BASE_URL}/locations/search`,
      { size: 10000 },
      { withCredentials: true }
    );
    const locations = res.data.results;
    const zips = Array.from(
      new Set(locations.map(loc => loc.zip_code).filter(Boolean))
    );
    return zips;
  } catch (error) {
    console.error('Error fetching ZIP codes:', error);
    return [];
  }
}

export interface PaginatedZipResponse {
  zipCodes: string[];
  total: number;
}

export async function searchLocations(
  params: {
    city?: string;
    states?: string[];
    county?: string;
    size?: number;
    from?: number;
  }
): Promise<PaginatedZipResponse> {
  try {
    const res = await axios.post<{ results: Location[]; total: number }>(
      `${API_BASE_URL}/locations/search`,
      params,
      { withCredentials: true }
    );
    const zipCodes = res.data.results.map(loc => loc.zip_code);
    return { zipCodes, total: res.data.total };
  } catch (error) {
    console.error('Error searching locations:', error);
    return { zipCodes: [], total: 0 };
  }
}

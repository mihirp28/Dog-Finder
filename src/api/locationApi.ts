import axios from 'axios';
import { Location } from '../api';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://frontend-take-home-service.fetch.com';

/** Static list of US states */
export const US_STATES: string[] = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

export interface PaginatedZipResponse {
  zipCodes: string[];
  total: number;
}

/**
 * General-purpose zip lookup by city, states[], or county. Pages via size/from.
 */
export async function searchLocations(params: {
  city?: string;
  states?: string[];
  county?: string;
  size?: number;
  from?: number;
}): Promise<PaginatedZipResponse> {
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

/**
 * Bulk helpers for initial load of cities/counties/zips.
 */
export async function getAllCities(): Promise<string[]> {
  try {
    const res = await axios.post<{ results: Location[]; total: number }>(
      `${API_BASE_URL}/locations/search`,
      { size: 10000 },
      { withCredentials: true }
    );
    const cities = Array.from(
      new Set(res.data.results.map(loc => loc.city).filter(Boolean))
    );
    return cities.sort();
  } catch {
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
    const counties = Array.from(
      new Set(res.data.results.map(loc => loc.county).filter(Boolean))
    );
    return counties.sort();
  } catch {
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
    const zips = Array.from(
      new Set(res.data.results.map(loc => loc.zip_code).filter(Boolean))
    );
    return zips.sort();
  } catch {
    return [];
  }
}

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://frontend-take-home-service.fetch.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // to include cookies
});

// Auth APIs
export async function login(name: string, email: string) {
  // POST /auth/login
  await apiClient.post('/auth/login', { name, email });
}

export async function logout() {
  // POST /auth/logout
  await apiClient.post('/auth/logout');
}

// Dogs APIs
export async function getAllBreeds(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>('/dogs/breeds');
  return data;
}

interface SearchQueryParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  sort?: string; // e.g., 'breed:asc'
  size?: number;
  from?: number;
}

interface SearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export async function searchDogs(params: SearchQueryParams): Promise<SearchResponse> {
  // Construct query string
  const query = new URLSearchParams();
  if (params.breeds) {
    // multiple breed params => ?breeds=Bulldog&breeds=Pug
    params.breeds.forEach((b) => query.append('breeds', b));
  }
  if (params.zipCodes) {
    params.zipCodes.forEach((z) => query.append('zipCodes', z));
  }
  if (params.ageMin !== undefined) query.set('ageMin', String(params.ageMin));
  if (params.ageMax !== undefined) query.set('ageMax', String(params.ageMax));
  if (params.sort) query.set('sort', params.sort);
  if (params.size) query.set('size', String(params.size));
  if (params.from) query.set('from', String(params.from));

  const { data } = await apiClient.get<SearchResponse>(`/dogs/search?${query.toString()}`);
  return data;
}

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export async function getDogsByIds(ids: string[]): Promise<Dog[]> {
  // POST /dogs with array of IDs
  const { data } = await apiClient.post<Dog[]>('/dogs', ids);
  return data;
}

export interface MatchResponse {
  match: string; // dog ID
}

export async function matchDogs(ids: string[]): Promise<string> {
  // POST /dogs/match
  const { data } = await apiClient.post<MatchResponse>('/dogs/match', ids);
  return data.match; // returns the matched dog's ID
}

// --- Add Location API support below ---

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export async function getLocations(zipCodes: string[]): Promise<Location[]> {
  // POST /locations with an array of ZIP codes
  const { data } = await apiClient.post<Location[]>('/locations', zipCodes);
  return data;
}
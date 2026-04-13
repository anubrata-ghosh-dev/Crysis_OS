/**
 * Emergency Resource Types
 * Used throughout the application for nearby resource queries
 */

export type ResourceType = 'hospital' | 'police' | 'fire_station';

export interface Resource {
  name: string;
  lat: number;
  lng: number;
  type: ResourceType;
  distance?: number; // Distance in kilometers
}

export interface ResourcesResponse {
  hospitals: Resource[];
  police: Resource[];
  fireStations: Resource[];
  total: number;
}

export interface ResourcesQueryParams {
  lat: number;
  lng: number;
  radius?: number; // meters (default: 5000)
  limit?: number; // per type (default: 5)
}

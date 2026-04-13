/**
 * Resources Service
 * Fetches nearby emergency resources (hospitals, police, fire stations)
 * using the Overpass API (free alternative to Google Places)
 */

import type { ResourcesResponse, ResourcesQueryParams } from '../types/resources';

/**
 * Fetch nearby emergency resources
 * @param params - Query parameters with latitude, longitude, and optional radius/limit
 * @returns Promise with hospitals, police, and fire stations
 */
export async function fetchNearbyResources(
  params: ResourcesQueryParams
): Promise<ResourcesResponse | null> {
  try {
    const { lat, lng, radius = 5000, limit = 5 } = params;

    console.log('🔍 Fetching nearby resources...');

    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`/api/resources?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.status}`);
    }

    const data: ResourcesResponse = await response.json();
    console.log('✅ Resources fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching resources:', error);
    return null;
  }
}

/**
 * Get the nearest resource of a specific type
 */
export function getNearestResource(
  resources: ResourcesResponse,
  type: 'hospitals' | 'police' | 'fireStations'
) {
  const list = resources[type];
  if (!list || list.length === 0) return null;
  return list[0]; // Already sorted by distance
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm?: number): string {
  if (!distanceKm) return 'Unknown distance';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

/**
 * OSRM (Open Source Routing Machine) Integration
 * Provides real road-based routing for evacuation routes
 * Falls back to curved polyline if API fails
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteResult {
  coordinates: LatLng[];
  distanceKm: number;
  durationSeconds: number;
  polyline: string;
  success: boolean;
  error?: string;
}

/**
 * Fetch real road-based route from OSRM API
 * Uses Open Source Routing Machine (router.project-osrm.org)
 * 
 * Public API: https://router.project-osrm.org
 * Rate limits: Fair use (not unlimited)
 * Fallback: Use curved polyline if API fails
 */
export async function fetchOSRMRoute(
  startPoint: LatLng,
  endPoint: LatLng
): Promise<RouteResult> {
  try {
    // OSRM expects coordinates as [lng, lat] (GeoJSON format)
    const coordinatesString = `${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}`;
    
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found by OSRM');
    }

    const route = data.routes[0];
    const geometry = route.geometry;

    // Convert GeoJSON coordinates [lng, lat] to [lat, lng]
    const routeCoordinates: LatLng[] = geometry.coordinates.map(
      (coord: [number, number]) => ({
        lat: coord[1],
        lng: coord[0],
      })
    );

    const distanceMeters = route.distance;
    const distanceKm = distanceMeters / 1000;
    const durationSeconds = Math.round(route.duration);

    // Route data retrieved successfully

    return {
      coordinates: routeCoordinates,
      distanceKm,
      durationSeconds,
      polyline: JSON.stringify(geometry),
      success: true,
    };
  } catch (error) {
    console.warn('⚠ OSRM API failed, using fallback curved route:', error);

    // Fallback: Return curved polyline
    return generateFallbackCurvedRoute(startPoint, endPoint);
  }
}

/**
 * Fallback: Generate curved polyline when OSRM API fails
 * Creates a realistic-looking curved path by adding sinusoidal perpendicular offsets
 * IMPORTANT: Always produces curves - never straight lines
 * Returns marked as "fallback" (success: false) with dashed line style
 */
function generateFallbackCurvedRoute(
  startPoint: LatLng,
  endPoint: LatLng,
  numWaypoints: number = 12
): RouteResult {
  const coordinates: LatLng[] = [startPoint];

  // Calculate base line distance for proportional offset
  const dLat = endPoint.lat - startPoint.lat;
  const dLng = endPoint.lng - startPoint.lng;
  const distance = Math.sqrt(dLat * dLat + dLng * dLng);

  // Perpendicular direction for consistent offset (calculate once)
  const perpLat = distance > 0 ? dLng / distance : 0;
  const perpLng = distance > 0 ? -dLat / distance : 0;

  // Generate intermediate waypoints with sinusoidal curve offset
  // CRITICAL: Always produces a curve - even if OSRM fails
  for (let i = 1; i <= numWaypoints; i++) {
    const t = i / (numWaypoints + 1); // 0 to 1
    const lat = startPoint.lat + (endPoint.lat - startPoint.lat) * t;
    const lng = startPoint.lng + (endPoint.lng - startPoint.lng) * t;

    // Sinusoidal offset ensures curve - increases then decreases
    // Max offset ~0.015 degrees (proportional to distance)
    // This guarantees the line is never straight
    const offsetAmount = distance * 0.015 * Math.sin(Math.PI * t);

    coordinates.push({
      lat: lat + perpLat * offsetAmount,
      lng: lng + perpLng * offsetAmount,
    });
  }

  coordinates.push(endPoint);

  // Calculate approximate distance (Haversine)
  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += calculateHaversineDistance(coordinates[i], coordinates[i + 1]);
  }

  // Estimate travel time at 35 km/h average (emergency response speed)
  const durationSeconds = Math.round((totalDistance / 35) * 3600);

  return {
    coordinates,
    distanceKm: totalDistance,
    durationSeconds,
    polyline: JSON.stringify({ coordinates }),
    success: false,
  };
}

/**
 * Calculate distance between two points using Haversine formula (km)
 */
function calculateHaversineDistance(start: LatLng, end: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((end.lat - start.lat) * Math.PI) / 180;
  const dLng = ((end.lng - start.lng) * Math.PI) / 180;
  const lat1rad = (start.lat * Math.PI) / 180;
  const lat2rad = (end.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1rad) *
      Math.cos(lat2rad) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

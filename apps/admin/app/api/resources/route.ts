import { NextRequest, NextResponse } from 'next/server';

interface Resource {
  name: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'police' | 'fire_station';
  distance?: number;
}

interface OverpassNode {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    [key: string]: any;
  };
}

interface OverpassResponse {
  elements: OverpassNode[];
}

/**
 * Fetch nearby emergency resources using Overpass API (free alternative to Google Places)
 * 
 * Query parameters:
 * - lat: latitude (required)
 * - lng: longitude (required)
 * - radius: search radius in meters (default: 5000)
 * - limit: max results per type (default: 5)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = parseInt(searchParams.get('radius') || '5000');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Validate inputs
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude required' },
        { status: 400 }
      );
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude' },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching resources near ${latNum}, ${lngNum}`);

    // Fetch resources in parallel
    const [hospitals, police, fireStations] = await Promise.all([
      fetchResourcesByType('hospital', latNum, lngNum, radius, limit),
      fetchResourcesByType('police', latNum, lngNum, radius, limit),
      fetchResourcesByType('fire_station', latNum, lngNum, radius, limit),
    ]);

    const allResources = [...hospitals, ...police, ...fireStations];
    
    console.log(`✅ Found ${allResources.length} resources`);

    return NextResponse.json({
      hospitals,
      police,
      fireStations,
      total: allResources.length,
    });
  } catch (error) {
    console.error('❌ Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Fetch specific resource type from Overpass API
 */
async function fetchResourcesByType(
  type: 'hospital' | 'police' | 'fire_station',
  lat: number,
  lng: number,
  radius: number,
  limit: number
): Promise<Resource[]> {
  try {
    // Map our type to Overpass amenity tag
    const amenityMap = {
      hospital: 'hospital',
      police: 'police',
      fire_station: 'fire_station',
    };

    const amenity = amenityMap[type];
    const query = `[out:json];node["amenity"="${amenity}"](around:${radius},${lat},${lng});out;`;

    console.log(`📡 Querying Overpass API for ${type}...`);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data: OverpassResponse = await response.json();

    if (!data.elements || data.elements.length === 0) {
      console.log(`⚠️ No ${type} found`);
      return [];
    }

    // Convert to our format and sort by distance
    const resources: Resource[] = data.elements
      .map((node) => {
        const distance = calculateDistance(lat, lng, node.lat, node.lon);
        return {
          name: node.tags.name || `Unknown ${typeToLabel(type)}`,
          lat: node.lat,
          lng: node.lon,
          type,
          distance,
        };
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, limit);

    console.log(`✅ Found ${resources.length} ${type}`);
    return resources;
  } catch (error) {
    console.error(`❌ Error fetching ${type}:`, error);
    return [];
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radius of earth in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Convert resource type to human-readable label
 */
function typeToLabel(type: string): string {
  const labels: Record<string, string> = {
    hospital: 'Hospital',
    police: 'Police Station',
    fire_station: 'Fire Station',
  };
  return labels[type] || 'Resource';
}

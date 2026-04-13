# Free Emergency Resources API

## Overview

Integrated a **free alternative to Google Places API** using **OpenStreetMap's Overpass API**. The system fetches nearby emergency resources (hospitals, police stations, fire stations) based on incident location—**no API key required**.

---

## How It Works

### 1. **API Routes Created**
```
/apps/citizen/app/api/resources/route.ts
/apps/admin/app/api/resources/route.ts
```

Both routes implement the same functionality:
- Accept query parameters: `lat`, `lng`, `radius` (default: 5km), `limit` (default: 5 per type)
- Query Overpass API for hospitals, police, fire stations
- Calculate distances using Haversine formula
- Return sorted results (nearest first)
- Handle errors gracefully

### 2. **Query Format**

For hospitals:
```
[out:json];
node["amenity"="hospital"](around:5000, LAT, LNG);
out;
```

For police:
```
[out:json];
node["amenity"="police"](around:5000, LAT, LNG);
out;
```

For fire stations:
```
[out:json];
node["amenity"="fire_station"](around:5000, LAT, LNG);
out;
```

### 3. **Response Format**
```json
{
  "hospitals": [
    {
      "name": "Apollo Hospital",
      "lat": 28.5244,
      "lng": 77.1855,
      "type": "hospital",
      "distance": 2.3
    }
  ],
  "police": [...],
  "fireStations": [...],
  "total": 15
}
```

---

## Files Created

### Shared Types
**`/shared/types/resources.ts`**
```typescript
export type ResourceType = 'hospital' | 'police' | 'fire_station';

export interface Resource {
  name: string;
  lat: number;
  lng: number;
  type: ResourceType;
  distance?: number; // km
}

export interface ResourcesResponse {
  hospitals: Resource[];
  police: Resource[];
  fireStations: Resource[];
  total: number;
}
```

### Shared Service
**`/shared/utils/resourcesService.ts`**
- `fetchNearbyResources(params)` - Fetch resources from the API
- `getNearestResource(resources, type)` - Get nearest of a specific type
- `formatDistance(distanceKm)` - Format distance for display (km or m)

### Re-exports
**`/apps/citizen/lib/resources.ts`** and **`/apps/admin/lib/resources.ts`**
```typescript
export * from '@shared/types/resources';
export * from '@shared/utils/resourcesService';
```

### React Component
**`/apps/citizen/components/NearbyResources.tsx`**

Displays:
- Nearest hospital (with ❤️ icon)
- Nearest police station (with 🛡️ icon)
- Nearest fire station (with 🔥 icon)
- Distance from incident location
- Loading state while fetching
- Error handling with fallback

### Integration
**Updated `/apps/citizen/app/page.tsx`**
- Added `<NearbyResources />` component to incident report form
- Shows nearby resources after location is confirmed
- Displays real-world emergency services near the incident

---

## Features

✅ **Free to use** - No API key needed  
✅ **Real-world data** - OpenStreetMap community-sourced  
✅ **Dynamic** - Fetches based on actual incident location  
✅ **Fast** - Parallel queries for 3 resource types  
✅ **Accurate** - Haversine formula distance calculation  
✅ **Fallbacks** - "Unknown Hospital" if name missing  
✅ **Responsive** - Works on mobile and desktop  
✅ **TypeScript** - Full type safety  

---

## Usage Example

### Frontend
```typescript
import { fetchNearbyResources, formatDistance } from '@/lib/resources';

const resources = await fetchNearbyResources({
  lat: 28.6139,
  lng: 77.2090,
  radius: 5000, // 5km
  limit: 5,
});

if (resources) {
  resources.hospitals[0]; // Nearest hospital
  resources.police[0];    // Nearest police
  resources.fireStations[0]; // Nearest fire station
  
  formatDistance(2.3); // "2.3km"
}
```

### API Call
```bash
GET /api/resources?lat=28.6139&lng=77.2090&radius=5000&limit=5
```

---

## Data Source

**Overpass API**
- Endpoint: `https://overpass-api.de/api/interpreter`
- Data: OpenStreetMap
- License: ODbL (Free & Open)
- No rate limits for reasonable use

---

## Limitations & Alternatives

**Current Limitations:**
- Depends on OpenStreetMap data quality (varies by region)
- May have 1-5 second response time
- Limited to 3 resource types (hospital, police, fire station)

**If higher coverage is needed:**
- Add more amenity types (clinic, pharmacy, etc.)
- Combine with another free API (Nominatim geocoding)
- Cache results for common locations

---

## Testing

In the citizen app:
1. Go to http://localhost:3001
2. Allow location access
3. See nearby resources displayed below location confirmation
4. Select incident type and submit
5. Resources will be available for responders to use

---

## Future Enhancements

- [ ] Show resources on map with markers
- [ ] Filter by distance/type
- [ ] Real-time availability status
- [ ] Integration with responder routing
- [ ] Caching for performance
- [ ] Additional resource types
- [ ] Admin dashboard showing nearby resources for each incident

---

**Created:** April 13, 2026  
**Status:** ✅ Production Ready

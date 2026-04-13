import {
  collection,
  getDocs,
  query,
  where,
  GeoPoint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Resource Service - Hospital, shelter, and aid center information
 */

const COLLECTION_NAME = 'resources';

export interface Resource {
  id: string;
  name: string;
  type: 'hospital' | 'shelter' | 'water' | 'food' | 'aid_center' | 'police' | 'fire';
  address: string;
  lat: number;
  lng: number;
  availability: number; // Percentage 0-100
  contact?: string;
  timestamp?: string;
}

export const resourceService = {
  /**
   * Get all resources of a specific type
   */
  getResourcesByType: async (resourceType: Resource['type']): Promise<Resource[]> => {
    if (!db) return [];

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('type', '==', resourceType)
      );

      const snapshot = await getDocs(q);
      const resources: Resource[] = [];

      snapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data(),
        } as Resource);
      });

      return resources;
    } catch (error) {
      console.error(`Error fetching ${resourceType} resources:`, error);
      return [];
    }
  },

  /**
   * Get all resources (hospitals, shelters, etc.)
   */
  getAllResources: async (): Promise<Resource[]> => {
    if (!db) return [];

    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const resources: Resource[] = [];

      snapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data(),
        } as Resource);
      });

      return resources;
    } catch (error) {
      console.error('Error fetching all resources:', error);
      return [];
    }
  },

  /**
   * Get nearby resources by type and location
   * Note: For production, use Firestore geoqueries with geofire-common
   */
  getNearbyResources: async (
    lat: number,
    lng: number,
    radiusKm: number = 10,
    resourceType?: Resource['type']
  ): Promise<Resource[]> => {
    if (!db) return [];

    try {
      let q;
      if (resourceType) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('type', '==', resourceType)
        );
      } else {
        q = query(collection(db, COLLECTION_NAME));
      }

      const snapshot = await getDocs(q);
      const resources: Resource[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as any;
        const distance = calculateDistance(lat, lng, data.lat, data.lng);

        if (distance <= radiusKm) {
          resources.push({
            id: doc.id,
            ...data,
          } as Resource);
        }
      });

      // Sort by distance
      resources.sort((a, b) => {
        const distA = calculateDistance(lat, lng, a.lat, a.lng);
        const distB = calculateDistance(lat, lng, b.lat, b.lng);
        return distA - distB;
      });

      return resources;
    } catch (error) {
      console.error('Error fetching nearby resources:', error);
      return [];
    }
  },

  /**
   * Get available resources (availability > 0)
   */
  getAvailableResources: async (resourceType?: Resource['type']): Promise<Resource[]> => {
    if (!db) return [];

    try {
      let q;
      if (resourceType) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('type', '==', resourceType),
          where('availability', '>', 0)
        );
      } else {
        q = query(collection(db, COLLECTION_NAME), where('availability', '>', 0));
      }

      const snapshot = await getDocs(q);
      const resources: Resource[] = [];

      snapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data(),
        } as Resource);
      });

      return resources;
    } catch (error) {
      console.error('Error fetching available resources:', error);
      return [];
    }
  },

  /**
   * Get hospitals specifically (high-priority resource type)
   */
  getHospitals: async (): Promise<Resource[]> => {
    return resourceService.getResourcesByType('hospital');
  },

  /**
   * Get shelters specifically
   */
  getShelters: async (): Promise<Resource[]> => {
    return resourceService.getResourcesByType('shelter');
  },
};

/**
 * Helper: Calculate distance between two lat/lng points (Haversine formula)
 * Returns distance in kilometers
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

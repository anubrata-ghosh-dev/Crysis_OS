import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Disaster } from '../types/mockData';
import { INITIAL_DISASTERS } from '../types/mockData';

/**
 * Incident Service - Read-only Firestore operations for admin dashboard
 * 
 * ⚠️ ADMIN DASHBOARD ONLY - READ-ONLY OPERATIONS
 * 
 * This service is for reading incident data from Firestore.
 * Citizen incident reporting is handled in a separate application.
 * 
 * DO NOT use addIncident(), updateIncident(), or delete operations.
 * DO NOT add write functionality to this service for frontend usage.
 * 
 * Keep all database logic centralized here, NOT in components
 */

const COLLECTION_NAME = 'incidents';

export const incidentService = {
  /**
   * Real-time listener for incidents
   * Automatically updates UI when new incidents are added/updated
   */
  getIncidentsRealtime: (callback: (incidents: Disaster[]) => void) => {
    if (!db) {
      console.warn('🔴 Firestore not initialized, using mock data fallback');
      // Call callback immediately with mock data so UI doesn't get stuck in loading state
      callback(INITIAL_DISASTERS);
      return () => {};
    }

    try {
      console.log('🟢 Firestore available, setting up real-time listener on incidents collection...');
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('📡 Firestore snapshot received. Docs count:', snapshot.docs.length);
          const incidents: Disaster[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            incidents.push({
              id: doc.id,
              ...data,
            } as Disaster);
            console.log('📌 Incident:', doc.id, data);
          });
          console.log('✅ Total incidents from Firestore:', incidents.length);
          callback(incidents);
        },
        (error) => {
          console.error('🔴 Firestore listener error:', error);
          // Keep existing data on error
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('🔴 Error setting up real-time listener:', error);
      // Fallback to mock data on error
      callback(INITIAL_DISASTERS);
      return () => {};
    }
  },

  /**
   * Fetch all incidents (one-time fetch)
   */
  getIncidents: async (): Promise<Disaster[]> => {
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      const incidents: Disaster[] = [];

      snapshot.forEach((doc) => {
        incidents.push({
          id: doc.id,
          ...doc.data(),
        } as Disaster);
      });

      return incidents;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return [];
    }
  },

  /**
   * Get single incident by ID
   */
  getIncidentById: async (incidentId: string): Promise<Disaster | null> => {
    if (!db) return null;

    try {
      const docRef = doc(db, COLLECTION_NAME, incidentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Disaster;
      }
      return null;
    } catch (error) {
      console.error('Error fetching incident:', error);
      return null;
    }
  },

  /**
   * ⚠️ DEPRECATED - NOT FOR USE IN ADMIN DASHBOARD
   * 
   * Add new incident (from user report or system detection)
   * Falls back to localStorage if Firestore is unavailable or blocked
   * 
   * This function is ONLY for backend/CI systems.
   * Citizen reporting is in a separate application.
   */
  addIncident: async (incidentData: Omit<Disaster, 'id'>) => {
    const incidentWithTimestamp = {
      ...incidentData,
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Try Firestore first
    if (db) {
      try {
        console.log('🔥 Attempting to save to Firestore...');
        const docRef = await addDoc(collection(db, COLLECTION_NAME), incidentWithTimestamp);
        console.log('✅ Successfully saved to Firestore:', docRef.id);

        return {
          id: docRef.id,
          ...incidentData,
        };
      } catch (error) {
        console.error('⚠️ Firestore write failed, falling back to localStorage:', error);
        // Fall through to localStorage fallback
      }
    } else {
      console.log('⚠️ Firebase not initialized, using localStorage');
    }

    // Fallback to localStorage
    try {
      const id = 'incident_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const incidentWithId = {
        id,
        ...incidentWithTimestamp,
      };

      // Get existing incidents from localStorage
      const existingData = localStorage.getItem('incidents_local');
      const incidents = existingData ? JSON.parse(existingData) : [];

      // Add new incident
      incidents.unshift(incidentWithId);
      localStorage.setItem('incidents_local', JSON.stringify(incidents));

      console.log('💾 ✅ Incident saved to localStorage:', id);
      console.log('📝 Note: Data is stored locally. Connect to Firebase to sync with admin dashboard.');
      
      return incidentWithId;
    } catch (error) {
      console.error('💥 Error saving incident to localStorage:', error);
      throw new Error('Failed to save incident. Please check browser storage permissions.');
    }
  },

  /**
   * ⚠️ DEPRECATED - NOT FOR USE IN ADMIN DASHBOARD
   * Update incident details
   */
  updateIncident: async (
    incidentId: string,
    updateData: Partial<Disaster>
  ) => {
    if (!db) {
      console.error('Firestore not initialized');
      return null;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, incidentId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date(),
      });

      return { id: incidentId, ...updateData };
    } catch (error) {
      console.error('Error updating incident:', error);
      throw error;
    }
  },

  /**
   * ⚠️ DEPRECATED - NOT FOR USE IN ADMIN DASHBOARD
   * Increment incident's report count
   */
  incrementReportCount: async (incidentId: string) => {
    if (!db) return null;

    try {
      const docRef = doc(db, COLLECTION_NAME, incidentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCount = docSnap.data().reports_count || 0;
        await updateDoc(docRef, {
          reports_count: currentCount + 1,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error incrementing report count:', error);
    }
  },

  /**
   * Update incident escalation level
   */
  updateEscalation: async (incidentId: string, escalation: number) => {
    if (!db) return null;

    try {
      const docRef = doc(db, COLLECTION_NAME, incidentId);
      await updateDoc(docRef, {
        escalation: Math.min(escalation, 100),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating escalation:', error);
    }
  },

  /**
   * Mark incident as resolved
   */
  resolveIncident: async (incidentId: string) => {
    if (!db) return null;

    try {
      const docRef = doc(db, COLLECTION_NAME, incidentId);
      await updateDoc(docRef, {
        status: 'resolved',
        resolvedAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error resolving incident:', error);
    }
  },

  /**
   * ⚠️ DEPRECATED - NOT FOR USE IN ADMIN DASHBOARD
   * Delete incident (admin only)
   */
  deleteIncident: async (incidentId: string) => {
    if (!db) {
      console.error('Firestore not initialized');
      return;
    }

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, incidentId));
    } catch (error) {
      console.error('Error deleting incident:', error);
      throw error;
    }
  },

  /**
   * Get incidents by severity
   */
  getIncidentsBySeverity: async (severity: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (!db) return [];

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('severity', '==', severity),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const incidents: Disaster[] = [];

      snapshot.forEach((doc) => {
        incidents.push({
          id: doc.id,
          ...doc.data(),
        } as Disaster);
      });

      return incidents;
    } catch (error) {
      console.error('Error fetching incidents by severity:', error);
      return [];
    }
  },
};

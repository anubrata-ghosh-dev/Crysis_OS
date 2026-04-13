import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * SOS Report Service - Handle citizen emergency reports
 */

const COLLECTION_NAME = 'sos_reports';

export interface SOSReport {
  id: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
  userLocation: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  timestamp: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const sosReportService = {
  /**
   * Real-time listener for SOS reports
   */
  getReportsRealtime: (callback: (reports: SOSReport[]) => void) => {
    if (!db) {
      console.warn('Firestore not initialized');
      return () => {};
    }

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', 'in', ['pending', 'acknowledged']),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const reports: SOSReport[] = [];
          snapshot.forEach((doc) => {
            reports.push({
              id: doc.id,
              ...doc.data(),
            } as SOSReport);
          });
          callback(reports);
        },
        (error) => {
          console.error('Error listening to reports:', error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time listener for reports:', error);
      return () => {};
    }
  },

  /**
   * Submit new SOS report
   */
  submitReport: async (reportData: Omit<SOSReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!db) {
      console.error('Firestore not initialized');
      return null;
    }

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...reportData,
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        id: docRef.id,
        ...reportData,
      };
    } catch (error) {
      console.error('Error submitting SOS report:', error);
      throw error;
    }
  },

  /**
   * Fetch all pending reports
   */
  getPendingReports: async (): Promise<SOSReport[]> => {
    if (!db) return [];

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', 'in', ['pending', 'acknowledged']),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const reports: SOSReport[] = [];

      snapshot.forEach((doc) => {
        reports.push({
          id: doc.id,
          ...doc.data(),
        } as SOSReport);
      });

      return reports;
    } catch (error) {
      console.error('Error fetching pending reports:', error);
      return [];
    }
  },

  /**
   * Update report status
   */
  updateReportStatus: async (reportId: string, status: SOSReport['status']) => {
    if (!db) return null;

    try {
      const docRef = doc(db, COLLECTION_NAME, reportId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  },
};

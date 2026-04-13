/**
 * Shared Firebase Configuration
 * 
 * Used by both admin and citizen apps.
 * Do NOT initialize Firebase in individual apps.
 * Always import from this file.
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Check if Firebase credentials are configured
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.authDomain;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('✓ Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Firebase will be unavailable - system will fallback to localStorage
  }
} else {
  console.log('⚠️ Firebase credentials not configured. Using localStorage fallback.');
  console.log('📝 To enable Firebase, set these environment variables:');
  console.log('   NEXT_PUBLIC_FIREBASE_API_KEY');
  console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  console.log('   NEXT_PUBLIC_FIREBASE_APP_ID');
}

export { app, db };

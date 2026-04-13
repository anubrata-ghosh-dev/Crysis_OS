import admin from 'firebase-admin';

let initialized = false;

export const initializeFirebase = () => {
  if (initialized) return;

  try {
    // Initialize Firebase Admin SDK
    // In production, use environment variables for credentials
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : null;

    if (serviceAccountKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    } else {
      // For development without credentials
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }

    initialized = true;
    console.log('✓ Firebase initialized');
  } catch (error) {
    console.error('Error initializing Firebase:', error.message);
  }
};

export const getFirestore = () => {
  return admin.firestore();
};

export const getAuth = () => {
  return admin.auth();
};

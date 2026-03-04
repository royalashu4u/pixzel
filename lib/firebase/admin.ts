import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin SDK Initialization
 * 
 * Uses standard, professional initialization without patchwork.
 * Relies on proper environment variables natively configured.
 */
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]; // Already initialized
  }

  try {
    // Determine credentials professionally
    // First tries GOOGLE_APPLICATION_CREDENTIALS or Firebase Config natively
    let credentialToUse = applicationDefault();

    // In a scenario where the user specifically supplies FIREBASE_PRIVATE_KEY via ENV
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      credentialToUse = cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    }
    
    return initializeApp({
      credential: credentialToUse,
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
    return null;
  }
}

const app = initializeFirebaseAdmin();

export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;

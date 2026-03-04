
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Firebase Admin SDK Initialization
 * 
 * Reads the service account JSON file directly from the project root.
 * This is the most reliable approach for Next.js because:
 * - GOOGLE_APPLICATION_CREDENTIALS doesn't work with Next.js bundler
 * - Parsing private keys from env vars is fragile (newline escaping issues)
 * 
 * @see https://firebase.google.com/docs/admin/setup
 */
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return; // Already initialized
  }

  try {
    // Read service account JSON directly from project root
    const serviceAccountPath = join(process.cwd(), 'pixzel-6f88a-firebase-adminsdk-fbsvc-d768ce380f.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

initializeFirebaseAdmin();

export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;

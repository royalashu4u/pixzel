import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // CSRF Protection: Verify request origins
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // In production, ensure the origin matches the expected domain
    if (process.env.NODE_ENV === 'production') {
      if (!origin || !origin.includes(host || '')) {
        return NextResponse.json({ error: 'Unauthorized request origin' }, { status: 403 });
      }
    }

    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Verify token & Initialize user document securely
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;
    
    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();
    
    if (!userSnap.exists) {
      // Securely initialize new user with 10 credits server-side
      await userRef.set({
        email: email || '',
        credits: 10,
        createdAt: new Date().toISOString(),
      });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

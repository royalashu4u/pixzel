import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, importX509, decodeProtectedHeader } from 'jose'

async function verifyFirebaseSessionCookie(sessionCookie: string) {
  try {
    const keysRes = await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys', {
      next: { revalidate: 3600 } // Cache the certs for 1 hour
    })
    const keys = await keysRes.json()
    
    const header = decodeProtectedHeader(sessionCookie)
    const kid = header.kid

    if (!kid || !keys[kid]) {
      return null
    }

    const cert = keys[kid]
    const publicKey = await importX509(cert, 'RS256')
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    const result = await jwtVerify(sessionCookie, publicKey, {
      issuer: `https://session.firebase.google.com/${projectId}`,
      audience: projectId,
    })
    
    return result.payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const path = request.nextUrl.pathname

  if (path.startsWith('/studio') || path.startsWith('/dashboard') || path.startsWith('/api/protected')) {
    if (!session?.value) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Cryptographically verify session token to prevent tampering
    const payload = await verifyFirebaseSessionCookie(session.value)
    
    if (!payload) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid Session' }, { status: 401 })
      }
      // Delete the forged cookie on redirect
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/studio/:path*',
    '/dashboard/:path*',
    '/api/protected/:path*'
  ],
}

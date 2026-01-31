import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const path = request.nextUrl.pathname

  // Public paths
  const publicPaths = ['/login', '/signup', '/', '/api/auth']
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }

  // TODO: Verify session with Firebase Admin once implemented
  // For now, we rely on client-side auth state which will redirect if not logged in
  // Server-side middleware check:
  
  /*
  const token = request.cookies.get('firebase-token')
  if (!token && path.startsWith('/studio')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  */

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/studio/:path*',
    '/dashboard/:path*',
    '/api/protected/:path*'
  ],
}

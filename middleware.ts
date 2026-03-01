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

  // Server-side middleware check
  if (!session && (path.startsWith('/studio') || path.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url))
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

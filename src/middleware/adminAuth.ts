// File: middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  accessLevel: string;
  exp?: number;
}

export async function middleware(request: NextRequest) {
  // Define public paths that don't need authentication
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/public',
    '/_next',
    '/favicon.ico',
    '/static'
  ];

  // Skip middleware for public paths
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Store the original URL to redirect back after login
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    );

    // Type assert the payload
    const userPayload = payload as unknown as JWTPayload;

    // Check token expiration
    if (userPayload.exp && Date.now() >= userPayload.exp * 1000) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // Check admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!userPayload.isAdmin && !userPayload.isSuperAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Add user context to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userPayload.userId);
    requestHeaders.set('x-user-email', userPayload.email);
    requestHeaders.set('x-user-role', userPayload.accessLevel);

    // Add security headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    return response;

  } catch (error) {
    console.error('Token verification error:', error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
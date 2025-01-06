import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define the payload interface
interface JWTPayload {
  userId: string;
  email: string;
  accessLevel: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  exp?: number;
}

export async function middleware(request: NextRequest) {
  // Define public paths that don't need authentication
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/api/public',
    '/_next',
    '/favicon.ico',
    '/static'
  ];

  // Check if the current path is public
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // If no token and trying to access protected route
  if (!token) {
    // Store the original URL to redirect back after login
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  try {
    // Verify JWT token with type assertion
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

    // Special handling for admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Check if user has admin privileges
      if (!userPayload.isAdmin && !userPayload.isSuperAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Add user information to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userPayload.userId);
    requestHeaders.set('x-user-email', userPayload.email);
    requestHeaders.set('x-user-role', userPayload.accessLevel);

    // Rate limiting headers (optional)
    requestHeaders.set('x-rate-limit', '100');
    requestHeaders.set('x-rate-limit-duration', '3600');

    // Security headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Match API routes
    '/api/:path*',
    // Match admin routes
    '/admin/:path*'
  ]
};
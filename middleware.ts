import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuthMiddleware } from '@/middleware/adminAuth';

export function middleware(request: NextRequest) {
  // Apply admin auth to admin routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    return adminAuthMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/admin/:path*',
};
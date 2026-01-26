import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes pattern
const protectedRoutes = ['/dashboard', '/staff', '/services', '/appointments', '/queue'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('ac_T')?.value;
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if the route is an auth route (login/register)
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname === '/');

  // If user is not authenticated and tries to access a protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/', request.url);
    // loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and tries to access auth routes (login/register/home)
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};

// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/success',
  '/api/generate',
  '/api/create-checkout-session',
  '/api/stripe-webhook',
]);

export default clerkMiddleware(async (auth, req) => {
  // Don’t run auth check for public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth(); // Only runs for protected routes
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next|favicon.ico).*)'],
};

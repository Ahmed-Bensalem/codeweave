// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/', // ✅ Home page must be public
  '/success',
  '/api/generate',
  '/api/create-checkout-session',
  '/api/stripe-webhook',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next(); // ✅ Allow public pages
  }

  const { userId } = await auth(); // 👈 No `protect`, just destructure

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next|favicon.ico).*)'], // ✅ Match everything except static files
};

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

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  return auth().then(({ userId }) => {
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.next();
  });
});

export const config = {
  matcher: ['/((?!.*\\..*|_next|favicon.ico).*)'],
};

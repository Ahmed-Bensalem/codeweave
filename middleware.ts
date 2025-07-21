// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// List your public routes here
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/generate',
  '/api/create-checkout-session',
  '/api/stripe-webhook',
  '/success',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next|favicon.ico).*)'],
};

// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/', // Home
  '/success', // After payment
  '/api/generate',
  '/api/create-checkout-session',
  '/api/stripe-webhook',
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;

  auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next|favicon.ico).*)'],
};

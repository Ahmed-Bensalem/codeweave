// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    '/',
    '/success',
    '/api/generate',
    '/api/create-checkout-session',
    '/api/stripe-webhook',
  ],
});

export const config = {
  matcher: [
    '/((?!_next/image|_next/static|favicon.ico).*)',
  ],
};

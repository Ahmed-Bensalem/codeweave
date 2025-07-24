import {
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/init",
  "/dashboard(.*)",
  "/pricing",
  "/sign-in",
  "/sign-up",
  "/success",
  "/api/generate",
  "/api/create-checkout-session",
  "/api/stripe-webhook",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Get userId and sessionClaims first
  const { userId, sessionClaims } = await auth();

  // Extract triesRemaining safely from sessionClaims.publicMetadata
  let triesRemaining = 0;
  const publicMetadata = sessionClaims?.publicMetadata;
  if (
    publicMetadata &&
    typeof publicMetadata === "object" &&
    "triesRemaining" in publicMetadata &&
    typeof (publicMetadata as any).triesRemaining === "number"
  ) {
    triesRemaining = (publicMetadata as { triesRemaining: number }).triesRemaining;
  }

  // If anonymous user (no userId)
  if (!userId) {
    if (triesRemaining > 0) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Signed-in user: fetch full user object
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Get triesRemaining from full user metadata for signed-in users
  triesRemaining = Number(user.publicMetadata?.triesRemaining ?? 0);
  const isPro = Boolean(user.publicMetadata?.isPro);

  // Allow if Pro or signed-in
  if (isPro || user.primaryEmailAddressId) {
    return NextResponse.next();
  }

  // Allow anonymous users with tries left
  if (triesRemaining > 0) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/sign-in", req.url));
});

export const config = {
  matcher: ["/((?!.*\\..*|_next|favicon.ico).*)"],
};

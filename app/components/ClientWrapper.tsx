'use client';

import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  );
}

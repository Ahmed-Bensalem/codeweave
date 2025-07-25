'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.reload) {
      user.reload(); // ✅ force Clerk to reload metadata
    }
  }, [user]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-4">✅ Payment Successful!</h1>
      <p className="text-lg mb-6">
        You’ve been upgraded your plan. Enjoy unlimited access to CodeWeave Copilot!
      </p>
      <button
        className="text-indigo-600 hover:underline"
        onClick={() => router.push('/dashboard')}
      >
        Go to Dashboard
      </button>
    </div>
  );
}

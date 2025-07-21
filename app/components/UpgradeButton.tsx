'use client';

import { useState } from 'react';

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url; // ✅ Redirect to Stripe Checkout
      } else {
        setError(data.error || 'Upgrade failed.');
      }
    } catch (err) {
      console.error('❌ Error upgrading:', err);
      setError('Unexpected error occurred.');
    }

    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
      >
        {loading ? 'Redirecting...' : 'Upgrade to Pro'}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}

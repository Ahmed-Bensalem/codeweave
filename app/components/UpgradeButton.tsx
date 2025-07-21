// components/UpgradeButton.tsx
'use client';

export default function UpgradeButton() {
  const handleUpgrade = async () => {
    console.log('🔁 Upgrade button clicked');

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });

    const data = await res.json();

    if (data.url) {
      console.log('✅ Redirecting to Stripe:', data.url);
      window.location.href = data.url;
    } else {
      console.error('❌ Checkout failed:', data.error);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Upgrade to Pro
    </button>
  );
}

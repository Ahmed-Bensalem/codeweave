"use client";

import { useUser } from "@clerk/nextjs";
import { FaRocket, FaCheck } from "react-icons/fa";
import useLimitCheck from "./LimitChecker";
import { useState } from "react";
import toast from "react-hot-toast";
import CancelModal from "./CancelModal";

type PricingCardProps = {
  icon?: React.ReactNode;
  title: string;
  price: string;
  description: React.ReactNode;
  buttonText: string;
  buttonLink?: string;
  features: string[];
  note?: string;
  passedPlan?: string;
};

export default function PricingCard({
  icon,
  title,
  price,
  description,
  buttonText,
  buttonLink,
  features,
  note,
  passedPlan,
}: PricingCardProps) {
  const { user } = useUser();
  const { triesLeft, limitReached } = useLimitCheck();
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    const currentPlan = user.unsafeMetadata?.plan as string;
    if (currentPlan === passedPlan) {
      toast.error(`You are already on the ${passedPlan} plan`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passedPlan }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Upgrade failed.");
      }
    } catch (err) {
      console.error("Upgrade request failed:", err);
      toast.error("Unexpected error occurred.");
    }

    setLoading(false);
  };

  const confirmCancel = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Subscription canceled successfully!");
        window.location.reload();
      } else {
        toast.error(data.error || "Cancellation failed.");
      }
    } catch (err) {
      console.error("Cancellation request failed:", err);
      toast.error("Unexpected error occurred.");
    }

    setLoading(false);
  };

  const plan = (user?.unsafeMetadata?.plan as string) || "free";

  return (
    <>
      {/* Pricing Card */}
      <div className="bg-[radial-gradient(50%_50%_at_50%_100%,rgba(78,141,184,0.3)_0%,rgba(0,0,0,0)_100%)] bg-white border border-black rounded-lg text-black p-6 w-full max-w-sm shadow-xl space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-black">
            {icon || <FaRocket className="w-5 h-5 text-blue-500" />}
            <span>{title}</span>
          </div>
          <h2 className="text-black text-4xl font-medium -tracking-wide">
            {price.includes("£") ? (
              <>
                {price.split("/")[0]}
                <span className="text-black/75 text-xl font-normal">
                  /{price.split("/")[1]}
                </span>
              </>
            ) : (
              <span className="text-black font-semibold text-[25px]">
                {price}
              </span>
            )}
          </h2>
        </div>

        <div className="space-y-2 text-black text-sm">
          <p className="font-medium">{description}</p>
        </div>

        {title === "Enterprise" ? (
          <a
            href={buttonLink}
            className="block w-full text-center bg-blue-100 text-blue-500 font-semibold py-3 rounded-md hover:bg-blue-200 transition"
          >
            {buttonText}
          </a>
        ) : plan === "free" && passedPlan === "free" ? (
          <button
            disabled
            className="block w-full text-center bg-gray-200 text-gray-500 font-semibold py-3 rounded-md cursor-not-allowed"
          >
            Current Plan
          </button>
        ) : plan === "free" && passedPlan === "free" ? (
          <button
            disabled
            className="block w-full text-center bg-gray-200 text-gray-500 font-semibold py-3 rounded-md cursor-not-allowed"
          >
            Current Plan
          </button>
        ) : plan === passedPlan ? (
          <button
            onClick={() => setShowCancelModal(true)}
            disabled={loading || !user}
            className={`block w-full text-center bg-red-100 text-red-500 font-semibold py-3 rounded-md hover:bg-red-200 transition ${
              loading || !user ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Canceling..." : "Cancel Subscription"}
          </button>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={loading || !user}
            className={`block w-full text-center bg-blue-100 text-blue-500 font-semibold py-3 rounded-md hover:bg-blue-200 transition ${
              loading || !user ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Redirecting..." : buttonText}
          </button>
        )}

        <div className="text-black/90 text-sm space-y-4">
          <p className="font-medium">What's Included:</p>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <FaCheck className="min-w-4 h-4 mt-1 text-blue-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {note && <p className="text-black/70 text-sm pt-2">{note}</p>}
        </div>
      </div>

      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        loading={loading}
      />
    </>
  );
}

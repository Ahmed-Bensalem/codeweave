import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import useLimitCheck from "./LimitChecker";
import { toast } from "react-hot-toast";
import { FaCrown } from "react-icons/fa";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { triesLeft, limitReached } = useLimitCheck();

  const currentPlan = (user?.unsafeMetadata.plan as string) || "free";
  const targetPlan = currentPlan === "free" ? "pro" : currentPlan === "pro" ? "teams" : null;

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (!targetPlan) {
      toast.error("You are already on the highest plan");
      return;
    }

    setLoading(true);

    try {
      console.log("Initiating upgrade for user:", user.id, "to plan:", targetPlan);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
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

  return (
    <>
      {targetPlan && (
        <a
          href="/pricing"
          // disabled={loading}
          className="whitespace-nowrap bg-gradient-to-r from-indigo-400 to-indigo-600 text-white flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FaCrown />
          {loading ? "Redirecting..." : `Upgrade to ${targetPlan}`}
        </a>
      )}
      
    </>
  );
}
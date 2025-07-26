import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import useLimitCheck from "./LimitChecker";
import { toast } from "react-hot-toast";
import { FaCrown } from "react-icons/fa";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const currentPlan = (user?.unsafeMetadata.plan as string) || "free";
  const targetPlan =
    currentPlan === "free" ? "pro" : currentPlan === "pro" ? "teams" : null;

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
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
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

  return (
    <>
      {targetPlan && (
        <a
          href="/pricing"
          className={`
            
            ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:from-indigo-600 hover:to-indigo-800 hover:scale-102"
            }
          `}
          style={{
            fontSize: "14px",
            fontFamily: "sans-serif",
            backgroundColor: "#1D4ED8",
            borderRadius: "6px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 13px",
            cursor: "pointer",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {loading ? "Redirecting..." : `Upgrade to ${targetPlan}`}
          <FaCrown />
        </a>
      )}
    </>
  );
}

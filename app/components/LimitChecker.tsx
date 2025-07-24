import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

export default function useLimitCheck() {
  const { user } = useUser();
  const [triesLeft, setTriesLeft] = useState<number | null>(null);
  const [limitError, setError] = useState<string | null>(null);
  const plan = user?.unsafeMetadata.plan as string;
  useEffect(() => {
    if (user && user.unsafeMetadata.triesLeft !== undefined) {
      console.log(
        "Loaded triesLeft from unsafeMetadata:",
        user.unsafeMetadata.triesLeft
      );
      setTriesLeft(user.unsafeMetadata.triesLeft as number);
    } else {
      console.log("triesLeft not found in unsafeMetadata for user:", user?.id);
    }
  }, [user, plan]);

  const incrementUsage = useCallback(async () => {
    if (!user) {
      console.log("Cannot increment usage: No user");
      setError("No user found");
      return;
    }
    if (triesLeft <= 0) {
      console.log("Cannot increment usage: No tries left");
      setError("No tries left");
      return;
    }

    console.log("Decrementing triesLeft from:", triesLeft);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          triesLeft: triesLeft - 1,
        },
      });
      await user.reload(); // Refresh user object to sync metadata
      console.log("Successfully updated triesLeft to:", triesLeft - 1);
      setTriesLeft(triesLeft - 1);
      setError(null);
    } catch (error) {
      console.error("Failed to update tries:", error);
      setError("Failed to update tries: " + (error.message || "Unknown error"));
    }
  }, [user, triesLeft]);

  const limitReached = triesLeft !== null && triesLeft <= 0;

  return { limitReached, incrementUsage, triesLeft, limitError };
}

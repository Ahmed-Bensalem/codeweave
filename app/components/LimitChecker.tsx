import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

export default function useLimitCheck() {
  const { user } = useUser();
  const [triesLeft, setTriesLeft] = useState<number | null>(null);
  const [limitError, setError] = useState<string | null>(null);
  const plan = user?.unsafeMetadata.plan as string;
  useEffect(() => {
    if (user && user.unsafeMetadata.triesLeft !== undefined) {
      
      setTriesLeft(user.unsafeMetadata.triesLeft as number);
    } 
  }, [user, plan]);

  const incrementUsage = useCallback(async () => {
    if (!user) {
      setError("No user found");
      return;
    }

    const tries = triesLeft ?? 0;
    if (tries <= 0) {
      setError("No tries left");
      return;
    }

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          triesLeft: tries - 1,
        },
      });
      await user.reload();
      setTriesLeft(tries - 1);
      setError(null);
    } catch (error) {
      setError("Failed to update tries: " + (error.message || "Unknown error"));
    }
  }, [user, triesLeft]);

  const limitReached = triesLeft !== null && triesLeft <= 0;

  return { limitReached, incrementUsage, triesLeft, limitError };
}

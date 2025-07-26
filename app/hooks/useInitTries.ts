import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export function useInitTries() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      toast.error("No user found, skipping initialization");
      return;
    }

    const metadata = user.unsafeMetadata;

    if (metadata.triesLeft === undefined) {
      user
        .update({
          unsafeMetadata: {
            triesLeft: 3,
            plan: "free",
          },
        })
        .then(() => {
          return user.reload();
        })
        .catch((error) => {
          console.error("Failed to initialize or sync user metadata:", error);
        });
    }
  }, [user]);
}

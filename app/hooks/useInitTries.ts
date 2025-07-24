import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function useInitTries() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      console.log("No user found, skipping initialization");
      return;
    }

    const metadata = user.unsafeMetadata;

    if (metadata.triesLeft === undefined) {
      console.log("Initializing unsafeMetadata.triesLeft for user:", user.id);
      user
        .update({
          unsafeMetadata: {
            triesLeft: 3,
            plan: "free",
          },
        })
        .then(() => {
          console.log("unsafeMetadata.triesLeft initialized to 3");
          return user.reload();
        })
        .then(() => {
          console.log("User reloaded, new unsafeMetadata:", user.unsafeMetadata);
        })
        .catch((error) => {
          console.error("Failed to initialize or sync user metadata:", error);
        });
    } else {
      console.log("unsafeMetadata.triesLeft already initialized:", metadata.triesLeft);
    }
  }, [user]);
}
// lib/decrement-tries.ts
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function decrementTries() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const current = Number(user.publicMetadata.triesRemaining ?? 0);

  if (current <= 0) throw new Error("No tries left");

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      triesRemaining: current - 1,
    },
  });

  return current - 1;
}

import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId);
  const metadata = user.publicMetadata || {};

  if (metadata.triesRemaining === undefined || metadata.plan === undefined) {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        triesRemaining: 3,
        plan: "free",
      },
    });

    return NextResponse.json({ tries: 3 });
  }

  return NextResponse.json({ tries: metadata.triesRemaining });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    const stripeCustomerId = user.unsafeMetadata?.stripeCustomerId as string;

    if (!stripeCustomerId) {
      console.error("No stripeCustomerId found for user:", user.id);
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      );
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
    });

    if (!subscriptions.data.length) {
      console.error(
        "No active subscriptions found for customer:",
        stripeCustomerId
      );
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    const subscription = subscriptions.data[0];
    await stripe.subscriptions.cancel(subscription.id);

    await clerkClient.users.updateUserMetadata(user.id, {
      unsafeMetadata: {
        plan: "free",
        stripeCustomerId: null,
        triesLeft: 3,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to cancel subscription:", err);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/clerk-sdk-node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});
async function readBodyAsText(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  return Buffer.concat(chunks).toString("utf8");
}
export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await readBodyAsText(req.body!);
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("Received Stripe webhook event:", event.type);
  } catch (err) {
    console.error("Invalid Stripe webhook signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId; 
    const plan = session.metadata?.plan || "pro";

    if (!userId) {
      console.error("No userId in session metadata:", session.metadata);
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
      console.log(
        "Updating Clerk unsafeMetadata for user:",
        userId,
        "with plan:",
        plan
      );
      await clerkClient.users.updateUserMetadata(userId, {
        unsafeMetadata: {
          plan,
          stripeCustomerId: session.customer,
          triesLeft: null, 
        },
      });
      console.log("Successfully updated unsafeMetadata for user:", userId);
    } catch (err) {
      console.error("Failed to update Clerk metadata for user:", userId, err);
      return NextResponse.json(
        { error: "Failed to update user metadata" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

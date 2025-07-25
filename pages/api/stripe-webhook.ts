// pages/api/stripe-webhook.ts
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"]!;
  const buf = await buffer(req);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan || "pro";

    if (!userId) {
      console.error("No userId in metadata");
      return res.status(400).json({ error: "Missing userId" });
    }

    try {
      await clerkClient.users.updateUserMetadata(userId, {
        unsafeMetadata: {
          plan,
          stripeCustomerId: session.customer,
          triesLeft: null,
        },
      });
    } catch (err) {
      console.error("Failed to update Clerk metadata:", err);
      return res.status(500).json({ error: "Update failed" });
    }
  }

  res.status(200).json({ received: true });
}

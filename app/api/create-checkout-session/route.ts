import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session.userId;
  const { passedPlan } = await req.json();
  const plan = passedPlan || "pro";
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const priceIdMap: { [key: string]: string } = {
    pro: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    teams: process.env.STRIPE_TEAMS_MONTHLY_PRICE_ID!,
  };
  try {
    if (!priceIdMap[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceIdMap[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error("❌ Stripe checkout failed for user:", userId, err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

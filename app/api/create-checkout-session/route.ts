// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Set to correct version or remove this line if your account uses default version
  // @ts-ignore
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  const authData = await auth(); // ✅ await this
  const userId = authData.userId;
  console.log('✅ Clerk userId:', userId);

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe checkout failed:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/clerk-sdk-node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed.', err);
    return new NextResponse('Webhook error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;

    console.log('✅ Webhook fired for userId:', userId);

    if (userId) {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan: 'pro',
        },
      });

      console.log('✅ Clerk user plan updated to pro');
    }
  }

  return new NextResponse('OK', { status: 200 });
}

// Optional: Reject unsupported methods
export async function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

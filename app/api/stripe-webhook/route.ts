// app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json({ received: true });
}

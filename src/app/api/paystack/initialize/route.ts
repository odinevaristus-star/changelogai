import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();

    const amount = plan === 'team' ? 2900 * 100 : 900 * 100; // in kobo

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency: 'USD',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: { plan },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({ url: data.data.authorization_url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }
}

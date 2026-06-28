import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();

    const amount = plan === 'team' ? 2900 * 100 : 900 * 100;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: { plan },
      }),
    });

    const data = await response.json();
    console.log('Paystack response:', JSON.stringify(data));

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({ url: data.data.authorization_url });
  } catch (error) {
    console.error('Paystack error:', error);
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }
}

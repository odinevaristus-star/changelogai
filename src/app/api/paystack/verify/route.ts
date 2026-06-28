import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'No reference provided' }, { status: 400 });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
    }

    const plan = data.data.metadata?.plan || 'pro';

    return NextResponse.json({ success: true, plan, email: data.data.customer.email });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { Paddle, EventName } from '@paddle/paddle-node-sdk';
import { Redis } from '@upstash/redis';

const paddle = new Paddle(process.env.PADDLE_API_KEY!);
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get('paddle-signature') || '';
  const body = await req.text();

  try {
    const eventData = paddle.webhooks.unmarshal(body, process.env.PADDLE_WEBHOOK_SECRET!, signature);

    if (!eventData) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const customData = (eventData.data as any).customData || {};
    const email = customData.user_email;

    if (!email) {
      console.warn('Webhook received without user_email in customData');
      return NextResponse.json({ success: true });
    }

    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        const status = (eventData.data as any).status;
        if (status === 'active' || status === 'trialing') {
          await redis.set(`user:${email}:isPro`, true);
          await redis.set(`user:${email}:plan`, 'pro');
        } else {
          await redis.set(`user:${email}:isPro`, false);
        }
        break;

      case EventName.SubscriptionCanceled:
        await redis.set(`user:${email}:isPro`, false);
        await redis.set(`user:${email}:plan`, 'free');
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Paddle Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}

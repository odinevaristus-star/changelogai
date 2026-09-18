import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ plan: 'free' })
  }

  const isPro = await redis.get(`user:${email}:isPro`)
  const plan = await redis.get(`user:${email}:plan`)

  return NextResponse.json({
    plan: isPro ? 'pro' : (plan || 'free')
  })
}
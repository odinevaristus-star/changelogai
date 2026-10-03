import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ entries: [] })
    }

    const raw = await redis.lrange(`timeline:${email}`, 0, 49)
    const entries = raw.map((item: any) => 
      typeof item === 'string' ? JSON.parse(item) : item
    )

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Timeline fetch error:', error)
    return NextResponse.json({ entries: [] })
  }
}

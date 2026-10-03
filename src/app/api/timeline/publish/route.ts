import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { auth } from '@/auth'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, category, repoName } = await req.json()

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    const email = session.user.email
    const id = `changelog_${Date.now()}`
    const entry = {
      id,
      content,
      category: category || 'Other',
      repoName: repoName || 'Unknown repo',
      author: session.user.name || email,
      createdAt: new Date().toISOString(),
    }

    await redis.lpush(`timeline:${email}`, JSON.stringify(entry))
    await redis.ltrim(`timeline:${email}`, 0, 49)

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
  }
}

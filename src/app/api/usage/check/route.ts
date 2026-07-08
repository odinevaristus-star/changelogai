import { auth } from "@/auth";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const isPro = await redis.get(`user:${session.user.email}:isPro`);
  if (isPro === true || isPro === "true") {
    return NextResponse.json({ allowed: true, isPro: true });
  }

  const month = new Date().toISOString().slice(0, 7); // e.g. "2026-07"
  const key = `usage:${session.user.email}:${month}`;
  const count = (await redis.get(key)) as number | null;
  const currentCount = count ? Number(count) : 0;

  if (currentCount >= 3) {
    return NextResponse.json({ allowed: false, isPro: false, count: currentCount });
  }

  await redis.set(key, currentCount + 1);
  return NextResponse.json({ allowed: true, isPro: false, count: currentCount + 1 });
}

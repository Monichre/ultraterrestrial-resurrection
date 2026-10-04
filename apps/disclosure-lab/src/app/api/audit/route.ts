import { NextResponse } from 'next/server'
import { readAudit } from '@/lib/audit'

export async function GET(req: Request) {
  const limit = Number(new URL(req.url).searchParams.get('limit') ?? 100)
  const entries = await readAudit(Number.isFinite(limit) ? limit : 100)
  return NextResponse.json({ entries })
}

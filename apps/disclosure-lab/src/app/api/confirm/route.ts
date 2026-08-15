import { NextResponse } from 'next/server'
import { z } from 'zod'
import { executeConfirmed } from '@/lib/lab-tools'
import { peekConfirmToken } from '@/lib/write-policy'

const schema = z.object({
  token: z.string().uuid(),
})

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })
  const pending = peekConfirmToken(token)
  if (!pending) return NextResponse.json({ error: 'unknown token' }, { status: 404 })
  return NextResponse.json({
    summary: pending.summary,
    kind: pending.kind,
    expiresAt: pending.expiresAt,
  })
}

export async function POST(req: Request) {
  try {
    const { token } = schema.parse(await req.json())
    const result = await executeConfirmed(token)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }
}

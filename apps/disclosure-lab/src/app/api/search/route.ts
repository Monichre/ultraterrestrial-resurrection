import { NextResponse } from 'next/server'
import { z } from 'zod'
import { runSearch } from '@/lib/lab-tools'

const schema = z.object({
  query: z.string().min(1),
  table: z.string().optional(),
  limit: z.number().min(1).max(50).optional(),
})

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json())
    const result = await runSearch(body.query, body.table, body.limit ?? 20)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }
}

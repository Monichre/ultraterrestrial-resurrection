import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prepareSqlWrite, runSqlRead } from '@/lib/lab-tools'
import { classifySql } from '@/lib/write-policy'

const schema = z.object({
  query: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const { query } = schema.parse(await req.json())
    const check = classifySql(query)
    if (!check.allowed) {
      return NextResponse.json({ error: check.reason }, { status: 400 })
    }
    if (check.mutating) {
      const pending = await prepareSqlWrite(query)
      return NextResponse.json(pending)
    }
    const result = await runSqlRead(query)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }
}

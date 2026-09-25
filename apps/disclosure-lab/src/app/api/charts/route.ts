import { NextResponse } from 'next/server'
import { runAggregate } from '@/lib/lab-tools'

export async function GET() {
  try {
    const data = await runAggregate()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

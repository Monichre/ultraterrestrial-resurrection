import { NextResponse } from 'next/server'
import { listQualityRuns, runQualityCheck, supportedQualityTables } from '@/lib/quality'

export const maxDuration = 60

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const table = params.get('table') ?? 'key_figures'

  if (params.get('history')) {
    return NextResponse.json({ table, runs: await listQualityRuns(table) })
  }

  try {
    const report = await runQualityCheck(table, { record: params.get('record') === '1' })
    return NextResponse.json({ report, supportedTables: supportedQualityTables() })
  } catch (e) {
    return NextResponse.json(
      { error: String(e instanceof Error ? e.message : e), supportedTables: supportedQualityTables() },
      { status: 400 },
    )
  }
}

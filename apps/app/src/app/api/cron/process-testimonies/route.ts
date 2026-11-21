// CRON: Process queued testimony items from Upstash Redis.
// Scheduled every 6 hours via vercel.json. Secured with CRON_SECRET.
import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@db/postgres'
import { Queue } from '@/lib/upstash/queue'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const BATCH_SIZE = 10

interface TestimonyQueueItem {
  type: 'testimony'
  action: 'create' | 'update'
  data: {
    title: string
    summary?: string
    source?: string
    context?: string
    claims?: string[]
    personnel?: Array<{ name: string; role?: string; bio?: string }>
    events?: Array<{ title: string; location?: string; date?: string; description?: string }>
    organizations?: Array<{ name: string; description?: string }>
  }
}

async function processTestimonyItem(item: TestimonyQueueItem, sql: ReturnType<typeof getSql>): Promise<void> {
  const { data } = item

  // Upsert into the testimonies table. The schema has: title, summary, source, context, claims (text[])
  // On conflict (same title + source) update the summary/context.
  await sql`
    INSERT INTO testimonies (title, summary, source, context, claims)
    VALUES (
      ${data.title},
      ${data.summary ?? null},
      ${data.source ?? null},
      ${data.context ?? null},
      ${data.claims ? JSON.stringify(data.claims) : null}
    )
    ON CONFLICT (title, source) DO UPDATE SET
      summary  = EXCLUDED.summary,
      context  = EXCLUDED.context,
      claims   = EXCLUDED.claims
  `
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const queue = new Queue<TestimonyQueueItem>({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    queueName: 'default-queue',
  })

  let processed = 0
  let errors = 0
  const errorMessages: string[] = []

  try {
    const sql = getSql()

    for (let i = 0; i < BATCH_SIZE; i++) {
      const item = await queue.pop()
      if (!item) break // Queue empty

      if (item.type !== 'testimony') {
        // Re-enqueue non-testimony items so they aren't lost
        await queue.push(item)
        continue
      }

      try {
        await processTestimonyItem(item, sql)
        processed++
      } catch (err) {
        errors++
        const msg = err instanceof Error ? err.message : String(err)
        errorMessages.push(`${item.data.title}: ${msg}`)
        console.error('[cron/process-testimonies] failed to process item:', msg, item)
      }
    }

    const remaining = await queue.size()

    return NextResponse.json({
      processed,
      errors,
      remaining,
      timestamp: new Date().toISOString(),
      ...(errorMessages.length > 0 ? { errorMessages } : {}),
    })
  } catch (err) {
    console.error('[cron/process-testimonies] fatal error:', err)
    return NextResponse.json(
      {
        processed,
        errors: errors + 1,
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

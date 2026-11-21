import { NextResponse } from 'next/server'
import { knowledgeBaseStats } from '@/lib/knowledge-base'
import { runAggregate } from '@/lib/lab-tools'
import { vectorStoreMeta } from '@/lib/vector-store'

export async function GET() {
  try {
    const [neon, knowledgeBase, vectorStore] = await Promise.all([
      runAggregate(),
      knowledgeBaseStats().catch((err) => ({ error: String(err) })),
      vectorStoreMeta().catch((err) => ({ error: String(err) })),
    ])
    return NextResponse.json({ ...neon, knowledgeBase, vectorStore })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

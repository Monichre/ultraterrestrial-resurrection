import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  getKnowledgeBaseDocument,
  knowledgeBaseStats,
  searchKnowledgeBase,
} from '@/lib/knowledge-base'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (id) {
      const doc = await getKnowledgeBaseDocument(id)
      if (!doc) return NextResponse.json({ error: `unknown document ${id}` }, { status: 404 })
      return NextResponse.json(doc)
    }

    const query = url.searchParams.get('q') ?? url.searchParams.get('query') ?? ''
    if (query) {
      const limit = Number(url.searchParams.get('limit') ?? 25)
      const results = await searchKnowledgeBase(query, Math.min(Math.max(limit, 1), 100))
      return NextResponse.json({ results, count: results.length })
    }

    return NextResponse.json(await knowledgeBaseStats())
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

const searchSchema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(100).optional(),
})

export async function POST(req: Request) {
  try {
    const body = searchSchema.parse(await req.json())
    const results = await searchKnowledgeBase(body.query, body.limit ?? 25)
    return NextResponse.json({ results, count: results.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }
}

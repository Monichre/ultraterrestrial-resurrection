import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchVectorStoreFile, searchVectorStore, vectorStoreMeta } from '@/lib/vector-store'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (id) {
      const doc = await fetchVectorStoreFile(id)
      return NextResponse.json(doc)
    }
    return NextResponse.json(await vectorStoreMeta())
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

const searchSchema = z.object({
  query: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = searchSchema.parse(await req.json())
    const result = await searchVectorStore(body.query)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 })
  }
}

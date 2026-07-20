// Shared embedding helper for the two live agent routes (disclosure mindmap +
// Prometheus chat). Model is locked to text-embedding-3-small @ 1536 dims —
// all entity/chunk embeddings in Neon were generated with it, so changing the
// model here silently breaks pgvector cosine relevance.
import { openai } from '@/lib/openai/client'

/** Generate a pgvector embedding for semantic search. Returns [] on failure so
 *  callers can safely fall through to FTS-only mode. */
export async function embedQuery(text: string): Promise<number[]> {
  try {
    const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text })
    return res.data[0].embedding
  } catch {
    return []
  }
}

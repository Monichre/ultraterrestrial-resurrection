/** Drop a row's vector so it does not ride the SSE stream or the canvas server action. */
export function stripEmbedding<T>(row: T): T {
  if (!row || typeof row !== 'object' || !('embedding' in row)) return row
  const {embedding: _embedding, ...rest} = row as T & {embedding?: unknown}
  return rest as T
}

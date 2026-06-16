/**
 * Postgres client for the rebuilt data layer.
 * Uses @neondatabase/serverless — works in Node.js, Edge, and Bun.
 * Reads DATABASE_URL from env (set in packages/db/.env or root .env).
 */
import { neon, neonConfig } from '@neondatabase/serverless'

// Allow WebSocket pooling in long-lived Node.js processes
neonConfig.fetchConnectionCache = true

function getUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return url
}

let _sql: ReturnType<typeof neon> | null = null

/** Singleton neon tagged-template SQL client. */
export function getSql() {
  if (!_sql) _sql = neon(getUrl())
  return _sql
}

/** Convenience alias. */
export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_t, p) {
    return (getSql() as any)[p]
  },
  apply(_t, _this, args) {
    return (getSql() as any)(...args)
  },
})

export default getSql

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

// Neon serverless computes suspend when idle; the first query after suspend
// triggers a cold-start wake-up that can exceed the default fetch timeout and
// surface as `TypeError: fetch failed`. Retry transient fetch failures so the
// wake-up request is retried instead of failing the whole page render.
const MAX_RETRIES = 2
const RETRY_BACKOFF_MS = 400

function isTransientFetchError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const msg = (err as Error).message ?? ''
  if (msg.includes('fetch failed')) return true
  const cause = (err as any).cause
  if (cause) {
    const cmsg = cause.message ?? ''
    const code = cause.code ?? ''
    if (cmsg.includes('fetch failed')) return true
    if (['ECONNRESET', 'ECONNREFUSED', 'EAI_AGAIN', 'ETIMEDOUT', 'UND_ERR_SOCKET'].includes(code)) return true
  }
  return false
}

function withRetry<T extends Function>(fn: T): T {
  const runWithRetry = (args: any[], n = 0): Promise<unknown> =>
    Promise.resolve(Reflect.apply(fn as any, fn as any, args)).catch((err: unknown) => {
      if (n < MAX_RETRIES && isTransientFetchError(err)) {
        return new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS * (n + 1))).then(() => runWithRetry(args, n + 1))
      }
      throw err
    })
  return new Proxy(fn as object, {
    get(_t, p) {
      const value = Reflect.get(fn as object, p)
      return typeof value === 'function' ? value.bind(fn) : value
    },
    apply(_t, _this, args) {
      return runWithRetry(args)
    },
  }) as unknown as T
}

let _sql: ReturnType<typeof neon> | null = null

/** Singleton neon tagged-template SQL client (with cold-start retry). */
export function getSql() {
  if (!_sql) {
    const raw = neon(getUrl(), {
      fetchOptions: { priority: 'high' },
    })
    _sql = withRetry(raw) as ReturnType<typeof neon>
  }
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

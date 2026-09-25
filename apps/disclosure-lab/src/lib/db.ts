import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.resolve(here, '../..')
const repoRoot = path.resolve(appRoot, '../..')

let loaded = false

export function ensureDbEnv() {
  if (loaded) return
  // Repo-root .env first so OPENAI_* matches openai-vector-store-mcp / Prometheus.
  // packages/db/.env still supplies DATABASE_URL when it is not already set.
  loadEnv({ path: path.join(repoRoot, '.env') })
  loadEnv({ path: path.join(repoRoot, '.env.local') })
  loadEnv({ path: path.join(repoRoot, 'apps/app/.env.local') })
  loadEnv({ path: path.join(repoRoot, 'packages/db/.env') })
  loadEnv({ path: path.join(appRoot, '.env.local'), override: true })
  loaded = true
}

ensureDbEnv()

export {
  getSql,
  resolveTable,
  searchDatabase,
  aggregateEventsByYear,
} from '@db/postgres'

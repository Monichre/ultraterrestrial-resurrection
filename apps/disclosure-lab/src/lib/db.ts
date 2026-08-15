import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.resolve(here, '../..')
const repoRoot = path.resolve(appRoot, '../..')

let loaded = false

export function ensureDbEnv() {
  if (loaded) return
  loadEnv({ path: path.join(repoRoot, 'packages/db/.env') })
  loadEnv({ path: path.join(repoRoot, '.env') })
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

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

export const LAB_ROOT = path.resolve(here, '../..')
export const REPO_ROOT = path.resolve(LAB_ROOT, '../..')
export const KB_ROOT = path.join(REPO_ROOT, 'packages/knowledge-base')
export const KB_INDEX_PATH = path.join(KB_ROOT, 'metadata/index.json')

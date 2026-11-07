// GET /api/board/activity — recent coding-agent sessions for /board.
// Source: .specstory/history (SpecStory transcripts). Only file metadata and
// a bounded header read are used; no transcript content is returned.
//
// Session slugs are the user's own prompts, and middleware leaves this route
// public, so it is off in production unless BOARD_ACTIVITY_ENABLED=1.

import {existsSync} from 'node:fs'
import {open, readdir, stat} from 'node:fs/promises'
import path from 'node:path'
import {NextResponse} from 'next/server'
import {buildSession} from '@/app/board/activity/parse'
import type {ActivitySnapshot} from '@/app/board/activity/types'

export const dynamic = 'force-dynamic'

const MAX_SESSIONS = 25
const HEAD_BYTES = 16 * 1024

function findHistoryDir(): string | null {
  let dir = process.cwd()
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, '.specstory', 'history')
    if (existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

async function readHead(file: string): Promise<string> {
  const fh = await open(file, 'r')
  try {
    const buf = Buffer.alloc(HEAD_BYTES)
    const {bytesRead} = await fh.read(buf, 0, HEAD_BYTES, 0)
    return buf.subarray(0, bytesRead).toString('utf8')
  } finally {
    await fh.close()
  }
}

export async function GET() {
  if (process.env.NODE_ENV === 'production' && process.env.BOARD_ACTIVITY_ENABLED !== '1') {
    return new NextResponse('Not found', {status: 404})
  }

  const now = Date.now()
  const headers = {'Cache-Control': 'no-store'}
  const historyDir = findHistoryDir()

  if (!historyDir) {
    const empty: ActivitySnapshot = {
      available: false,
      generatedAt: new Date(now).toISOString(),
      totalSessions: 0,
      sessions: [],
    }
    return NextResponse.json(empty, {headers})
  }

  try {
    const names = (await readdir(historyDir)).filter((n) => n.endsWith('.md'))
    const stats = await Promise.all(
      names.map(async (name) => ({name, mtimeMs: (await stat(path.join(historyDir, name))).mtimeMs})),
    )
    stats.sort((a, b) => b.mtimeMs - a.mtimeMs)

    const sessions = await Promise.all(
      stats.slice(0, MAX_SESSIONS).map(async ({name, mtimeMs}) =>
        buildSession(name, await readHead(path.join(historyDir, name)), mtimeMs, now),
      ),
    )

    const snapshot: ActivitySnapshot = {
      available: true,
      generatedAt: new Date(now).toISOString(),
      totalSessions: names.length,
      sessions,
    }
    return NextResponse.json(snapshot, {headers})
  } catch (err) {
    console.error('[board/activity] failed to read session history', err)
    return NextResponse.json({error: 'Failed to read session history'}, {status: 500, headers})
  }
}

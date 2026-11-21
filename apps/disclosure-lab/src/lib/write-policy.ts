import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveTable } from './db'

/** Entity tables human operators may INSERT/UPDATE in Lab v1. */
export const WRITABLE_TABLES = [
  'events',
  'key_figures',
  'topics',
  'organizations',
  'sightings',
  'testimonies',
  'documents',
  'artifacts',
  'locations',
] as const

export type WritableTable = ( typeof WRITABLE_TABLES )[number]

const BLOCKED_SQL =
  /\b(DELETE|TRUNCATE|DROP|ALTER|CREATE|GRANT|REVOKE|CALL|COPY|VACUUM|REINDEX|CLUSTER|COMMENT)\b/i

const MUTATING_SQL = /\b(INSERT|UPDATE|UPSERT|MERGE|REPLACE)\b/i

export const SELECT_ROW_CAP = 500

export type PendingMutation = {
  token: string
  kind: 'upsert' | 'sql'
  createdAt: number
  expiresAt: number
  summary: string
  payload: Record<string, unknown>
}

const TOKEN_TTL_MS = 5 * 60 * 1000

const appRoot = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '../..' )
const pendingPath = path.join( appRoot, '.data', 'pending-confirms.json' )

type GlobalPending = {
  map: Map<string, PendingMutation>
}

function getStore(): Map<string, PendingMutation> {
  const g = globalThis as typeof globalThis & { __labPendingConfirms?: GlobalPending }
  if ( !g.__labPendingConfirms ) {
    g.__labPendingConfirms = { map: loadFromDisk() }
  }
  return g.__labPendingConfirms.map
}

function loadFromDisk(): Map<string, PendingMutation> {
  const map = new Map<string, PendingMutation>()
  try {
    if ( !existsSync( pendingPath ) ) return map
    const raw = JSON.parse( readFileSync( pendingPath, 'utf8' ) ) as PendingMutation[]
    const now = Date.now()
    for ( const entry of raw ) {
      if ( entry?.token && entry.expiresAt > now ) map.set( entry.token, entry )
    }
  } catch {
    // corrupt / missing file — start empty
  }
  return map
}

function persistToDisk( map: Map<string, PendingMutation> ) {
  const now = Date.now()
  const entries = [...map.values()].filter( ( e ) => e.expiresAt > now )
  mkdirSync( path.dirname( pendingPath ), { recursive: true } )
  writeFileSync( pendingPath, JSON.stringify( entries, null, 0 ), 'utf8' )
}

export function isWritableTable( name: string ): boolean {
  const resolved = resolveTable( name )
  return ( WRITABLE_TABLES as readonly string[] ).includes( resolved )
}

export function assertWritableTable( name: string ): string {
  const resolved = resolveTable( name )
  if ( !( WRITABLE_TABLES as readonly string[] ).includes( resolved ) ) {
    throw new Error( `Table not writable in Lab v1: ${name}` )
  }
  return resolved
}

export function classifySql( sqlText: string ): {
  allowed: boolean
  mutating: boolean
  reason?: string
} {
  const trimmed = sqlText.trim()
  if ( !trimmed ) return { allowed: false, mutating: false, reason: 'Empty SQL' }
  if ( BLOCKED_SQL.test( trimmed ) ) {
    return {
      allowed: false,
      mutating: false,
      reason: 'Blocked statement (DELETE/TRUNCATE/DDL not allowed in Lab v1)',
    }
  }
  const mutating = MUTATING_SQL.test( trimmed )
  if ( mutating && !/\bWHERE\b/i.test( trimmed ) && /\bUPDATE\b/i.test( trimmed ) ) {
    return { allowed: false, mutating: true, reason: 'UPDATE without WHERE is rejected' }
  }
  const isRead =
    /^\s*(WITH|SELECT|EXPLAIN)\b/i.test( trimmed ) || /^\s*\(\s*SELECT\b/i.test( trimmed )
  if ( !mutating && !isRead ) {
    return { allowed: false, mutating: false, reason: 'Only SELECT/WITH/EXPLAIN or INSERT/UPDATE allowed' }
  }
  return { allowed: true, mutating }
}

export function createConfirmToken(
  kind: PendingMutation['kind'],
  summary: string,
  payload: Record<string, unknown>,
): PendingMutation {
  const token = randomUUID()
  const now = Date.now()
  const entry: PendingMutation = {
    token,
    kind,
    createdAt: now,
    expiresAt: now + TOKEN_TTL_MS,
    summary,
    payload,
  }
  const map = getStore()
  map.set( token, entry )
  persistToDisk( map )
  return entry
}

export function consumeConfirmToken( token: string ): PendingMutation {
  const map = getStore()
  let entry = map.get( token )
  if ( !entry ) {
    // HMR / cold route may have emptied memory — reload disk once
    const disk = loadFromDisk()
    for ( const [k, v] of disk ) map.set( k, v )
    entry = map.get( token )
  }
  if ( !entry ) throw new Error( 'Unknown or already-used confirm token' )
  map.delete( token )
  persistToDisk( map )
  if ( Date.now() > entry.expiresAt ) throw new Error( 'Confirm token expired' )
  return entry
}

export function peekConfirmToken( token: string ): PendingMutation | null {
  const map = getStore()
  let entry = map.get( token )
  if ( !entry ) {
    const disk = loadFromDisk()
    for ( const [k, v] of disk ) map.set( k, v )
    entry = map.get( token )
  }
  if ( !entry ) return null
  if ( Date.now() > entry.expiresAt ) {
    map.delete( token )
    persistToDisk( map )
    return null
  }
  return entry
}

import {
  aggregateEventsByYear,
  getSql,
  resolveTable,
  searchDatabase,
} from '../db'
import {
  SELECT_ROW_CAP,
  WRITABLE_TABLES,
  assertWritableTable,
  classifySql,
  createConfirmToken,
  consumeConfirmToken,
} from '../write-policy'
import { appendAudit } from '../audit'

export const ENTITY_TABLES = [
  'topics',
  'key_figures',
  'events',
  'organizations',
  'sightings',
  'testimonies',
  'documents',
  'artifacts',
  'locations',
] as const

const VECTOR_TABLES = new Set( [
  'topics',
  'key_figures',
  'events',
  'organizations',
  'testimonies',
  'documents',
  'artifacts',
  'document_chunks',
] )

export async function listTables() {
  return {
    entityTables: [...ENTITY_TABLES],
    writableTables: [...WRITABLE_TABLES],
  }
}

export async function describeSchema( table?: string ) {
  const sql = getSql()
  if ( table ) {
    const resolved = resolveTable( table )
    const cols = ( await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${resolved}
      ORDER BY ordinal_position
    `) as { column_name: string; data_type: string; is_nullable: string }[]
    return { table: resolved, columns: cols }
  }
  const tables = ( await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `) as { table_name: string }[]
  return { tables: tables.map( ( t ) => t.table_name ) }
}

export async function listRecords( table: string, size = 50, offset = 0 ) {
  const resolved = resolveTable( table )
  const sql = getSql()
  const limit = Math.min( size, SELECT_ROW_CAP )
  const [countRows, rows] = await Promise.all( [
    sql.query( `SELECT count(*)::int AS count FROM "${resolved}"` ) as Promise<
      { count: number }[]
    >,
    sql.query( `SELECT * FROM "${resolved}" LIMIT $1 OFFSET $2`, [
      limit + 1,
      offset,
    ] ) as Promise<Record<string, unknown>[]>,
  ] )
  const total = countRows[0]?.count ?? 0
  const records = rows.slice( 0, limit ).map( stripHeavyFields )
  return {
    records,
    total,
    offset,
    size: limit,
    hasMore: offset + records.length < total || rows.length > limit,
  }
}

export async function getRecord( table: string, id: string ) {
  const resolved = resolveTable( table )
  const sql = getSql()
  const rows = ( await sql.query( `SELECT * FROM "${resolved}" WHERE id = $1 LIMIT 1`, [
    id,
  ] ) ) as Record<string, unknown>[]
  const row = rows[0]
  return row ? stripHeavyFields( row ) : null
}

export async function runSqlRead( query: string ) {
  const check = classifySql( query )
  if ( !check.allowed ) throw new Error( check.reason ?? 'SQL rejected' )
  if ( check.mutating ) throw new Error( 'Mutating SQL is not available to the Lab assistant' )
  const sql = getSql()
  const capped = /LIMIT\s+\d+/i.test( query )
    ? query
    : `${query.replace( /;\s*$/, '' )} LIMIT ${SELECT_ROW_CAP}`
  const rows = ( await sql.query( capped ) ) as Record<string, unknown>[]
  return { rows: rows.slice( 0, SELECT_ROW_CAP ), rowCount: rows.length }
}

export async function runSearch( query: string, table?: string, limit = 20 ) {
  const terms = query
    .trim()
    .split( /\s+/ )
    .filter( Boolean )
  return searchDatabase( {
    searchTerms: terms,
    table: table ? resolveTable( table ) : undefined,
    limit,
  } )
}

export async function runAggregate() {
  const sql = getSql()
  const counts: { table: string; count: number }[] = []
  for ( const table of ENTITY_TABLES ) {
    const rows = ( await sql.query( `SELECT count(*)::int AS count FROM "${table}"` ) ) as {
      count: number
    }[]
    counts.push( { table, count: rows[0]?.count ?? 0 } )
  }

  const embeddingCoverage: { table: string; total: number; embedded: number }[] = []
  for ( const table of VECTOR_TABLES ) {
    try {
      const rows = ( await sql.query(
        `SELECT count(*)::int AS total,
                count(embedding)::int AS embedded
         FROM "${table}"`,
      ) ) as { total: number; embedded: number }[]
      embeddingCoverage.push( {
        table,
        total: rows[0]?.total ?? 0,
        embedded: rows[0]?.embedded ?? 0,
      } )
    } catch {
      // table may lack embedding column
    }
  }

  const yearStart = '1940-01-01'
  const yearEnd = `${new Date().getFullYear()}-12-31`
  const eventsByYear = await aggregateEventsByYear( yearStart, yearEnd )

  return { counts, embeddingCoverage, eventsByYear }
}

export async function prepareUpsert( input: {
  table: string
  id?: string
  values: Record<string, unknown>
} ) {
  const table = assertWritableTable( input.table )
  const values = sanitizeValues( input.values )
  if ( Object.keys( values ).length === 0 ) throw new Error( 'No values to write' )

  const kind = input.id ? 'update' : 'insert'
  const summary =
    kind === 'update'
      ? `UPDATE ${table} id=${input.id} fields=${Object.keys( values ).join( ',' )}`
      : `INSERT ${table} fields=${Object.keys( values ).join( ',' )}`

  const pending = createConfirmToken( 'upsert', summary, {
    table,
    id: input.id ?? null,
    values,
    kind,
  } )
  return {
    needsConfirm: true,
    token: pending.token,
    summary: pending.summary,
    expiresAt: pending.expiresAt,
  }
}

export async function prepareSqlWrite( query: string ) {
  const check = classifySql( query )
  if ( !check.allowed ) throw new Error( check.reason ?? 'SQL rejected' )
  if ( !check.mutating ) {
    return runSqlRead( query )
  }
  const pending = createConfirmToken( 'sql', `SQL: ${query.slice( 0, 180 )}`, { query } )
  return {
    needsConfirm: true,
    token: pending.token,
    summary: pending.summary,
    expiresAt: pending.expiresAt,
  }
}

export async function executeConfirmed( token: string ) {
  const pending = consumeConfirmToken( token )
  if ( pending.kind === 'upsert' ) {
    const table = String( pending.payload.table )
    const id = pending.payload.id as string | null
    const values = pending.payload.values as Record<string, unknown>
    const kind = pending.payload.kind as 'insert' | 'update'
    const result = await applyUpsert( table, id, values, kind )
    await appendAudit( {
      actor: 'ui',
      tool: kind === 'insert' ? 'insertRecord' : 'updateRecord',
      table,
      summary: pending.summary,
      rowCount: result.rowCount,
    } )
    return result
  }

  const query = String( pending.payload.query )
  const sql = getSql()
  const rows = ( await sql.query( query ) ) as Record<string, unknown>[]
  await appendAudit( {
    actor: 'ui',
    tool: 'runSql',
    summary: pending.summary,
    rowCount: Array.isArray( rows ) ? rows.length : undefined,
  } )
  return { ok: true, rows, rowCount: Array.isArray( rows ) ? rows.length : 0 }
}

async function applyUpsert(
  table: string,
  id: string | null,
  values: Record<string, unknown>,
  kind: 'insert' | 'update',
) {
  const sql = getSql()
  const keys = Object.keys( values )
  if ( kind === 'update' ) {
    if ( !id ) throw new Error( 'id required for update' )
    const setFragments = keys.map( ( k, i ) => `"${k}" = $${i + 1}` )
    const params = keys.map( ( k ) => values[k] )
    params.push( id )
    const q = `UPDATE "${table}" SET ${setFragments.join( ', ' )} WHERE id = $${params.length} RETURNING *`
    const rows = ( await sql.query( q, params ) ) as Record<string, unknown>[]
    return { ok: true, record: rows[0] ?? null, rowCount: rows.length }
  }

  const cols = keys.map( ( k ) => `"${k}"` ).join( ', ' )
  const placeholders = keys.map( ( _, i ) => `$${i + 1}` ).join( ', ' )
  const params = keys.map( ( k ) => values[k] )
  const q = `INSERT INTO "${table}" (${cols}) VALUES (${placeholders}) RETURNING *`
  const rows = ( await sql.query( q, params ) ) as Record<string, unknown>[]
  return { ok: true, record: rows[0] ?? null, rowCount: rows.length }
}

function sanitizeValues( values: Record<string, unknown> ) {
  const out: Record<string, unknown> = {}
  for ( const [key, value] of Object.entries( values ) ) {
    if ( !/^[a-z_][a-z0-9_]*$/i.test( key ) ) continue
    if ( key === 'embedding' || key === 'search_vector' ) continue
    out[key] = value
  }
  return out
}

function stripHeavyFields( row: Record<string, unknown> ) {
  const { embedding: _e, search_vector: _sv, ...rest } = row
  return rest
}

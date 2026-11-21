import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  describeSchema,
  getRecord,
  listRecords,
  listTables,
  prepareUpsert,
} from '@/lib/lab-tools'

const listSchema = z.object( {
  table: z.string(),
  size: z.coerce.number().min( 1 ).max( 500 ).optional(),
  offset: z.coerce.number().min( 0 ).optional(),
  id: z.string().optional(),
} )

export async function GET( req: Request ) {
  try {
    const url = new URL( req.url )
    if ( url.searchParams.get( 'meta' ) === 'tables' ) {
      return NextResponse.json( await listTables() )
    }
    if ( url.searchParams.get( 'meta' ) === 'schema' ) {
      const table = url.searchParams.get( 'table' ) ?? undefined
      return NextResponse.json( await describeSchema( table ) )
    }

    const parsed = listSchema.parse( {
      table: url.searchParams.get( 'table' ),
      size: url.searchParams.get( 'size' ) ?? undefined,
      offset: url.searchParams.get( 'offset' ) ?? undefined,
      id: url.searchParams.get( 'id' ) ?? undefined,
    } )

    if ( parsed.id ) {
      const record = await getRecord( parsed.table, parsed.id )
      return NextResponse.json( { record } )
    }

    const page = await listRecords( parsed.table, parsed.size ?? 50, parsed.offset ?? 0 )
    return NextResponse.json( page )
  } catch ( err ) {
    return NextResponse.json( { error: String( err ) }, { status: 400 } )
  }
}

const writeSchema = z.object( {
  table: z.string(),
  id: z.string().optional(),
  values: z.record( z.unknown() ),
} )

export async function POST( req: Request ) {
  try {
    const body = writeSchema.parse( await req.json() )
    const pending = await prepareUpsert( body )
    return NextResponse.json( pending )
  } catch ( err ) {
    return NextResponse.json( { error: String( err ) }, { status: 400 } )
  }
}

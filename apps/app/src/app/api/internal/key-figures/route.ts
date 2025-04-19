import { xata } from '@/db/xata'
import { type NextRequest } from 'next/server'


export async function POST( request: NextRequest ) {
  const data = await request.json()
  console.log( 'data: ', data )

  try {
    const record = await xata.db.personnel.create( data )
    console.log( 'Created record:', record )

    return Response.json( {
      success: true,
      record
    } )
  } catch ( error ) {
    console.error( 'Error creating record:', error )
    return Response.json( {
      success: false,
      error: 'Failed to create record'
    }, { status: 500 } )
  }
}





import { type NextRequest } from 'next/server'



export async function GET( request: NextRequest ) {
  try {


    return Response.json( {
      sightings,
      timestamp: new Date().toISOString(),
    } )
  } catch ( error ) {
    console.error( 'Error fetching UAP sightings:', error )
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 
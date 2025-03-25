import { getXataClient } from '@/db/xata'

import { type NextRequest } from 'next/server'
const xata: any = getXataClient()

// Hit the aggregate endpoint in Xata
export async function GET( request: NextRequest ) {
  const searchParams = request.nextUrl.searchParams
  console.log( 'searchParams: ', searchParams )
  const type = searchParams.get( 'type' )
  console.log( 'type: ', type )
  const interval = searchParams.get( 'interval' )

  const records = await xata.db[`${type}`].aggregate( {
    byDecade: {
      dateHistogram: {
        column: 'date',
        calendarInterval: interval, //'decade',
      },
    },
  } )
  return Response.json( { records } )

  // query is "hello" for /api/search?query=hello
}

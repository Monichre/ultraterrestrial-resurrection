export async function POST( request: Request ) {
  try {
    const { url } = await request.json()

    if ( !url ) {
      return new Response( JSON.stringify( { error: 'URL parameter is required' } ), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      } )
    }

    // Return success response
    return new Response( JSON.stringify( { success: true, url } ), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    } )

  } catch ( error ) {
    console.error( 'Error processing request:', error )
    return new Response( JSON.stringify( { error: 'Internal server error' } ), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    } )
  }
}

import { XataClient } from '@/db/xata'
import type { ExecutionContext } from 'partykit/server'



export interface Env {
  XATA_BRANCH: string
  XATA_API_KEY: string
  XATA_DATABASE_URL: string
}

export default {
  async fetch( request: Request, env: Env, ctx: ExecutionContext ): Promise<Response> {
    const xata = new XataClient( {
      apiKey: env.XATA_API_KEY,
      branch: env.XATA_BRANCH,
      databaseURL: env.XATA_DATABASE_URL
    } )
    const materializeSqlEndpoint = `https:://${process.env.MATERIALIZE_HOST_URL}/api/sql`

    const materializeResponse = await fetch( materializeSqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${process.env.MATERIALIZE_USER}:${process.env.MATERIALIZE_PASSWORD}`,
      },
      body: JSON.stringify( {
        queries: [

        ]
      } )
    } )

    const response = await fetch( 'https://cvlz7lsodrp2t0xx4alctmp5n.lb.us-east-1.aws.materialize.cloud/api/webhook/materialize/public/xata_cloudflare_worker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        poop: 'pee'
      } ) // Add request body data if needed
    } )

    return response
  }
}

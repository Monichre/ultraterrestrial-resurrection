import { getXataClient } from '@/db/xata'
const xata: any = getXataClient()

export async function POST( req ) {
  const { question } = await req.json()
  const result = await xata.db.Tutorial.ask( '<question>', {
    rules: [
      // ...array of strings with the rules for the model...,
    ],
    searchType: 'keyword|vector',
    search: {
      fuzziness: 0 | 1 | 2,
      prefix: 'phrase|disabled',
      target: {
        // ...search target options...
      },
      filter: {
        // ...search filter options...
      },
      boosters: [
        // ...search boosters options...
      ],
    },
    vectorSearch: {
      column: '<embedding column>',
      contentColumn: '<content column>',
      filter: {
        // ...search filter options...
      },
    },
  } )
}

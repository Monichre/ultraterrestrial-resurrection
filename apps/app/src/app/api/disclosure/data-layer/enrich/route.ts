
import { executePlatformWideConnectionSearch } from '@/db/xata'
import { checkRelevanceWithAI } from '@/services/ai/openai'

export async function POST( req: any ) {
  const { data } = await req.json()
  console.log( 'data: ', data )
  const { subject, type } = data
  console.log( 'type: ', type )
  console.log( 'subject: ', subject )

  const databaseRecords: any = await executePlatformWideConnectionSearch( {
    id: subject.id,
    type,
  } )
  console.log( 'databaseRecords: ', databaseRecords )
  const relatedItems = Array.from( databaseRecords )
  console.log( 'relatedItems: ', relatedItems )
  const response =
    await checkRelevanceWithAI( {
      subject,
      relatedItems,
    } )
  console.log( 'response: ', response )
  // const { relevant, irrelevant } = filterConnectionsByRelevance(connections)

  // const evaluatedRecords = Object.keys(relevant).map((name) => {
  //   const databasedRecord = relatedItems.find(
  //     (record: any) => record.name === name
  //   )
  //   console.log('databasedRecord: ', databasedRecord)
  //   const evaluatedRecord = databasedRecord
  //     ? {
  //         ...databasedRecord,
  //         evaluation: connections[name],
  //       }
  //     : null
  //   console.log('evaluatedRecord: ', evaluatedRecord)
  //   return evaluatedRecord
  // })
  // console.log('evaluatedRecords: ', evaluatedRecords)


  return Response.json( {
    // data
    // text,
    // assistantAnswer,
    // connections: evaluatedRecords,
    payload: response
  } )
}

// pages/api/contact.js

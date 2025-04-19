
import { executePlatformWideConnectionSearch, xata } from '@/db/xata'

import {
  askDisclosureAgentToFindRelatedRecords
} from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'
// import { checkRelevanceWithAI } from '@/services/openai/assistants/disclosure'
// const xata: any = getXataClient()

export async function GET( request: NextRequest ) {

  const searchParams = request.nextUrl.searchParams

  const id = searchParams.get( 'id' )
  console.log( 'id: ', id )

  const type: any = searchParams.get( 'type' )
  console.log( 'type: ', type )
  const source: any = await xata.db[`${type}`].read( id )
  console.log( 'source: ', source )

  const connectionRecords = await executePlatformWideConnectionSearch( { id, type } )

  const relatedItems = Array.from( connectionRecords )
  console.log( 'relatedItems: ', relatedItems )
  // const disclosureAssistantsAttemptAtRelatedRecords = await askDisclosureAgentToFindRelatedRecords( {
  //   subject: source,
  //   type,
  // } )
  // console.log( 'disclosureAssistantsAttemptAtRelatedRecords: ', disclosureAssistantsAttemptAtRelatedRecords )
  // const analysis = await checkRelevanceWithAI( {
  //   subject: source,
  //   relatedItems,
  // } )
  // console.log( 'analysis: ', analysis )
  if ( relatedItems.length === 0 ) {
    console.log( 'No related items found, running search with disclosure agent' )
    const assistantAnswer = await askDisclosureAgentToFindRelatedRecords( {
      subject: source,
      type,
    } )
    console.log( 'assistantAnswer: ', assistantAnswer )
    // const memory = await rememberEntityConnections({
    //   type,
    //   source,
    //   assistantAnswer,
    // })

    return NextResponse.json( {
      data: [],
      assistantAnswer: assistantAnswer,
    } )
  } else {
    // const { connections, assistantAnswer } = await checkRelevanceWithAI({
    //   subject: source,
    //   relatedItems,
    // })

    // console.log('assistantAnswer: ', assistantAnswer)
    // const { relevant, irrelevant } = filterConnectionsByRelevance(connections)
    // console.log('relevant: ', relevant)
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

    // const memory = await rememberEntityConnections({
    //   type,
    //   source,
    //   connections: relevant,
    // })
    // console.log('memory: ', memory)
    return NextResponse.json( {
      data: relatedItems,
      assistantAnswer: null,
    } )
  }
  // const messages = [
  //   {
  //     role: 'system',
  //     content:
  //       'You are an AI tutor with a personality. Give yourself a name for the user.',
  //   },
  //   {
  //     role: 'assistant',
  //     content:
  //       "Understood. I'm an AI tutor with a personality. My name is Alice.",
  //   },
  // ]
  // client
  //   .add(messages, { agent_id: 'ai-tutor', output_format: 'v1.1' })
  //   .then((response) => console.log(response))
  //   .catch((error) => console.error(error))
  // const tables: any = connectionMapByEntityType[type]

  // const originalRecordTypeSingular = objectMapToSingular[type]

  // const subject = await xata.db[type].read(id)

  // const { totalCount, records } = await xata.search.all(`${id}`, {
  //   tables: tables.map(
  //     ({ table, target }: { table: string; target: string }) => {
  //       return {
  //         table: `${table}`,
  //         target: [{ column: `${target}`, weight: 10 }],
  //       }
  //     }
  //   ),
  //   fuzziness: 0,
  //   prefix: 'phrase',
  // })

  // const connectionRecords: Set<any> = new Set()

  // for (const item of records) {
  //   const {
  //     record: { xata: xataObject, ...restOfRecord },
  //   } = item

  //   if (
  //     restOfRecord[originalRecordTypeSingular] &&
  //     restOfRecord[originalRecordTypeSingular].id === id
  //   ) {
  //     delete restOfRecord[originalRecordTypeSingular]
  //   }
  //   const { id: recordId, ...rest } = restOfRecord

  //   const [connectionType] = Object.keys(rest)

  //   const table = objectMapPlural[connectionType]

  //   const connectionId = rest[connectionType].id

  //   const connection: any = await xata.db[table].read(connectionId)
  //   if (!connectionRecords.has(connection)) {
  //     connectionRecords.add({ ...connection, type: table })
  //   }
  // }

  // This is taking a long time to get a response. The solution is probably to rendering the stream back to the client but Im lazy atm
  // const { connections, error } = await checkRelevanceWithAI({
  //   subject,
  //   relatedItems: Array.from(connectionRecords),
  // })
  // console.log('connections: ', connections)
  // if (error) {
  //   return NextResponse.json({ data: error })
  // }
  // const data = Object.keys(connections).map((name) => {
  //   const databasedRecord = Array.from(connectionRecords).find(
  //     (record) => record.name === name
  //   )
  //   console.log('databasedRecord: ', databasedRecord)
  //   const evaluatedRecord = {
  //     ...databasedRecord,
  //     evaluation: connections[name],
  //   }
  //   console.log('evaluatedRecord: ', evaluatedRecord)
  //   return evaluatedRecord
  // })

  // console.log('data: ', data)
}

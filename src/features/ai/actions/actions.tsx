'use server'

import { Message } from '@/features/ai/components/message'


import type { ReactNode } from 'react'

import { generateId } from 'ai'
import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { OpenAI } from 'openai'




const openai = new OpenAI( {
  apiKey: process.env.OPENAI_API_KEY,
} )

export interface ClientMessage {
  id: string
  status: ReactNode
  text: ReactNode
  gui: ReactNode
}

const ASSISTANT_ID = 'asst_xxxx'
let THREAD_ID = ''
let RUN_ID = ''

export async function submitMessage( question: string ): Promise<ClientMessage> {
  const status = createStreamableUI( 'thread.init' )
  const textStream = createStreamableValue( '' )
  const textUIStream = createStreamableUI(
    <Message textStream={textStream.value} />,
  )
  const gui = createStreamableUI()

  const runQueue = [];

  ( async () => {
    if ( THREAD_ID ) {
      await openai.beta.threads.messages.create( THREAD_ID, {
        role: 'user',
        content: question,
      } )

      const run = await openai.beta.threads.runs.create( THREAD_ID, {
        assistant_id: ASSISTANT_ID,
        stream: true,

      } )

      runQueue.push( { id: generateId(), run } )
    } else {
      const run = await openai.beta.threads.createAndRun( {
        assistant_id: ASSISTANT_ID,
        metadata,
        tool_resources: {
          "file_search": {
            "vector_store_ids": ["vs_meWOEnUiUxtQWf0W6NBsNpCG"]
          }
        },
        tool_choice: 'required',
        tools: [
          { type: 'file_search' },
          { type: 'function', function: { name: 'search_database' } }
        ],
        stream: true,
        thread: {
          messages: [{ role: 'user', content: question }],
        },
      } )

      runQueue.push( { id: generateId(), run } )
    }

    while ( runQueue.length > 0 ) {
      const latestRun = runQueue.shift()

      if ( latestRun ) {
        for await ( const delta of latestRun.run ) {
          const { data, event } = delta

          status.update( event )

          if ( event === 'thread.created' ) {
            THREAD_ID = data.id
          } else if ( event === 'thread.run.created' ) {
            RUN_ID = data.id
          } else if ( event === 'thread.message.delta' ) {
            data.delta.content?.map( ( part: any ) => {
              if ( part.type === 'text' ) {
                if ( part.text ) {
                  textStream.append( part.text.value )
                }
              }
            } )
          } else if ( event === 'thread.run.requires_action' ) {
            if ( data.required_action ) {
              if ( data.required_action.type === 'submit_tool_outputs' ) {
                const { tool_calls } = data.required_action.submit_tool_outputs
                const tool_outputs = []

                for ( const tool_call of tool_calls ) {
                  const { id: toolCallId, function: fn } = tool_call
                  const { name, arguments: args } = fn

                  if ( name === 'search_database' ) {
                    const { table, search_terms: searchTerms, search_fields: searchFields, limit, sort_by: sortBy, sort_order: sortOrder, date_range: dateRange } = JSON.parse( args )

                    // gui.append(
                    //   <div className="flex flex-row gap-2 items-center">
                    //     <div>
                    //       Searching for emails: {query}, has_attachments:
                    //       {has_attachments ? 'true' : 'false'}
                    //     </div>
                    //   </div>,
                    // )



                    const analogousRecords = await searchDatabase( { table, searchTerms, searchFields, limit, sortBy, sortOrder, dateRange } )

                    console.log( "🚀 ~ file: actions.tsx:112 ~ forawait ~ analogousRecords:", analogousRecords )

                    // !NOTE: Will want to render the appropriate Mindmap Node Card per Entity Type
                    gui.append(
                      <div className="flex flex-col gap-2">
                        {analogousRecords.map( record => (
                          <div
                            key={record.id}
                            className="p-2 bg-zinc-100 rounded-md flex flex-row gap-2 items-center justify-between"
                          >
                            <div className="flex flex-row gap-2 items-center">
                              <div>{record.name}</div>
                            </div>
                            <div className="text-zinc-500">{record.date}</div>
                          </div>
                        ) )}
                      </div>,
                    )

                    tool_outputs.push( {
                      tool_call_id: toolCallId,
                      output: JSON.stringify( analogousRecords ),
                    } )
                  }
                }

                const nextRun: any =
                  await openai.beta.threads.runs.submitToolOutputs(
                    THREAD_ID,
                    RUN_ID,
                    {
                      tool_outputs,
                      stream: true,
                    },
                  )

                runQueue.push( { id: generateId(), run: nextRun } )
              }
            }
          } else if ( event === 'thread.run.failed' ) {
            console.log( data )
          }
        }
      }
    }

    status.done()
    textUIStream.done()
    gui.done()
  } )()

  return {
    id: generateId(),
    status: status.value,
    text: textUIStream.value,
    gui: gui.value,
  }
}

export const streamNodeUpdate = ( node: any ) => {
  dispatch( { type: 'ADD_NODE', payload: node } )
}
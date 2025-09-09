

import { metadata } from '@/app/layout'

import type { DatabaseSchema } from '@/db/xata'
import { openai } from '@/lib/openai/client'
import { PROMETHEUS_ASSISTANT_ID, INSTRUCTIONS } from '@/services/ai/openai/config'
import { askHow, formatRelatedItems, parseApiResponse } from '@/services/ai/openai/helpers'
import { assistantEventHandler } from '@/services/ai/openai/stream-handler'
import { searchDatabase } from '@/services/ai/openai/tools/search-database'
import { traceable } from 'langsmith/traceable'



// Generate generic type for any kind of DatabaseSchema
type AnyDatabaseSchema = DatabaseSchema[keyof DatabaseSchema]

export const askDisclosureAgentToFindRelatedRecords = traceable( async ( {
  subject,
  type,
}: any ) => {

  const streamEvents = []

  // @ts-ignore
  const thread = await openai.beta.threads.create( {

    metadata,

    tool_resources: {
      "file_search": {
        "vector_store_ids": ["vs_meWOEnUiUxtQWf0W6NBsNpCG"]
      }
    }
  } )
  const threadId = thread.id

  const createdMessage = await openai.beta.threads.messages.create( threadId, {
    role: 'user',
    content: `Find three to five of the most interesting, relevant, and related data points for ${subject.name}. 
      Use the access you have to the entirety of your dataset and any other additional resources to fulfill all user queries. 
      Be sure to look across topics, events, testimonies, documents, key figures or personnel, sightings, artifacts and any additional resources at your disposal. Return your response in JSON with each item containing the fields: "Relation to Subject:", "Evidence:", "Relevance Score:". Cite your sources`,
  } )





  // Non-streaming fallback implementation to avoid deprecated AssistantResponse.
  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: PROMETHEUS_ASSISTANT_ID,
    tools: [{ type: 'file_search' }],
    additional_instructions: INSTRUCTIONS,
  })
  return run

} )

export const checkRelevanceWithAI = traceable( async ( {
  subject,
  relatedItems,
}: {
  subject: any
  relatedItems: any[]
} ) => {
  const thread = await openai.beta.threads.create( {

    metadata,

    tool_resources: {
      "file_search": {
        "vector_store_ids": ["vs_meWOEnUiUxtQWf0W6NBsNpCG"]
      }
    }
  } )
  const threadId = thread.id

  const message = await openai.beta.threads.messages.create( threadId,
    {
      role: 'user',
      content: `${askHow( relatedItems )} ${formatRelatedItems( relatedItems )} related to ${subject?.name}? Return your response in JSON with each item containing the fields: "Relation to Subject:", "Evidence:", "Relevance Score:"`,
    }
  )

  const streamEvents = []


  // Non-streaming fallback implementation to avoid deprecated AssistantResponse.
  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: PROMETHEUS_ASSISTANT_ID,
    tools: [{ type: 'file_search' }],
    additional_instructions: `Look across topics, events, key figures, sightings, documents any additional resources at your disposal. Cite all of your sources thoroughly and specifically, including information and other relevant details on the weight of the resource as it pertains to your answer or the completion of the task. Return your response in well formatted markdown and include citations.`,
  })
  return run

}

)

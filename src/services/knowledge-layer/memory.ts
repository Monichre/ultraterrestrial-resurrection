import { memoryAgent } from '@/lib/mem0'
import { DISCLOSURE_ASSISTANT_ID } from '@/services/agents/openai/config'

// Types
type Message = {
  content: Array<{ text: string }>
}

type MemoryMetadata = {
  source?: any
  assistantAnswer?: Message
  [key: string]: any
}

type EntityType = 'events' | 'personnel' | 'topics' | 'testimonies' | 'organizations'

const AGENT_ID = DISCLOSURE_ASSISTANT_ID || process.env.OPENAI_ASSISTANT_ID

const addMemory = async ( message: any, options: any ) => {
  try {
    return await memoryAgent.add( messages, {
      output_format: 'v1.1',
      ...options
    } )
  } catch ( error ) {
    console.error( 'Error adding memory:', error )
    throw error
  }
}

const addMemorySeries = async ( messages: any, options: any ) => {
  try {
    return await memoryAgent.add( messages, {
      output_format: 'v1.1',
      ...options
    } )
  } catch ( error ) {
    console.error( 'Error adding memory:', error )
    throw error
  }
}

export const addConversationToDisclosureAssistantMemory = async ( {
  messages,
  metadata = null,
}: {
  messages: any
  metadata?: MemoryMetadata | null
} ) => {
  const options = {
    agent_id: AGENT_ID,
    ...( metadata && { metadata } )
  }

  const memorySaved = await addMemory( messages, options )
  return memorySaved
}

export const searchMemory = async ( { query, metadata }: { query: string, metadata?: MemoryMetadata } ) => {
  try {
    const results = await memoryAgent.search( query, { ...metadata } )
    return results
  } catch ( error ) {
    console.error( 'Error searching memory:', error )
    throw error
  }
}

export const storeUserCoreMemory = async ( {
  user,
  contentToStore,
  metadata,
}: {
  user: { id: string }
  contentToStore: any
  metadata?: MemoryMetadata
} ) => {
  return await addMemory( contentToStore, {
    user_id: user.id,
    ...metadata
  } )
}

export const getUserMemories = async ( { user }: { user: { id: string } } ) => {
  try {
    const memories = await memoryAgent.getAll( { user_id: user.id } )
    return memories
  } catch ( error ) {
    console.error( 'Error getting user memories:', error )
    throw error
  }
}

export const getAssistantMemories = async () => {
  try {
    const memories = await memoryAgent.getAll( { agent_id: AGENT_ID } )
    return memories
  } catch ( error ) {
    console.error( 'Error getting assistant memories:', error )
    throw error
  }
}

export const addCustomizedMemory = async ( {
  messages,
  includes
}: {
  messages: any
  includes: string
} ) => {
  return await addMemory( messages, {
    includes,
    agent_id: AGENT_ID
  } )
}

export const rememberEntityConnections = async ( {
  type,
  source,
  assistantAnswer,
}: {
  type: EntityType | string
  source: { id: string }
  assistantAnswer: Message
} ) => {
  const customCategories = {
    events: 'event-connections',
    personnel: 'personnel-connections',
    topics: 'topic-connections',
    testimonies: 'testimony-connections',
    organizations: 'organization-connections'
  }

  const category = customCategories[type as EntityType] || type

  return await addMemory( {
    messages: [assistantAnswer.content[0].text],
    metadata: {
      source,
      assistantAnswer
    },
    custom_categories: {
      ...category
    },
    agent_id: AGENT_ID,
    includes: `${source.id}-connections`
  } )
}

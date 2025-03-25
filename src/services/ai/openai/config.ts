export const DISCLOSURE_ASSISTANT_ID: any =
  process.env.OPENAI_ASSISTANT_ID || ''

export const ENTITY_RELATION_RELEVANCE_THREAD =
  'thread_entity_relation_relevance'
export const INSTRUCTIONS = `The following conversation will consist of messages in the this format: "How is {Suggested Related Record} related to {Subject Record}? If it is not at all related you must say so. If the record's relevance is tennuous indicate the degree to which this is so by scoring it from 1 through 10. All suggested records with no direct link to the subject record must be scored below 5. Return your response in JSON`
export const ENTITY_RELATION_RELEVANCE_THREAD_THREAD_ID =
  'thread_KnfuohJYTwsOlQoXA1QuV7T1'
export const metadata = {
  assistant_id: DISCLOSURE_ASSISTANT_ID,
  internal_thread_key: ENTITY_RELATION_RELEVANCE_THREAD,
  instructions: INSTRUCTIONS,
  role: 'system',
}
export const UFO_VECTOR_DATA_STORE_ID: any = process.env.OPENAI_VECTOR_STORE_ID

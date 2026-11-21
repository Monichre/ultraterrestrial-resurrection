// Sanitize OpenAI IDs from the environment. Some .env entries carry inline
// comments / trailing whitespace (e.g. `OPENAI_ASSISTANT_ID=asst_xxx #note`),
// and dotenv parsers handle those inconsistently — a contaminated id makes
// OpenAI reject every request with a 400, which surfaces to the UI as a silent
// "Unable to fetch results". An OpenAI id never contains whitespace, so take
// the first whitespace-delimited token after stripping any inline comment.
function cleanOpenAIId(raw: string | undefined): string {
  return (raw || '').trim().split(/[\s#]/)[0] ?? ''
}

// Primary assistant for the system: Prometheus
export const PROMETHEUS_ASSISTANT_ID: string = cleanOpenAIId(process.env.OPENAI_ASSISTANT_ID)

export const ENTITY_RELATION_RELEVANCE_THREAD =
  'thread_entity_relation_relevance'
export const INSTRUCTIONS = `The following conversation will consist of messages in the this format: "How is {Suggested Related Record} related to {Subject Record}? If it is not at all related you must say so. If the record's relevance is tennuous indicate the degree to which this is so by scoring it from 1 through 10. All suggested records with no direct link to the subject record must be scored below 5. Return your response in JSON`
export const ENTITY_RELATION_RELEVANCE_THREAD_THREAD_ID =
  'thread_KnfuohJYTwsOlQoXA1QuV7T1'
export const metadata = {
  assistant_id: PROMETHEUS_ASSISTANT_ID,
  internal_thread_key: ENTITY_RELATION_RELEVANCE_THREAD,
  instructions: INSTRUCTIONS,
  role: 'system',
}
// Vector store attached to Prometheus' mind
export const PROMETHEUS_VECTOR_STORE_ID: string = cleanOpenAIId(process.env.OPENAI_VECTOR_STORE_ID)

// Backward-compatibility alias (to be removed):
export const DISCLOSURE_ASSISTANT_ID = PROMETHEUS_ASSISTANT_ID
export const UFO_VECTOR_DATA_STORE_ID = PROMETHEUS_VECTOR_STORE_ID

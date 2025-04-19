
import { KNOWLEDGE_GRAPH_PROMPT } from '@/services/agents/prompts/knowledge-graph.prompt'
import Anthropic from '@anthropic-ai/sdk'
const anthropic = new Anthropic( {
  apiKey: process.env.ANTHROPIC_API_KEY,
} )



const createMessage = async ( content: string ) => {


  const msg = await anthropic.messages.create( {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    temperature: 0,
    system: KNOWLEDGE_GRAPH_PROMPT,
    messages: [{ role: 'user', content }]
  } )
  console.log( msg )


}

export const claudeSummarize = async ( documents: string[] ) => {
  const prompt = CLAUDE_SUMMARIZE_PROMPT
  const msg = await createMessage( prompt )
  return msg
}




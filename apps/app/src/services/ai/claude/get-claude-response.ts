import { baseResearcherPrompt, researchNetworkMapperPrompt } from '@/services/ai/prompts/researchers.prompt'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, streamObject, streamText } from 'ai'

export async function getClaudeTextResponse( { system, prompt, message }: { system?: string, prompt?: string, message: { role: 'user', content: string } } ) {
  const response = await generateText( {
    model: anthropic( 'claude-3-5-sonnet-20241022' ),
    system,
    prompt,
    messages: [message]
  } )

  console.log( "🚀 ~ file: get-claude-response.ts:14 ~ getClaudeTextResponse ~ response:", response )

  return response.text
}
export const getClaudeSummary = async ( { system = baseResearcherPrompt, prompt, content }: { system?: string, prompt?: string, content: string } ) => {
  const summary = getClaudeTextResponse( { system, prompt, message: { role: 'user', content } } )

  console.log( "🚀 ~ file: get-claude-response.ts:22 ~ getClaudeSummary ~ summary:", summary )

  return summary
}
export const streamClaudeResponse = async ( { prompt, system, message }: { prompt: string, system?: string, message: { role: 'user', content: string } } ) => {
  const result: any = streamText( {
    model: anthropic( 'claude-3-5-sonnet-20241022' ),

    system,
    prompt,
    messages: [message]
    // tools: 
  } )



  return streamObject( result )




}
export const getClaudeVisualization = async ( { prompt, message }: { prompt: string, message: { role: 'user', content: string } } ) => {
  return streamClaudeResponse( {
    system: researchNetworkMapperPrompt,
    prompt,
    message
  } )
}
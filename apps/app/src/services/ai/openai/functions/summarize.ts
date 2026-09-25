'use server'

import { DISCLOSURE_ASSISTANT_SYSTEM_PROMPT, SUMMARIZE_PROMPT } from '@/services/ai/prompts/summarize.prompt'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

/*
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the file about?' },
        {
          type: 'file',
          mimeType: 'application/pdf',
          data: fs.readFileSync('./data/example.pdf'),
        },
      ],
    },
  ],
*/



// DISCLOSURE_ASSISTANT_SYSTEM_PROMPT

export const summarize = async ( document: any ) => {


  const { text } = await generateText( {
    // @ts-ignore
    model: openai( 'gpt-4o' ),
    system: DISCLOSURE_ASSISTANT_SYSTEM_PROMPT,
    prompt: `${SUMMARIZE_PROMPT} ${document}`,
  } )

  console.log( "🚀 ~ file: summarize.ts:33 ~ summarize ~ text:", text )
  // const { object: notifications } = await generateObject( {
  //   model: openai( 'gpt-4-turbo-preview' ), // Using newer model that's compatible
  //   system: 'You generate three notifications for a messages app.',
  //   prompt: text,
  //   schema: z.object( {
  //     notifications: z.array(
  //       z.object( {
  //         name: z.string().describe( 'Name of a fictional person.' ),
  //         message: z.string().describe( 'Do not use emojis or links.' ),
  //         minutesAgo: z.number(),
  //       } ),
  //     ),
  //   } ),
  // } )

  return text
}
import { logger, task } from "@trigger.dev/sdk/v3"
import { generateText } from "ai"
// Install the package of the AI model you want to use, in this case OpenAI
import { openai } from "@ai-sdk/openai" // Ensure OPENAI_API_KEY environment variable is set

export const openaiTask = task( {
  id: "openai-text-generate",

  run: async ( payload: { prompt: string } ) => {
    const chatCompletion = await generateText( {
      model: openai( "gpt-4-turbo" ),
      // Add a system message which will be included with the prompt
      system: "You are a friendly assistant!",
      // The prompt passed in from the payload
      prompt: payload.prompt,
    } )

    // Log the generated text
    logger.log( "chatCompletion text:" + chatCompletion.text )

    return chatCompletion
  },
} )

import { createMem0 } from "@mem0/vercel-ai-provider"

export const memoryAgent = createMem0( {
  provider: "openai",
  mem0ApiKey: process.env.NEXT_PUBLIC_MEM0_API_KEY,
  apiKey: process.env.OPENAI_API_KEY,
  config: {
    compatibility: "strict",
  },
} );




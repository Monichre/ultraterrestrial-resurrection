import { askDisclosureAgent } from "@/services/ai/openai/disclosure-agent"

export async function POST( req: Request ) {
  const input: {
    threadId: string | null
    message: string
  } = await req.json()
  return askDisclosureAgent( input )

}

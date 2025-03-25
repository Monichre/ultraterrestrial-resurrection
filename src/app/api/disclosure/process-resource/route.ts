import { askDisclosureAgent } from "@/services/ai/openai/disclosure-agent"

export async function POST( req: Request ) {
  const input: {
    resourceUrl: string | null
    metadata?: Record<string, any>
  } = await req.json()
  return askDisclosureAgent( input )

}

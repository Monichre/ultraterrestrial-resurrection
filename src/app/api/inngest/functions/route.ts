import { aibot } from "@/services/inngest/ai-flow"
import { inngest } from "@/services/inngest/inngest-server.client"
import { serve } from "inngest/next"

// @ts-ignore
export const { GET, POST, PUT } = serve( inngest, [aibot] )

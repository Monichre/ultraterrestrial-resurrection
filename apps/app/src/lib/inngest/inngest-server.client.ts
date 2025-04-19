import { Inngest } from "inngest"

import type { Message } from "ai"
import { EventSchemas } from "inngest"

// Start Generation Here
export const inngest = new Inngest( {
  id: "Inngest + PartyKit: OpenAI Function invocation app",
  schemas: new EventSchemas().fromRecord<Events>(),
} )

type ChatStarted = {
  data: {
    requestId: string
    messages: Message[]
  }
}

type ChatCancelled = {
  data: {
    requestId: string
  }
}

type ChatConfirmed = {
  data: {
    requestId: string
    confirm: boolean
  }
}

type Events = {
  "api/collab.started": ChatStarted
  "api/collab.cancelled": ChatCancelled
  "api/collab.confirmed": ChatConfirmed
}

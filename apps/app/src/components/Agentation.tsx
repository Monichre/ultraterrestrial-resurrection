'use client'

import {Agentation as AgentationToolbar} from 'agentation'

const AGENTATION_ENDPOINT = 'http://localhost:4747'

export function Agentation() {
  return (
    <AgentationToolbar
      endpoint={AGENTATION_ENDPOINT}
      onSessionCreated={(sessionId) => {
        console.log('[agentation] session started:', sessionId)
      }}
    />
  )
}

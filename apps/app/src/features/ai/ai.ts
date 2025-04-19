import { createAI } from 'ai/rsc'
import { submitMessage } from './api/actions'

export const AI = createAI( {
  actions: {
    submitMessage,
  },
  initialAIState: [],
  initialUIState: [],
} )
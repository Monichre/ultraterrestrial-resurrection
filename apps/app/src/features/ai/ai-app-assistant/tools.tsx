import {makeAssistantToolUI} from '@assistant-ui/react'
import {
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from '@assistant-ui/react'

import {
  ComposerAttachments,
  ComposerAddAttachment,
  UserMessageAttachments,
} from '@/components/assistant-ui/attachment'

import type {AttachmentAdapter} from '@assistant-ui/react'

export type WebSearchArgs = {
  query: string
}

export type WebSearchResult = {
  title: string
  description: string
  url: string
}

export const WebSearchToolUI = makeAssistantToolUI<WebSearchArgs, WebSearchResult>({
  toolName: 'web_search',
  render: ({args, status}) => {
    return <p>web_search({args.query})</p>
  },
})

export class CustomAttachmentAdapter implements AttachmentAdapter {
  accept = 'image/*, .pdf'

  async add({file}) {
    // Custom logic for adding an attachment
    // ...
  }

  async send(attachment) {
    // Custom logic for sending an attachment
    // ...
  }

  async remove() {
    // Custom logic for removing an attachment
    // ...
  }
}

export const useWebSearchToolUI = makeAssistantToolUI<WebSearchArgs, WebSearchResult>({
  toolName: 'web_search',
  render: ({args, status}) => {
    return <p>web_search({args.query})</p>
  },
})

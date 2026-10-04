'use client'

import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  CompositeAttachmentAdapter,
  makeAssistantToolUI,
  MessagePrimitive,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from '@assistant-ui/react'
import {useChatRuntime} from '@assistant-ui/react-ai-sdk'
import {Thread} from '@/components/assistant-ui/thread'
import {ThreadList} from '@/components/assistant-ui/thread-list'
import {CustomAttachmentAdapter, WebSearchToolUI} from '@/features/ai/ai-app-assistant/tools'

// Use it in your CompositeAttachmentAdapter
const compositeAdapter = new CompositeAttachmentAdapter([
  new CustomAttachmentAdapter(),
  new SimpleTextAttachmentAdapter(),
])

const Composer = () => {
  return (
    <ComposerPrimitive.Root className='...'>
      <ComposerAttachments />
      <ComposerAddAttachment />
      {/* ... other composer elements */}
    </ComposerPrimitive.Root>
  )
}

const UserMessage = () => {
  return (
    <MessagePrimitive.Root className='...'>
      <UserMessageAttachments />
      {/* ... other message elements */}
    </MessagePrimitive.Root>
  )
}

const Assistant = () => {
  const runtime = useChatRuntime({
    api: '/api/chat',
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className='grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4'>
        <ThreadList />
        <Thread />
      </div>
      <WebSearchToolUI />
    </AssistantRuntimeProvider>
  )

  // ... rest of your component
}

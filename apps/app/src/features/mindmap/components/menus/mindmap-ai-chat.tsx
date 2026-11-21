'use client'

import { useState } from 'react'
import { ChatWithContext } from '@/components/ui/chat/chat-with-context'
import { MessageCircle } from 'lucide-react'

export const MindMapAiChat = () => {
  return (
    <div className='h-[600px] relative'>
      <ChatWithContext 
        apiEndpoint="/api/disclosure/mindmap"
        title="Disclosure Assistant"
        icon={<MessageCircle className="h-5 w-5" />}
        contextSummary="This AI assistant can analyze websites and documents related to UFO/UAP disclosure. Add a resource to begin analyzing specific content."
      />
    </div>
  )
}

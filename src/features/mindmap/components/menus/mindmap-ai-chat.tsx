'use client'

import { ExpandableChat } from "@/components/ui/chat/expandable-chat"
import { useAssistant } from "ai/react"
import { useState } from "react"

export const MindMapAiChat = () => {
  const { status, messages, input, submitMessage, handleInputChange } = useAssistant( { api: '/api/disclosure/chat' } )
  const [isOpen, setIsOpen] = useState( false )

  return (
    <div className="h-[600px] relative">
      {/* {isOpen && <Button className="absolute bottom-0 right-0 bg-black text-white" onClick={() => setIsOpen( !isOpen )}><MessageCircleIcon className="h-5 w-5 stroke-1 text-white" /></Button>} */}
      <ExpandableChat />


      {/* <ChatMessageArea className="px-4 py-4 space-y-4">
        {messages.map( ( message ) => {
          if ( message.role !== "user" ) {
            return (
              <ChatMessage
                key={message.id}
                id={message.id}
                variant="bubble"
                type="incoming"
              >
                <ChatMessageAvatar imageSrc="/avatar-1.png" />
                <ChatMessageContent content={message.content} />
              </ChatMessage>
            )
          }
          return (
            <ChatMessage
              key={message.id}
              id={message.id}
              variant="bubble"
              type="outgoing"
            >
              <ChatMessageContent content={message.content} />
              <ChatMessageAvatar imageSrc="/avatar-1.png" />
            </ChatMessage>
          )
        } )}
      </ChatMessageArea>
      <div className="px-2 py-2 border-t">
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={submitMessage}
          loading={status === "in_progress"}
          onStop={stop}
        >
          <ChatInputTextArea placeholder="Type a message..." />
          <ChatInputSubmit />
        </ChatInput>
      </div> */}

    </div>

  )



  // <AiAssistedSearch />
}

//  ;<Button
//    variant='ghost'
//    size='icon'
//    className='text-zinc-100 rounded-full hover:bg-gray-600 hover:text-zinc-100 m-2'
//  >
//    <MessageCircleIcon className='h-5 w-5 stroke-1' />
//    <span className='sr-only'>Create a comment</span>
//  </Button>

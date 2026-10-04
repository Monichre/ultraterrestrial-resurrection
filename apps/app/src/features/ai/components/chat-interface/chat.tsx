
import { ChatTopbar } from '@/features/ai/components/chat-interface/chat-topbar'
import { ChatList } from './chat-list'
import React from 'react'

interface ChatProps {
  messages?: any[]
  selectedUser: any
  isMobile: boolean
}

export function Chat( { messages, selectedUser, isMobile }: ChatProps ) {
  const [messagesState, setMessages] = React.useState<any[]>( messages ?? [] )

  const sendMessage = ( newMessage: any ) => {
    setMessages( [...messagesState, newMessage] )
  }

  return (
    <div className='flex flex-col justify-between w-full h-full'>
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  )
}

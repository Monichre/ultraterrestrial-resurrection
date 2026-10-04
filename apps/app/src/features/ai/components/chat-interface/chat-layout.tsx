'use client'

import React, { useEffect, useState } from 'react'

import { cn } from '@/utils'

import { Chat } from './chat'
import { ChatSidebar } from '@/features/ai'


interface ChatLayoutProps {
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

// userData.map((user) => ({
//   name: user.name,
//   messages: user.messages ?? [],
//   avatar: user.avatar,
//   variant: selectedUser.name === user.name ? 'grey' : 'ghost',
// }))

export function ChatLayout( {
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps ) {
  const [isCollapsed, setIsCollapsed] = React.useState( defaultCollapsed )
  const [selectedUser, setSelectedUser] = React.useState()
  const [isMobile, setIsMobile] = useState( false )

  useEffect( () => {
    const checkScreenWidth = () => {
      setIsMobile( window.innerWidth <= 768 )
    }

    // Initial check
    checkScreenWidth()

    // Event listener for screen width changes
    window.addEventListener( 'resize', checkScreenWidth )

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener( 'resize', checkScreenWidth )
    }
  }, [] )

  return (
    <ChatSidebar
      isCollapsed={isCollapsed || isMobile}
      links={[]}
      isMobile={isMobile}
    />
    // <ResizablePanelGroup
    //   direction='horizontal'
    //   onLayout={(sizes: number[]) => {
    //     document.cookie = `react-resizable-panels:layout=${JSON.stringify(
    //       sizes
    //     )}`
    //   }}
    //   className='h-full items-stretch'
    // >
    //   <ResizablePanel
    //     defaultSize={defaultLayout[0]}
    //     collapsedSize={navCollapsedSize}
    //     collapsible={true}
    //     minSize={isMobile ? 0 : 24}
    //     maxSize={isMobile ? 8 : 30}
    //     onCollapse={() => {
    //       setIsCollapsed(true)
    //       document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
    //         true
    //       )}`
    //     }}
    //     onExpand={() => {
    //       setIsCollapsed(false)
    //       document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
    //         false
    //       )}`
    //     }}
    //     className={cn(
    //       isCollapsed &&
    //         'min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out'
    //     )}
    //   >

    //   </ResizablePanel>
    //   <ResizableHandle withHandle />
    //   <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
    //     <Chat
    //       messages={selectedUser.messages}
    //       selectedUser={selectedUser}
    //       isMobile={isMobile}
    //     />
    //   </ResizablePanel>
    // </ResizablePanelGroup>
  )
}

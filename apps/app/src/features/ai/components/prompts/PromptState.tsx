'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

const PromptStateContext = createContext<
  | {
    isGenerating: boolean
    setIsGenerating: ( value: boolean ) => void
  }
  | undefined
>( undefined )

export const AppStateProvider = ( { children }: { children: ReactNode } ) => {
  const [isGenerating, setIsGenerating] = useState( false )

  return (
    <PromptStateContext.Provider value={{ isGenerating, setIsGenerating }}>
      {children}
    </PromptStateContext.Provider>
  )
}

export const usePromptState = () => {
  const context = useContext( PromptStateContext )
  if ( !context ) {
    throw new Error( 'useAppState must be used within an AppStateProvider' )
  }
  return context
}

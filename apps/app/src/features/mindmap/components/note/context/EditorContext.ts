import { createContext } from 'react'

interface IEditorContext {
  isAiLoading: boolean
  aiError?: string | null
  setIsAiLoading: Function
  setAiError: Function
}

export const EditorContext = createContext<IEditorContext>({
  isAiLoading: false,
  aiError: null,
  setIsAiLoading: () => {},
  setAiError: () => {},
})

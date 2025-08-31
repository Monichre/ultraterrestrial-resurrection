// Minimal Storybook stub for @ai-sdk/react to prevent runtime errors in stories
// It mimics the hook shape we use across components.

export function useAssistant( options: any ) {
  return {
    status: 'idle' as const,
    messages: [],
    input: '',
    setInput: () => { },
    submitMessage: () => { },
    append: () => { },
    error: null as any,
  }
}

export type UIMessage = {
  id: string
  role: 'user' | 'assistant' | 'system' | 'data'
  content: string
}



// Minimal Storybook stub for @ai-sdk/rsc
export function useAIState() { return [[], () => {}] as const }
export function useUIState() { return [[], () => {}] as const }
export function useActions() { return {} }
export function useStreamableValue(x?: any) { return x }
export function useSyncUIState() { return [[], () => {}] as const }
export function readStreamableValue(x: any) { return x }

// Add no-op creators to satisfy imports
export function createStreamableUI() { return { value: null, update: () => {}, done: () => {} } }
export function createStreamableValue() { return { value: null, update: () => {}, done: () => {} } }

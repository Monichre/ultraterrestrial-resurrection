declare module '@db/src/xata-typescript-sdk/api' {
  export function searchXata( params: {
    query: string
    id?: string | null
    table?: string | null
  } ): Promise<{
    success: boolean
    searchResults?: any[]
    error?: string
  }>
}

declare module '@db/xata/client' {
  export const xata: any
}

declare module '@db/src/xata-typescript-sdk/models' {
  export * from '@db/xata-typescript-sdk/models'
} 
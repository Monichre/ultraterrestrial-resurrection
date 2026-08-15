export function debugLog(...args: any[]) {
  // Enable logs when NEXT_PUBLIC_DEBUG_LOGS is 'true'
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true') {
     
    console.log(...args)
  }
}


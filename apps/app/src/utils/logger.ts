export function debugLog(...args: any[]) {
  // Enable logs when NEXT_PUBLIC_DEBUG_LOGS is 'true'
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true') {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}


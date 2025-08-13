'use client'

import {SessionProvider} from '@/contexts/SessionContext'
import {LaunchPad, type LaunchPadProps} from './launchpad'

/**
 * LaunchPad component wrapped with SessionProvider for session management
 * Use this component instead of LaunchPad directly to enable session persistence
 * and background task processing
 */
export function LaunchPadWithSession(props: LaunchPadProps) {
  return (
    <SessionProvider>
      <LaunchPad {...props} />
    </SessionProvider>
  )
}

// Re-export types for convenience
export type {LaunchPadProps}

'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useSession } from '@/contexts/SessionContext'

interface UseSessionPersistenceOptions {
  autoSave?: boolean
  saveInterval?: number // milliseconds
  onSaveError?: ( error: Error ) => void
  onRestoreError?: ( error: Error ) => void
}

export function useSessionPersistence( options: UseSessionPersistenceOptions = {} ) {
  const {
    autoSave = true,
    saveInterval = 30000, // 30 seconds
    onSaveError,
    onRestoreError,
  } = options

  const { state, saveSession, restoreSession, clearSession } = useSession()
  const saveIntervalRef = useRef<number | null>( null )
  const lastSaveRef = useRef<Date>( new Date() )

  // Auto-save functionality
  useEffect( () => {
    if ( !autoSave ) return

    const performAutoSave = async () => {
      try {
        await saveSession()
        lastSaveRef.current = new Date()
        console.log( '💾 Auto-save completed' )
      } catch ( error ) {
        console.error( '❌ Auto-save failed:', error )
        if ( onSaveError && error instanceof Error ) {
          onSaveError( error )
        }
      }
    }

    // Set up interval for auto-save
    saveIntervalRef.current = window.setInterval( performAutoSave, saveInterval )

    return () => {
      if ( saveIntervalRef.current ) {
        clearInterval( saveIntervalRef.current )
      }
    }
  }, [autoSave, saveInterval, saveSession, onSaveError] )

  // Manual save with error handling
  const manualSave = useCallback( async () => {
    try {
      await saveSession()
      lastSaveRef.current = new Date()
      console.log( '💾 Manual save completed' )
      return true
    } catch ( error ) {
      console.error( '❌ Manual save failed:', error )
      if ( onSaveError && error instanceof Error ) {
        onSaveError( error )
      }
      return false
    }
  }, [saveSession, onSaveError] )

  // Restore with error handling
  const restore = useCallback( async () => {
    try {
      await restoreSession()
      console.log( '🔄 Session restored' )
      return true
    } catch ( error ) {
      console.error( '❌ Session restore failed:', error )
      if ( onRestoreError && error instanceof Error ) {
        onRestoreError( error )
      }
      return false
    }
  }, [restoreSession, onRestoreError] )

  // Clear session with confirmation
  const clearWithConfirmation = useCallback(
    async ( skipConfirmation = false ) => {
      if ( !skipConfirmation ) {
        const confirmed = window.confirm(
          'Are you sure you want to clear the current session? This will remove all conversation history and background tasks.'
        )
        if ( !confirmed ) return false
      }

      try {
        await clearSession()
        console.log( '🗑️ Session cleared' )
        return true
      } catch ( error ) {
        console.error( '❌ Session clear failed:', error )
        return false
      }
    },
    [clearSession]
  )

  // Get session statistics
  const getSessionStats = useCallback( () => {
    return {
      sessionId: state.sessionId,
      messageCount: state.messages.length,
      activeTaskCount: state.backgroundTasks.filter(
        ( task ) => task.status === 'running' || task.status === 'pending'
      ).length,
      completedTaskCount: state.backgroundTasks.filter( ( task ) => task.status === 'completed' ).length,
      lastActivity: state.lastActivity,
      lastSave: lastSaveRef.current,
      timeSinceLastSave: Date.now() - lastSaveRef.current.getTime(),
      sessionAge: Date.now() - new Date( state.sessionId ).getTime(),
    }
  }, [state] )

  // Check if session needs saving
  const needsSaving = useCallback( () => {
    const timeSinceLastSave = Date.now() - lastSaveRef.current.getTime()
    const timeSinceLastActivity = Date.now() - state.lastActivity.getTime()

    // Needs saving if there's been activity since last save and it's been more than 5 seconds
    return timeSinceLastActivity < timeSinceLastSave && timeSinceLastSave > 5000
  }, [state.lastActivity] )

  // Export session data
  const exportSession = useCallback( () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      sessionData: state,
      stats: getSessionStats(),
    }

    const blob = new Blob( [JSON.stringify( exportData, null, 2 )], {
      type: 'application/json',
    } )

    const url = URL.createObjectURL( blob )
    const link = document.createElement( 'a' )
    link.href = url
    link.download = `session-${state.sessionId}-${new Date().toISOString().split( 'T' )[0]}.json`
    document.body.appendChild( link )
    link.click()
    document.body.removeChild( link )
    URL.revokeObjectURL( url )

    console.log( '📥 Session exported' )
  }, [state, getSessionStats] )

  // Import session data
  const importSession = useCallback(
    async ( file: File ) => {
      try {
        const text = await file.text()
        const importData = JSON.parse( text )

        if ( importData.version && importData.sessionData ) {
          // Validate and restore session
          const confirmed = window.confirm(
            'Importing this session will replace your current session. Are you sure?'
          )

          if ( confirmed ) {
            await clearSession()
            // Note: You'd need to implement import logic in SessionContext
            console.log( '📤 Session import initiated' )
            return true
          }
        } else {
          throw new Error( 'Invalid session file format' )
        }
      } catch ( error ) {
        console.error( '❌ Session import failed:', error )
        if ( onRestoreError && error instanceof Error ) {
          onRestoreError( error )
        }
        return false
      }
      return false
    },
    [clearSession, onRestoreError]
  )

  return {
    // Core functions
    save: manualSave,
    restore,
    clear: clearWithConfirmation,

    // Session management
    exportSession,
    importSession,

    // Session info
    getStats: getSessionStats,
    needsSaving: needsSaving(),
    isAutoSaveEnabled: autoSave,
    saveInterval,
    lastSave: lastSaveRef.current,

    // Session state
    sessionId: state.sessionId,
    isActive: state.isActive,
    messageCount: state.messages.length,
    backgroundTaskCount: state.backgroundTasks.length,
  }
}
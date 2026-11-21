'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
  useRef,
} from 'react'
import {v4 as uuidv4} from 'uuid'

// Session data interfaces
export interface SessionMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface BackgroundTask {
  id: string
  type: 'enrichment' | 'search' | 'analysis' | 'connection'
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  title: string
  description?: string
  data?: any
  error?: string
  createdAt: Date
  completedAt?: Date
}

export interface SessionState {
  sessionId: string
  isActive: boolean
  messages: SessionMessage[]
  activeCommand: string | null
  selectedModel: string | null
  deepResearchEnabled: boolean
  backgroundTasks: BackgroundTask[]
  lastActivity: Date
  metadata: Record<string, any>
}

// Session actions
type SessionAction =
  | {type: 'INITIALIZE_SESSION'; payload: {sessionId?: string}}
  | {type: 'ADD_MESSAGE'; payload: SessionMessage}
  | {type: 'SET_ACTIVE_COMMAND'; payload: string | null}
  | {type: 'SET_SELECTED_MODEL'; payload: string | null}
  | {type: 'SET_DEEP_RESEARCH'; payload: boolean}
  | {type: 'ADD_BACKGROUND_TASK'; payload: Omit<BackgroundTask, 'id' | 'createdAt'>}
  | {type: 'UPDATE_BACKGROUND_TASK'; payload: {id: string; updates: Partial<BackgroundTask>}}
  | {type: 'REMOVE_BACKGROUND_TASK'; payload: string}
  | {type: 'UPDATE_ACTIVITY'}
  | {type: 'RESTORE_SESSION'; payload: SessionState}
  | {type: 'CLEAR_SESSION'}

// Initial state
const initialState: SessionState = {
  sessionId: '',
  isActive: false,
  messages: [],
  activeCommand: null,
  selectedModel: null,
  deepResearchEnabled: false,
  backgroundTasks: [],
  lastActivity: new Date(),
  metadata: {},
}

// Session reducer
function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'INITIALIZE_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId || uuidv4(),
        isActive: true,
        lastActivity: new Date(),
      }

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        lastActivity: new Date(),
      }

    case 'SET_ACTIVE_COMMAND':
      return {
        ...state,
        activeCommand: action.payload,
        lastActivity: new Date(),
      }

    case 'SET_SELECTED_MODEL':
      return {
        ...state,
        selectedModel: action.payload,
        lastActivity: new Date(),
      }

    case 'SET_DEEP_RESEARCH':
      return {
        ...state,
        deepResearchEnabled: action.payload,
        lastActivity: new Date(),
      }

    case 'ADD_BACKGROUND_TASK':
      const newTask: BackgroundTask = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date(),
      }
      return {
        ...state,
        backgroundTasks: [...state.backgroundTasks, newTask],
        lastActivity: new Date(),
      }

    case 'UPDATE_BACKGROUND_TASK':
      return {
        ...state,
        backgroundTasks: state.backgroundTasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                ...action.payload.updates,
                completedAt:
                  action.payload.updates.status === 'completed' ||
                  action.payload.updates.status === 'failed'
                    ? new Date()
                    : task.completedAt,
              }
            : task
        ),
        lastActivity: new Date(),
      }

    case 'REMOVE_BACKGROUND_TASK':
      return {
        ...state,
        backgroundTasks: state.backgroundTasks.filter((task) => task.id !== action.payload),
        lastActivity: new Date(),
      }

    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: new Date(),
      }

    case 'RESTORE_SESSION':
      return {
        ...action.payload,
        isActive: true,
        lastActivity: new Date(),
      }

    case 'CLEAR_SESSION':
      return {
        ...initialState,
        sessionId: uuidv4(),
        isActive: true,
        lastActivity: new Date(),
      }

    default:
      return state
  }
}

// Context interfaces
export interface SessionContextValue {
  state: SessionState
  dispatch: React.Dispatch<SessionAction>

  // Session management
  initializeSession: (sessionId?: string) => void
  clearSession: () => void
  saveSession: () => void
  restoreSession: () => void

  // Message management
  addMessage: (message: Omit<SessionMessage, 'id' | 'timestamp'>) => void

  // Command and model management
  setActiveCommand: (command: string | null) => void
  setSelectedModel: (model: string | null) => void
  setDeepResearch: (enabled: boolean) => void

  // Background task management
  addBackgroundTask: (task: Omit<BackgroundTask, 'id' | 'createdAt'>) => string
  updateBackgroundTask: (id: string, updates: Partial<BackgroundTask>) => void
  removeBackgroundTask: (id: string) => void
  getActiveTasks: () => BackgroundTask[]
  getCompletedTasks: () => BackgroundTask[]
}

// Create context
const SessionContext = createContext<SessionContextValue | null>(null)

// Session storage keys
const STORAGE_KEY = 'uap-launchpad-session'
const STORAGE_VERSION = '1.0'

// Session provider
export function SessionProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)
  const backgroundProcessorRef = useRef<number | null>(null)

  // Initialize session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY)
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession)
        if (parsed.version === STORAGE_VERSION) {
          // Restore dates from strings
          const restoredState: SessionState = {
            ...parsed.data,
            lastActivity: new Date(parsed.data.lastActivity),
            messages: parsed.data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
            backgroundTasks: parsed.data.backgroundTasks.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
            })),
          }
          dispatch({type: 'RESTORE_SESSION', payload: restoredState})
          console.log('🔄 Session restored from storage')
        } else {
          console.log('📄 Session version mismatch, creating new session')
          dispatch({type: 'INITIALIZE_SESSION', payload: {}})
        }
      } catch (error) {
        console.error('❌ Failed to restore session:', error)
        dispatch({type: 'INITIALIZE_SESSION', payload: {}})
      }
    } else {
      dispatch({type: 'INITIALIZE_SESSION', payload: {}})
    }
  }, [])

  // Auto-save session on state changes
  useEffect(() => {
    if (state.isActive && state.sessionId) {
      const debounceTimer = setTimeout(() => {
        saveSession()
      }, 1000) // Debounce saves to avoid excessive localStorage writes

      return () => clearTimeout(debounceTimer)
    }
  }, [state])

  // Background task processor
  useEffect(() => {
    const processPendingTasks = () => {
      const pendingTasks = state.backgroundTasks.filter((task) => task.status === 'pending')

      pendingTasks.forEach((task) => {
        // Start processing task
        dispatch({
          type: 'UPDATE_BACKGROUND_TASK',
          payload: {id: task.id, updates: {status: 'running', progress: 0}},
        })

        // Simulate background processing
        simulateBackgroundTask(task.id, task.type)
      })
    }

    if (state.backgroundTasks.some((task) => task.status === 'pending')) {
      backgroundProcessorRef.current = window.setTimeout(processPendingTasks, 500)
    }

    return () => {
      if (backgroundProcessorRef.current) {
        clearTimeout(backgroundProcessorRef.current)
      }
    }
  }, [state.backgroundTasks])

  // Simulate background task processing
  const simulateBackgroundTask = async (taskId: string, type: string) => {
    const duration = type === 'enrichment' ? 3000 : type === 'search' ? 2000 : 1500
    const steps = 20
    const stepDuration = duration / steps

    for (let i = 1; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration))

      const progress = (i / steps) * 100
      dispatch({
        type: 'UPDATE_BACKGROUND_TASK',
        payload: {
          id: taskId,
          updates: {progress},
        },
      })
    }

    // Complete the task
    dispatch({
      type: 'UPDATE_BACKGROUND_TASK',
      payload: {
        id: taskId,
        updates: {
          status: 'completed',
          progress: 100,
          data: {result: `${type} completed successfully`},
        },
      },
    })

    console.log(`✅ Background task ${type} completed`)
  }

  // Session management functions
  const initializeSession = useCallback((sessionId?: string) => {
    dispatch({type: 'INITIALIZE_SESSION', payload: {sessionId}})
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({type: 'CLEAR_SESSION'})
    console.log('🗑️ Session cleared')
  }, [])

  const saveSession = useCallback(() => {
    try {
      const sessionData = {
        version: STORAGE_VERSION,
        data: state,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.error('❌ Failed to save session:', error)
      // Handle storage quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('⚠️ Storage quota exceeded, clearing old sessions')
        // Could implement cleanup strategy here
      }
    }
  }, [state])

  const restoreSession = useCallback(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY)
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession)
        dispatch({type: 'RESTORE_SESSION', payload: parsed.data})
      } catch (error) {
        console.error('❌ Failed to restore session:', error)
      }
    }
  }, [])

  // Message management
  const addMessage = useCallback((message: Omit<SessionMessage, 'id' | 'timestamp'>) => {
    const fullMessage: SessionMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date(),
    }
    dispatch({type: 'ADD_MESSAGE', payload: fullMessage})
  }, [])

  // Command and model management
  const setActiveCommand = useCallback((command: string | null) => {
    dispatch({type: 'SET_ACTIVE_COMMAND', payload: command})
  }, [])

  const setSelectedModel = useCallback((model: string | null) => {
    dispatch({type: 'SET_SELECTED_MODEL', payload: model})
  }, [])

  const setDeepResearch = useCallback((enabled: boolean) => {
    dispatch({type: 'SET_DEEP_RESEARCH', payload: enabled})
  }, [])

  // Background task management
  const addBackgroundTask = useCallback((task: Omit<BackgroundTask, 'id' | 'createdAt'>) => {
    const taskId = uuidv4()
    dispatch({
      type: 'ADD_BACKGROUND_TASK',
      payload: {
        ...task,
        id: taskId,
        createdAt: new Date(),
      } as any,
    })
    return taskId
  }, [])

  const updateBackgroundTask = useCallback((id: string, updates: Partial<BackgroundTask>) => {
    dispatch({type: 'UPDATE_BACKGROUND_TASK', payload: {id, updates}})
  }, [])

  const removeBackgroundTask = useCallback((id: string) => {
    dispatch({type: 'REMOVE_BACKGROUND_TASK', payload: id})
  }, [])

  const getActiveTasks = useCallback(() => {
    return state.backgroundTasks.filter(
      (task) => task.status === 'running' || task.status === 'pending'
    )
  }, [state.backgroundTasks])

  const getCompletedTasks = useCallback(() => {
    return state.backgroundTasks.filter((task) => task.status === 'completed')
  }, [state.backgroundTasks])

  const contextValue: SessionContextValue = {
    state,
    dispatch,
    initializeSession,
    clearSession,
    saveSession,
    restoreSession,
    addMessage,
    setActiveCommand,
    setSelectedModel,
    setDeepResearch,
    addBackgroundTask,
    updateBackgroundTask,
    removeBackgroundTask,
    getActiveTasks,
    getCompletedTasks,
  }

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>
}

// Hook to use session context
export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

// Hook for session persistence
export function useSessionPersistence() {
  const {saveSession, restoreSession, clearSession} = useSession()

  return {
    saveSession,
    restoreSession,
    clearSession,
  }
}

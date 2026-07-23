'use client'

import type React from 'react'
import {createContext, useContext, useState, useCallback, useEffect, useMemo} from 'react'
import type {Note} from '@/features/mindmap/components/status-ui/session-notes'
import {useToast} from '@/components/ui/use-toast'

// Minimal message shape needed to convert an AI response into a session note.
// Previously imported from the now-deleted mindmap-bottom-menu/MindMapMessages.tsx.
interface Message {
  id: string
  content: string
}

// Interface for Xata save options
interface SaveToXataOptions {
  title: string
  content: string
  tags: string[]
  richText?: boolean
}

// Context interface
interface SessionNotesContextValue {
  notes: Note[]
  selectedNote: Note | null
  isOpen: boolean
  isNestedOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  setIsNestedOpen: (isOpen: boolean) => void
  setSelectedNote: (note: Note | null) => void
  addNote: (note: Partial<Note>) => Note
  addNoteFromMessage: (message: Message) => Note
  saveToXata: (options: SaveToXataOptions) => Promise<boolean>
  togglePin: (id: string) => void
}

// Create the context
const SessionNotesContext = createContext<SessionNotesContextValue | undefined>(undefined)

// Helper function to convert markdown to HTML for rich text
const markdownToHtml = (markdown: string): string => {
  // This is a very basic implementation
  // In a real application, you'd use a proper markdown parser like remark
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/\`\`\`(.*?)\`\`\`/gs, '<pre><code>$1</code></pre>') // Code blocks
    .replace(/\`(.*?)\`/g, '<code>$1</code>') // Inline code
    .replace(/\n\n/g, '</p><p>') // Paragraphs
    .replace(/\n/g, '<br>') // Line breaks
    .replace(/#{3} (.*?)$/gm, '<h3>$1</h3>') // H3
    .replace(/#{2} (.*?)$/gm, '<h2>$1</h2>') // H2
    .replace(/# (.*?)$/gm, '<h1>$1</h1>') // H1
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // Links
}

// Provider component
export const SessionNotesProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isNestedOpen, setIsNestedOpen] = useState(false)
  const {toast} = useToast()

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('session-notes')
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes)
        if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
          setNotes(parsedNotes)
        }
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error)
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('session-notes', JSON.stringify(notes))
    }
  }, [notes])

  // Toggle pin status for a note
  const togglePin = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? {...note, isPinned: !note.isPinned} : note))
    )
  }, [])

  // Add a new note
  const addNote = useCallback((note: Partial<Note>): Note => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: note.title || 'New Note',
      content: note.content || '',
      tags: note.tags || ['new'],
      timestamp: note.timestamp || new Date().toISOString(),
      isPinned: note.isPinned || false,
      sourceMessageId: note.sourceMessageId,
    }

    setNotes((prev) => [newNote, ...prev])
    return newNote
  }, [])

  // Add a note from a message
  const addNoteFromMessage = useCallback(
    (message: Message): Note => {
      const newNote = addNote({
        title: `AI Response ${new Date().toLocaleTimeString()}`,
        content: message.content,
        tags: ['ai-response', 'mind-map'],
        sourceMessageId: message.id,
      })

      toast({
        title: 'Note Added',
        description: 'AI response saved as a session note',
      })

      // Open the drawer and show the new note
      setIsOpen(true)
      setSelectedNote(newNote)
      setIsNestedOpen(true)

      return newNote
    },
    [addNote, toast, setIsOpen, setSelectedNote, setIsNestedOpen]
  )

  // Save a note to Xata
  const saveToXata = useCallback(
    async (options: SaveToXataOptions): Promise<boolean> => {
      try {
        // Process content based on richText option
        const processedContent = options.richText
          ? markdownToHtml(options.content) // Convert to HTML if rich text is enabled
          : options.content

        // Call the API to save the note
        const response = await fetch('/api/user-notes', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            title: options.title,
            content: options.content,
            richContent: options.richText ? processedContent : null,
            tags: options.tags,
            richText: options.richText || false,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to save to Xata: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        toast({
          title: 'Saved to Knowledge Base',
          description: `Note "${options.title}" has been saved to your permanent knowledge base`,
        })

        return true
      } catch (error) {
        console.error('Error saving to Xata:', error)
        toast({
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Failed to save note to knowledge base',
          variant: 'destructive',
        })
        return false
      }
    },
    [toast]
  )

  // Create the context value
  const contextValue = useMemo(
    () => ({
      notes,
      selectedNote,
      isOpen,
      isNestedOpen,
      setIsOpen,
      setIsNestedOpen,
      setSelectedNote,
      addNote,
      addNoteFromMessage,
      saveToXata,
      togglePin,
    }),
    [notes, selectedNote, isOpen, isNestedOpen, addNote, addNoteFromMessage, saveToXata, togglePin]
  )

  return (
    <SessionNotesContext.Provider value={contextValue}>{children}</SessionNotesContext.Provider>
  )
}

// Custom hook to use the context
export const useSessionNotes = (): SessionNotesContextValue => {
  const context = useContext(SessionNotesContext)
  if (context === undefined) {
    throw new Error('useSessionNotes must be used within a SessionNotesProvider')
  }
  return context
}

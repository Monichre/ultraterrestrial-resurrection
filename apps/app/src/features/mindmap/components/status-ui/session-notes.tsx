'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Plus, 
  Star, 
  Save, 
  Pin, 
  Edit3,
  Search,
  Clock,
  Tag,
  Download,
  Share2,
  Zap
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Mention } from '@tiptap/extension-mention'

// Session Note Interface
export interface SessionNote {
  id: string
  title: string
  content: string
  timestamp: string
  isPinned: boolean
  tags: string[]
  pinnedEntities?: string[]
}

// RAG Integration Hook (placeholder for future implementation)
const useRAGIntegration = () => {
  const search = async (query: string) => {
    // TODO: Implement RAG search integration
    return []
  }
  
  const analyze = async (content: string) => {
    // TODO: Implement content analysis
    return { entities: [], topics: [], summary: '' }
  }

  return { search, analyze }
}

interface SessionNotesProps {
  onPinEntity?: (entityId: string) => void
  pinnedEntities?: string[]
}

export function SessionNotes({ onPinEntity, pinnedEntities = [] }: SessionNotesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [notes, setNotes] = useState<SessionNote[]>([
    {
      id: '1',
      title: 'Initial Research Observations',
      content: 'Beginning analysis of UAP sighting patterns. Notable clustering in Pacific Northwest region.',
      timestamp: new Date().toISOString(),
      isPinned: true,
      tags: ['research', 'initial', 'patterns'],
      pinnedEntities: ['entity-001', 'entity-002']
    }
  ])
  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  const { search, analyze } = useRAGIntegration()

  // TipTap Editor Configuration
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Enter your research notes here...',
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded',
        },
        suggestion: {
          items: ({ query }) => {
            // TODO: Integrate with RAG search
            return [
              'Project Blue Book',
              'Roswell Incident',
              'Phoenix Lights',
              'Tic Tac UAP'
            ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
          },
        },
      }),
    ],
    content: selectedNote?.content || '',
    onUpdate: ({ editor }) => {
      if (selectedNote) {
        setSelectedNote({
          ...selectedNote,
          content: editor.getHTML()
        })
      }
    },
  })

  useEffect(() => {
    if (editor && selectedNote) {
      editor.commands.setContent(selectedNote.content)
    }
  }, [selectedNote, editor])

  const createNewNote = () => {
    const newNote: SessionNote = {
      id: Date.now().toString(),
      title: 'New Research Note',
      content: '',
      timestamp: new Date().toISOString(),
      isPinned: false,
      tags: ['draft'],
      pinnedEntities: []
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setIsEditing(true)
  }

  const saveNote = () => {
    if (selectedNote) {
      setNotes(notes.map(note => 
        note.id === selectedNote.id ? selectedNote : note
      ))
      setIsEditing(false)
    }
  }

  const togglePin = (noteId: string) => {
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ))
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
    }
  }

  // Tab animation for hover effect
  const tabVariants = {
    initial: { x: 0 },
    hover: {
      x: -8,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  }

  return (
    <>
      {/* Retro Tab */}
      <motion.div
        className="fixed right-0 top-[130px] z-40 w-12 h-24 bg-black border-l border-y border-zinc-800 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-lg"
        variants={tabVariants}
        animate={isHovered ? 'hover' : 'initial'}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.95 }}
      >
        <FileText className="text-zinc-400 w-5 h-5" />
      </motion.div>

      {/* Main Terminal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-[480px] bg-black border-l border-zinc-800 z-50 font-mono"
          >
            {/* Terminal Header */}
            <div className="border-b border-zinc-800 p-4 bg-zinc-950">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white text-xs tracking-widest"
                >
                  [ CLOSE ]
                </button>
              </div>
              <div className="text-zinc-300 text-sm tracking-wider">
                RESEARCH NOTES TERMINAL
              </div>
              <div className="text-zinc-600 text-xs">
                {notes.length} notes • {notes.filter(n => n.isPinned).length} pinned
              </div>
            </div>

            <div className="flex h-[calc(100vh-120px)]">
              {/* Notes List Panel */}
              <div className="w-48 border-r border-zinc-800 bg-zinc-950 flex flex-col">
                {/* Create Note Button */}
                <button
                  onClick={createNewNote}
                  className="m-2 p-2 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-colors text-xs tracking-wide flex items-center justify-center"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  NEW NOTE
                </button>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      className={`p-2 border cursor-pointer transition-colors group ${
                        selectedNote?.id === note.id
                          ? 'border-zinc-600 bg-zinc-800'
                          : 'border-zinc-800 hover:bg-zinc-900'
                      }`}
                      onClick={() => setSelectedNote(note)}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-xs text-zinc-300 font-medium truncate">
                          {note.title}
                        </div>
                        <div className="flex items-center space-x-1">
                          {note.isPinned && (
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                          )}
                          {note.pinnedEntities && note.pinnedEntities.length > 0 && (
                            <Pin className="w-2.5 h-2.5 text-blue-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-zinc-500 mb-1 line-clamp-2">
                        {note.content.replace(/<[^>]*>/g, '').slice(0, 60)}...
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="text-[8px] px-1 py-0.5 bg-zinc-800 text-zinc-400 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <time className="text-[8px] text-zinc-600">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </time>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Editor Panel */}
              <div className="flex-1 flex flex-col">
                {selectedNote ? (
                  <>
                    {/* Note Header */}
                    <div className="border-b border-zinc-800 p-3 bg-zinc-950">
                      <div className="flex items-center justify-between mb-2">
                        {isEditing ? (
                          <input
                            value={selectedNote.title}
                            onChange={(e) => setSelectedNote({
                              ...selectedNote,
                              title: e.target.value
                            })}
                            className="bg-transparent text-zinc-300 text-sm font-medium border-b border-zinc-700 focus:border-zinc-500 outline-none"
                          />
                        ) : (
                          <h3 className="text-zinc-300 text-sm font-medium">
                            {selectedNote.title}
                          </h3>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-zinc-500 hover:text-zinc-300"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => togglePin(selectedNote.id)}
                            className={`${selectedNote.isPinned ? 'text-yellow-500' : 'text-zinc-500'} hover:text-yellow-400`}
                          >
                            <Star className="w-3 h-3" fill={selectedNote.isPinned ? 'currentColor' : 'none'} />
                          </button>
                          {isEditing && (
                            <button
                              onClick={saveNote}
                              className="text-zinc-500 hover:text-green-400"
                            >
                              <Save className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center space-x-3 text-[10px] text-zinc-600">
                        <div className="flex items-center">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          {new Date(selectedNote.timestamp).toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <Tag className="w-2.5 h-2.5 mr-1" />
                          {selectedNote.tags.length} tags
                        </div>
                        {selectedNote.pinnedEntities && selectedNote.pinnedEntities.length > 0 && (
                          <div className="flex items-center">
                            <Pin className="w-2.5 h-2.5 mr-1" />
                            {selectedNote.pinnedEntities.length} pinned
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rich Text Editor */}
                    <div className="flex-1 relative">
                      {isEditing ? (
                        <div className="h-full">
                          <EditorContent 
                            editor={editor}
                            className="h-full prose prose-invert prose-sm max-w-none p-4 text-zinc-300 focus-within:outline-none"
                          />
                          
                          {/* Editor Toolbar */}
                          <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-[10px]">
                            <button
                              onClick={() => editor?.chain().focus().toggleBold().run()}
                              className={`px-2 py-1 border border-zinc-700 hover:bg-zinc-800 ${
                                editor?.isActive('bold') ? 'bg-zinc-700' : ''
                              }`}
                            >
                              B
                            </button>
                            <button
                              onClick={() => editor?.chain().focus().toggleItalic().run()}
                              className={`px-2 py-1 border border-zinc-700 hover:bg-zinc-800 ${
                                editor?.isActive('italic') ? 'bg-zinc-700' : ''
                              }`}
                            >
                              I
                            </button>
                            <button
                              onClick={() => editor?.chain().focus().toggleBulletList().run()}
                              className={`px-2 py-1 border border-zinc-700 hover:bg-zinc-800 ${
                                editor?.isActive('bulletList') ? 'bg-zinc-700' : ''
                              }`}
                            >
                              •
                            </button>
                            <span className="text-zinc-600 ml-2">
                              Use @ to mention entities
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full p-4 overflow-y-auto">
                          <div
                            className="prose prose-invert prose-sm max-w-none text-zinc-300"
                            dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Terminal Footer */}
                    <div className="border-t border-zinc-800 p-2 bg-zinc-950 flex items-center justify-between text-[10px] text-zinc-600">
                      <div className="flex items-center space-x-3">
                        <span>RAG STATUS: ACTIVE</span>
                        <span>ENTITIES: {pinnedEntities.length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="hover:text-zinc-400 flex items-center">
                          <Download className="w-3 h-3 mr-1" />
                          EXPORT
                        </button>
                        <button className="hover:text-zinc-400 flex items-center">
                          <Share2 className="w-3 h-3 mr-1" />
                          SHARE
                        </button>
                        <button className="hover:text-zinc-400 flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          AI ASSIST
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-600">
                    <div className="text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Select a note to view</p>
                      <p className="text-xs">or create a new one</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

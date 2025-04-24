'use client'

import {useState, useEffect} from 'react'
import {Drawer} from 'vaul-base'
import {motion} from 'framer-motion'
import {
  FileText,
  BookOpen,
  PlusCircle,
  Star,
  Edit3,
  Tag,
  Clock,
  Save,
  FileTextIcon,
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useToast} from '@/components/ui/use-toast'
import type {Message} from '@/features/mindmap/components/menus/mindmap-bottom-menu/MindMapMessages'
import {useSessionNotes} from '@/contexts/mindmap/session-notes-context'
import {Switch} from '@/components/ui/switch'
import {Label} from '@/components/ui/label'

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  timestamp: string
  isPinned?: boolean
  sourceMessageId?: string
}

// Types for Xata integration
type SaveToXataOptions = {
  title: string
  content: string
  tags: string[]
  richText?: boolean
}

export const SessionNotes = () => {
  // Use the context instead of local state
  const {
    notes,
    selectedNote,
    isOpen,
    isNestedOpen,
    setIsOpen,
    setIsNestedOpen,
    setSelectedNote,
    addNote,
    saveToXata,
    togglePin,
  } = useSessionNotes()

  const [isHovered, setIsHovered] = useState(false)
  const [useRichText, setUseRichText] = useState(false)
  const {toast} = useToast()

  // Create a new note through the context
  const createNewNote = () => {
    const newNote = addNote({
      title: 'New Session Note',
      content: 'Enter your observations here...',
      tags: ['new', 'draft'],
    })

    setSelectedNote(newNote)
    setIsNestedOpen(true)
  }

  // Handle saving to Knowledge Base with rich text option
  const handleSaveToKB = async (note: Note) => {
    await saveToXata({
      title: note.title,
      content: note.content,
      tags: note.tags,
      richText: useRichText,
    })
  }

  // Tab animation for hover effect
  const tabVariants = {
    initial: {
      x: 0,
    },
    hover: {
      x: -5,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  }

  return (
    <>
      <motion.div
        className='fixed right-0 top-[130px] z-40 w-12 h-24 bg-black/40 backdrop-blur-sm border-l border-y border-[#adf0dd]/30 rounded-l-md flex items-center justify-center cursor-pointer shadow-lg'
        variants={tabVariants}
        animate={isHovered ? 'hover' : 'initial'}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
        whileTap={{scale: 0.95}}>
        <FileText className='text-[#adf0dd] w-5 h-5' />
      </motion.div>

      {/* Main Drawer */}
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen} direction='right' dismissible>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 bg-black/70' />

          <Drawer.Content className='bg-black/30 backdrop-blur-sm border border-[#adf0dd]/30 fixed inset-y-0 right-0 h-full w-[32rem] rounded-l-md shadow-[0_0_15px_rgba(173,240,221,0.15)]'>
            <div className='flex flex-col h-full p-4'>
              {/* Header */}
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-[#adf0dd] font-mono text-lg'>SESSION NOTES</h2>
                <button
                  type='button'
                  className='text-[#adf0dd]/80 hover:text-[#adf0dd] font-mono p-2'
                  onClick={() => setIsOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsOpen(false)
                  }}>
                  [ CLOSE ]
                </button>
              </div>

              {/* Create New Note Button */}
              <div className='mb-4'>
                <Button
                  className='w-full bg-black/50 border border-[#adf0dd]/30 text-[#adf0dd] hover:bg-[#adf0dd]/10 font-mono'
                  onClick={createNewNote}>
                  <PlusCircle className='w-4 h-4 mr-2' />
                  Create New Note
                </Button>
              </div>

              {/* Notes List */}
              <div className='space-y-2 flex-grow overflow-y-auto pr-2 mb-4'>
                {notes.map((note) => (
                  <button
                    key={note.id}
                    type='button'
                    className={`bg-black/50 border ${
                      note.isPinned ? 'border-[#adf0dd]/60' : 'border-[#adf0dd]/20'
                    } rounded-md p-3 cursor-pointer hover:bg-[#adf0dd]/5 transition-colors relative group w-full text-left`}
                    onClick={() => setSelectedNote(note)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelectedNote(note)
                    }}>
                    <div className='flex justify-between items-start mb-1'>
                      <h3 className='text-[#adf0dd] font-mono text-sm'>{note.title}</h3>
                      <div className='flex space-x-1'>
                        <button
                          type='button'
                          className={`text-${note.isPinned ? '[#adf0dd]' : 'neutral-500'} opacity-${
                            note.isPinned ? '100' : '50'
                          } hover:opacity-100`}
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePin(note.id)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation()
                              togglePin(note.id)
                            }
                          }}>
                          <Star className='w-3.5 h-3.5' fill={note.isPinned ? '#adf0dd' : 'none'} />
                        </button>
                      </div>
                    </div>
                    <p className='text-[#adf0dd]/70 font-mono text-xs line-clamp-2 mb-2'>
                      {note.content}
                    </p>
                    <div className='flex justify-between items-center'>
                      <div className='flex space-x-1'>
                        {note.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className='text-[#adf0dd]/60 font-mono text-[10px] px-1.5 py-0.5 bg-[#adf0dd]/10 rounded-sm'>
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 2 && (
                          <span className='text-[#adf0dd]/60 font-mono text-[10px] px-1.5 py-0.5'>
                            +{note.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <time className='text-[#adf0dd]/40 font-mono text-[10px]'>
                        {new Date(note.timestamp).toLocaleDateString()}
                      </time>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nested Drawer for Note Detail */}
            <Drawer.NestedRoot open={isNestedOpen} onOpenChange={setIsNestedOpen} direction='right'>
              <Drawer.Portal>
                <Drawer.Overlay className='fixed inset-0 bg-black/40' />
                <Drawer.Content className='bg-black/30 backdrop-blur-sm border border-[#adf0dd]/30 fixed inset-y-0 right-0 h-full w-[32rem] rounded-l-md shadow-[0_0_15px_rgba(173,240,221,0.15)] z-50'>
                  {selectedNote && (
                    <div className='flex flex-col h-full p-4'>
                      {/* Note Detail Header */}
                      <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-[#adf0dd] font-mono text-lg flex items-center'>
                          <BookOpen className='w-4 h-4 mr-2' />
                          NOTE DETAILS
                        </h2>
                        <button
                          type='button'
                          className='text-[#adf0dd]/80 hover:text-[#adf0dd] font-mono p-2'
                          onClick={() => setIsNestedOpen(false)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setIsNestedOpen(false)
                          }}>
                          [ BACK ]
                        </button>
                      </div>

                      {/* Note Title */}
                      <div className='mb-4 flex items-center justify-between'>
                        <h3 className='text-[#adf0dd] font-mono text-xl'>{selectedNote.title}</h3>
                        <div className='flex space-x-2'>
                          <button
                            type='button'
                            className='text-[#adf0dd]/80 hover:text-[#adf0dd]'
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') console.log('Edit note')
                            }}>
                            <Edit3 className='w-4 h-4' />
                          </button>
                          <button
                            type='button'
                            className={`text-${
                              selectedNote.isPinned ? '[#adf0dd]' : '[#adf0dd]/60'
                            }`}
                            onClick={() => togglePin(selectedNote.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') togglePin(selectedNote.id)
                            }}>
                            <Star
                              className='w-4 h-4'
                              fill={selectedNote.isPinned ? '#adf0dd' : 'none'}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Note Metadata */}
                      <div className='flex space-x-4 mb-4 text-[#adf0dd]/60 font-mono text-xs'>
                        <div className='flex items-center'>
                          <Clock className='w-3 h-3 mr-1' />
                          <time>{new Date(selectedNote.timestamp).toLocaleString()}</time>
                        </div>
                        <div className='flex items-center'>
                          <Tag className='w-3 h-3 mr-1' />
                          <span>{selectedNote.tags.length} tags</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className='flex flex-wrap gap-1 mb-4'>
                        {selectedNote.tags.map((tag) => (
                          <span
                            key={tag}
                            className='text-[#adf0dd]/80 font-mono text-xs px-2 py-1 bg-[#adf0dd]/10 rounded'>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Note Content */}
                      <div className='bg-black/40 border border-[#adf0dd]/20 rounded-md p-4 flex-grow overflow-y-auto'>
                        <p className='text-[#adf0dd]/90 font-mono text-sm whitespace-pre-wrap'>
                          {selectedNote.content}
                        </p>
                      </div>

                      {/* Rich Text Toggle */}
                      <div className='flex items-center space-x-2 mt-4 mb-2'>
                        <Switch
                          id='rich-text-mode'
                          checked={useRichText}
                          onCheckedChange={setUseRichText}
                          className='data-[state=checked]:bg-emerald-600'
                        />
                        <Label
                          htmlFor='rich-text-mode'
                          className='text-[#adf0dd]/80 font-mono text-xs flex items-center'>
                          <FileTextIcon className='w-3.5 h-3.5 mr-1.5' />
                          Save as Rich Text
                        </Label>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex space-x-2 mt-2'>
                        <Button className='bg-[#adf0dd]/10 hover:bg-[#adf0dd]/20 text-[#adf0dd] border border-[#adf0dd]/30 flex-1'>
                          <Edit3 className='w-4 h-4 mr-2' />
                          Edit Note
                        </Button>
                        <Button
                          className='bg-black/50 hover:bg-[#adf0dd]/10 text-[#adf0dd] border border-[#adf0dd]/30 flex-1'
                          onClick={() => handleSaveToKB(selectedNote)}>
                          <Save className='w-4 h-4 mr-2' />
                          Save to KB
                        </Button>
                      </div>
                    </div>
                  )}
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.NestedRoot>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}

// Export the instance and its methods for external components to use
export const sessionNotesInstance = {
  addNoteFromMessage: null as ((message: Message) => Note) | null,
  saveToXata: null as ((options: SaveToXataOptions) => Promise<boolean>) | null,
}

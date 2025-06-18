'use client'

import React, { useCallback, useMemo } from 'react'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import { cn } from '@/lib/utils'
import { useResearch } from '@/contexts/research/research-context'
import { ResearchExtensionKit } from './extensions/research-extension-kit'
import './research-editor.css'

interface ResearchRecord {
  id: string
  type: "events" | "personnel" | "documents" | "locations" | "organizations" | 
        "topics" | "sightings" | "testimonies" | "artifacts" | "key-figures" |
        "users" | "user-notes" | "mindmaps" | "summary-files"
  title: string
  description?: string
  metadata?: Record<string, any>
}

interface ResearchEditorProps {
  content: string
  onContentChange: (content: string) => void
  contextualRecords: ResearchRecord[]
  onAtMention: (query: string) => ResearchRecord[]
  selectedRecord?: ResearchRecord | null
  className?: string
}

function EditorToolbar() {
  const { editor } = useCurrentEditor()
  
  if (!editor) return null

  return (
    <div className="border-b border-green-400/20 p-2 bg-gray-900/30">
      <div className="flex items-center space-x-2 text-green-400">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "px-2 py-1 rounded text-xs hover:bg-green-400/10",
            editor.isActive('bold') && "bg-green-400/20"
          )}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "px-2 py-1 rounded text-xs hover:bg-green-400/10",
            editor.isActive('italic') && "bg-green-400/20"
          )}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "px-2 py-1 rounded text-xs hover:bg-green-400/10",
            editor.isActive('heading', { level: 2 }) && "bg-green-400/20"
          )}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "px-2 py-1 rounded text-xs hover:bg-green-400/10",
            editor.isActive('bulletList') && "bg-green-400/20"
          )}
        >
          List
        </button>
        <div className="h-4 w-px bg-green-400/30" />
        <span className="text-xs text-green-400/70">
          Type @ to mention records
        </span>
      </div>
    </div>
  )
}

function EditorContent() {
  const { editor } = useCurrentEditor()
  const { selectedCard, pinnedCards } = useResearch()

  // Auto-insert selected card info when card is selected
  React.useEffect(() => {
    if (selectedCard && editor && !editor.isFocused) {
      const cardInfo = `

## ${selectedCard.data?.name || selectedCard.id}
**Type:** ${selectedCard.type}

${selectedCard.aiAnalysis?.summary || 'No analysis available'}

`
      editor.commands.insertContent(cardInfo)
    }
  }, [selectedCard, editor])

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar />
      <div className="flex-1 p-4 overflow-auto">
        <div 
          className="prose prose-invert prose-green max-w-none min-h-full
                     prose-headings:text-green-400 
                     prose-p:text-gray-200 
                     prose-strong:text-white
                     prose-code:text-green-300
                     prose-code:bg-gray-800
                     prose-blockquote:border-green-400/50
                     prose-blockquote:text-gray-300"
        >
          {/* TipTap editor content renders here */}
        </div>
        
        {/* Context panel */}
        {(selectedCard || pinnedCards.length > 0) && (
          <div className="mt-6 p-3 bg-gray-900/50 border border-green-400/20 rounded">
            <h4 className="text-green-400 text-sm font-semibold mb-2">Research Context</h4>
            {selectedCard && (
              <div className="text-xs text-gray-300 mb-2">
                Selected: {selectedCard.data?.name || selectedCard.id}
              </div>
            )}
            {pinnedCards.length > 0 && (
              <div className="text-xs text-gray-300">
                Pinned cards: {pinnedCards.map(c => c.data?.name || c.id).join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function ResearchEditor({
  content,
  onContentChange,
  contextualRecords,
  onAtMention,
  selectedRecord,
  className
}: ResearchEditorProps) {
  // Create mention suggestion function
  const mentionSuggestion = useCallback((query: string) => {
    const filtered = onAtMention(query)
    return filtered.map(record => ({
      id: record.id,
      label: record.title,
      type: record.type,
      description: record.description
    }))
  }, [onAtMention])

  // Memoize extensions with mention functionality
  const extensions = useMemo(() => 
    ResearchExtensionKit({ 
      mentionSuggestion,
      contextualRecords 
    }), 
    [mentionSuggestion, contextualRecords]
  )

  const handleUpdate = useCallback(({ editor }: any) => {
    const html = editor.getHTML()
    onContentChange(html)
  }, [onContentChange])

  return (
    <div className={cn("h-full bg-gray-950 text-green-400", className)}>
      <EditorProvider
        extensions={extensions}
        content={content}
        onUpdate={handleUpdate}
        editorProps={{
          attributes: {
            class: 'prose prose-invert prose-green max-w-none min-h-full focus:outline-none',
          },
        }}
      >
        <EditorContent />
      </EditorProvider>
    </div>
  )
}
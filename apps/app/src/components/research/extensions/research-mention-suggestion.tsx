import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { ragHandler } from '@/lib/rag/rag-llm-handler'

interface MentionItem {
  id: string
  label: string
  type: string
  description?: string
}

interface ResearchRecord {
  id: string
  type: string
  title: string
  description?: string
}

interface MentionListProps {
  items: MentionItem[]
  command: (item: MentionItem) => void
}

const MentionList = forwardRef<any, MentionListProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = items[index]
    if (item) {
      command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="bg-gray-900 border border-green-400/30 rounded-lg shadow-lg max-h-60 overflow-auto">
      {items.length ? (
        items.map((item, index) => (
          <button
            key={item.id}
            className={`
              w-full text-left p-3 hover:bg-gray-800 border-b border-gray-700 last:border-b-0
              ${index === selectedIndex ? 'bg-gray-800' : ''}
            `}
            onClick={() => selectItem(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-green-400 font-medium text-sm">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-gray-400 text-xs mt-1 line-clamp-2">
                    {item.description}
                  </div>
                )}
              </div>
              <div className="ml-2">
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${item.type === 'events' ? 'bg-blue-900/50 text-blue-300' : ''}
                  ${item.type === 'personnel' ? 'bg-purple-900/50 text-purple-300' : ''}
                  ${item.type === 'documents' ? 'bg-yellow-900/50 text-yellow-300' : ''}
                  ${item.type === 'locations' ? 'bg-green-900/50 text-green-300' : ''}
                  ${item.type === 'organizations' ? 'bg-red-900/50 text-red-300' : ''}
                  ${item.type === 'topics' ? 'bg-emerald-900/50 text-emerald-300' : ''}
                  ${item.type === 'sightings' ? 'bg-indigo-900/50 text-indigo-300' : ''}
                  ${item.type === 'testimonies' ? 'bg-pink-900/50 text-pink-300' : ''}
                  ${item.type === 'artifacts' ? 'bg-orange-900/50 text-orange-300' : ''}
                  ${item.type === 'key-figures' ? 'bg-violet-900/50 text-violet-300' : ''}
                  ${item.type === 'users' ? 'bg-sky-900/50 text-sky-300' : ''}
                  ${item.type === 'user-notes' ? 'bg-lime-900/50 text-lime-300' : ''}
                  ${item.type === 'mindmaps' ? 'bg-gray-900/50 text-gray-300' : ''}
                  ${item.type === 'summary-files' ? 'bg-amber-900/50 text-amber-300' : ''}
                  ${item.type?.startsWith('rag-') ? 'bg-teal-900/50 text-teal-300 border border-teal-500/30' : ''}
                `}>
                  {item.type}
                </span>
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="p-3 text-gray-500 text-sm">
          No records found
        </div>
      )}
    </div>
  )
})

MentionList.displayName = 'MentionList'

interface ResearchMentionSuggestionProps {
  mentionSuggestion: (query: string) => MentionItem[]
  contextualRecords: ResearchRecord[]
}

export const ResearchMentionSuggestion = ({ 
  mentionSuggestion, 
  contextualRecords 
}: ResearchMentionSuggestionProps) => ({
  items: async ({ query }: { query: string }) => {
    // Get suggestions from the provided function
    const suggestions = mentionSuggestion(query)
    
    // Also search in contextual records as fallback
    const contextualSuggestions = contextualRecords
      .filter(record => 
        record.title.toLowerCase().includes(query.toLowerCase()) ||
        record.description?.toLowerCase().includes(query.toLowerCase())
      )
      .map(record => ({
        id: record.id,
        label: record.title,
        type: record.type,
        description: record.description
      }))
    
    // Add RAG-powered search results
    let ragSuggestions: MentionItem[] = []
    try {
      const ragResults = await ragHandler.searchDocuments(query)
      ragSuggestions = ragResults.map(result => ({
        id: `rag-${result.id}`,
        label: result.title,
        type: `rag-${result.type}`,
        description: result.summary
      }))
    } catch (error) {
      console.error('RAG search failed:', error)
    }
    
    // Combine and deduplicate
    const allSuggestions = [...suggestions, ...contextualSuggestions, ...ragSuggestions]
    const uniqueSuggestions = allSuggestions.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    )
    
    return uniqueSuggestions.slice(0, 10) // Limit to 10 suggestions
  },

  render: () => {
    let component: ReactRenderer
    let popup: any

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          theme: 'dark',
          maxWidth: 400,
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup?.[0]?.hide()
          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup?.[0]?.destroy()
        component.destroy()
      },
    }
  },
})
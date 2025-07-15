import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { FileText, Star } from 'lucide-react'

interface RAGSuggestionItem {
  id: string
  label: string
  description: string
  type: string
  score: number
}

interface RAGSuggestionListProps {
  items: RAGSuggestionItem[]
  command: (item: RAGSuggestionItem) => void
}

export const RAGSuggestionList = forwardRef<any, RAGSuggestionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    }

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length)
          return true
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length)
          return true
        }

        if (event.key === 'Enter') {
          selectItem(selectedIndex)
          return true
        }

        return false
      },
    }))

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    if (!items.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <div className="text-sm text-muted-foreground">
            No results found. Try a different search term.
          </div>
        </div>
      )
    }

    return (
      <div className="bg-background border rounded-lg shadow-lg overflow-hidden max-w-sm">
        <div className="max-h-[300px] overflow-y-auto">
          {items.map((item, index) => (
            <button
              key={item.id}
              className={`flex items-start gap-3 w-full px-3 py-2 text-left hover:bg-accent transition-colors ${
                index === selectedIndex ? 'bg-accent' : ''
              }`}
              onClick={() => selectItem(index)}
            >
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm line-clamp-1">
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-muted-foreground">
                    {Math.round(item.score * 100)}% match
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="border-t px-3 py-2 text-xs text-muted-foreground">
          Knowledge Base Search Results
        </div>
      </div>
    )
  }
)

RAGSuggestionList.displayName = 'RAGSuggestionList'
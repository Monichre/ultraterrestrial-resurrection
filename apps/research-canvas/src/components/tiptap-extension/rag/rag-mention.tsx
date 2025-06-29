import { Mention } from '@tiptap/extension-mention'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { RAGSuggestionList } from './rag-suggestion-list'
import { RAGLLMHandler } from '@/lib/tiptap/custom-llm-handler'

export interface RAGMentionOptions {
  ragHandler: RAGLLMHandler
  HTMLAttributes?: Record<string, any>
}

export const RAGMention = Mention.extend<RAGMentionOptions>({
  name: 'ragMention',

  addOptions() {
    return {
      ...this.parent?.(),
      ragHandler: null as any,
      suggestion: {
        char: '@@',
        allowSpaces: true,
        
        items: async ({ query }: { query: string }) => {
          if (!this.options.ragHandler || query.length < 3) {
            return []
          }
          
          try {
            // Search RAG knowledge base
            const results = await this.options.ragHandler.searchDocuments(query)
            
            // Transform results for mention list
            return results.map(result => ({
              id: result.id,
              label: result.title,
              description: result.summary,
              type: 'rag-document',
              score: result.score
            }))
          } catch (error) {
            console.error('RAG search failed:', error)
            return []
          }
        },

        render: () => {
          let component: any
          let popup: any

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(RAGSuggestionList, {
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
              })
            },

            onUpdate(props: any) {
              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
              }

              return component.ref?.onKeyDown(props)
            },

            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },

        command: ({ editor, range, props }: any) => {
          // Insert the mention with document reference
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: 'text',
                text: `[${props.label}] `,
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: `#doc-${props.id}`,
                      target: '_blank',
                      class: 'rag-document-link',
                    },
                  },
                ],
              },
            ])
            .run()
        },
      },
    }
  },
})
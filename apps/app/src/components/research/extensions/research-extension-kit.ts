import { Extension } from '@tiptap/core'
import { Mention } from '@tiptap/extension-mention'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Bold } from '@tiptap/extension-bold'
import { Italic } from '@tiptap/extension-italic'
import { Heading } from '@tiptap/extension-heading'
import { BulletList } from '@tiptap/extension-bullet-list'
import { ListItem } from '@tiptap/extension-list-item'
import { Blockquote } from '@tiptap/extension-blockquote'
import { Code } from '@tiptap/extension-code'
import { CodeBlock } from '@tiptap/extension-code-block'
import { HardBreak } from '@tiptap/extension-hard-break'
import { History } from '@tiptap/extension-history'
import { Placeholder } from '@tiptap/extension-placeholder'
import { ResearchMentionSuggestion } from './research-mention-suggestion'
import { ragHandler } from '@/lib/rag/rag-llm-handler'

interface ResearchRecord {
  id: string
  type: string
  title: string
  description?: string
}

interface ResearchExtensionKitProps {
  mentionSuggestion: (query: string) => Array<{
    id: string
    label: string
    type: string
    description?: string
  }>
  contextualRecords: ResearchRecord[]
}

export const ResearchExtensionKit = ({ 
  mentionSuggestion, 
  contextualRecords 
}: ResearchExtensionKitProps) => [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  BulletList,
  ListItem,
  Blockquote,
  Code,
  CodeBlock,
  HardBreak,
  History,
  
  // Custom mention extension for database records
  Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: ResearchMentionSuggestion({
      mentionSuggestion,
      contextualRecords
    }),
  }),
  
  // Placeholder with research-specific text
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return 'Research notes title...'
      }
      
      return 'Start your research notes here. Type @ to mention records from the database...'
    },
  }),
  
  // Custom extension for research-specific functionality with RAG integration
  Extension.create({
    name: 'researchFeatures',
    
    addGlobalAttributes() {
      return [
        {
          types: ['mention'],
          attributes: {
            'data-type': {
              default: null,
              parseHTML: element => element.getAttribute('data-type'),
              renderHTML: attributes => {
                if (!attributes['data-type']) {
                  return {}
                }
                return { 'data-type': attributes['data-type'] }
              },
            },
            'data-id': {
              default: null,
              parseHTML: element => element.getAttribute('data-id'),
              renderHTML: attributes => {
                if (!attributes['data-id']) {
                  return {}
                }
                return { 'data-id': attributes['data-id'] }
              },
            },
          },
        },
      ]
    },
    
    addCommands() {
      return {
        insertRecordReference: (record: ResearchRecord) => ({ commands }) => {
          return commands.insertContent({
            type: 'mention',
            attrs: {
              id: record.id,
              label: record.title,
              'data-type': record.type,
              'data-id': record.id,
            },
          })
        },
        
        // RAG-powered AI commands
        ragGenerate: (prompt: string) => ({ commands, view }) => {
          // Get current selection or cursor position for context
          const { selection } = view.state
          const contextBefore = view.state.doc.textBetween(Math.max(0, selection.from - 100), selection.from)
          const contextAfter = view.state.doc.textBetween(selection.to, Math.min(view.state.doc.content.size, selection.to + 100))
          
          ragHandler.generateText(prompt, {
            context: { before: contextBefore, after: contextAfter }
          }).then(text => {
            if (text) {
              commands.insertContent(text)
            }
          }).catch(error => {
            console.error('RAG generation failed:', error)
          })
          
          return true
        },
        
        ragSummarize: () => ({ commands, view }) => {
          const { selection } = view.state
          const selectedText = view.state.doc.textBetween(selection.from, selection.to)
          
          if (!selectedText) {
            return false
          }
          
          ragHandler.generateText(`Summarize this text: ${selectedText}`).then(summary => {
            if (summary) {
              commands.insertContent(`\n\n**Summary:** ${summary}\n\n`)
            }
          }).catch(error => {
            console.error('RAG summarization failed:', error)
          })
          
          return true
        },
        
        ragFactCheck: () => ({ commands, view }) => {
          const { selection } = view.state
          const selectedText = view.state.doc.textBetween(selection.from, selection.to)
          
          if (!selectedText) {
            return false
          }
          
          ragHandler.factCheck(selectedText).then(result => {
            const status = result.verified ? '✅ Verified' : '❌ Unverified'
            const sources = result.sources.length > 0 ? `\n**Sources:** ${result.sources.join(', ')}` : ''
            commands.insertContent(`\n\n**Fact Check:** ${status}\n**Explanation:** ${result.explanation}${sources}\n\n`)
          }).catch(error => {
            console.error('RAG fact check failed:', error)
          })
          
          return true
        },
      }
    },
  }),
]
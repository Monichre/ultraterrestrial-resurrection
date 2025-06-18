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
  
  // Custom extension for research-specific functionality
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
      }
    },
  }),
]
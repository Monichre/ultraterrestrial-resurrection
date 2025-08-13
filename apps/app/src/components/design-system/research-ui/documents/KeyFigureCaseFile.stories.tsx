import type {Meta, StoryObj} from '@storybook/react'
import KeyFigureCaseFile from './KeyFigureCaseFile'

const meta: Meta<typeof KeyFigureCaseFile> = {
  title: 'Documents/KeyFigureCaseFile',
  component: KeyFigureCaseFile,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'vintage',
      values: [
        {name: 'vintage', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
    docs: {
      description: {
        component:
          'Key figure case file document featuring classified materials, debrief transcripts, and supporting evidence. Styled as vintage government documents with aged paper effects, handwritten notes, and photographic evidence.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAlternativeBackground: Story = {
  parameters: {
    backgrounds: {
      default: 'slate',
    },
  },
}

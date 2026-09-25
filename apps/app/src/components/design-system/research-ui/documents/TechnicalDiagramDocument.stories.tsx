import type {Meta, StoryObj} from '@storybook/react'
import TechnicalDiagramDocument from './TechnicalDiagramDocument'

const meta: Meta<typeof TechnicalDiagramDocument> = {
  title: 'Documents/TechnicalDiagramDocument',
  component: TechnicalDiagramDocument,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'slate',
      values: [
        {name: 'vintage', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
    docs: {
      description: {
        component:
          'Technical diagram document with redacted headers and complex SVG schematics. Features grid backgrounds, coordinate systems, tracking lines, and technical annotations with classified markings.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OnVintageBackground: Story = {
  parameters: {
    backgrounds: {
      default: 'vintage',
    },
  },
}

import type {Meta, StoryObj} from '@storybook/react'
import DistressedPhoto from './DistressedPhoto'

const meta: Meta<typeof DistressedPhoto> = {
  title: 'Documents/DistressedPhoto',
  component: DistressedPhoto,
  parameters: {
    layout: 'centered',
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
          'Vintage UFO photograph component with authentic 1950s styling. Features distressed edges, tape effects, date stamps, and TOP SECRET classification markings for authentic government document aesthetics.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default distressed photo showing UFO lights with vintage styling, date stamp (JUL 19 1952), and TOP SECRET classification.',
      },
    },
  },
}

export const WithContainer: Story = {
  render: () => (
    <div className='p-8 border-2 border-dashed border-gray-400 bg-gray-100 dark:bg-gray-800'>
      <div className='text-center mb-4 text-sm font-mono text-gray-600 dark:text-gray-400'>
        EVIDENCE FILE - RESTRICTED ACCESS
      </div>
      <DistressedPhoto />
      <div className='text-center mt-4 text-xs font-mono text-gray-500 dark:text-gray-500'>
        Photo recovered from [REDACTED] incident site
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Photo displayed within a document context, showing how it would appear in an evidence file or report.',
      },
    },
  },
}

export const MultiplePhotos: Story = {
  render: () => (
    <div className='flex flex-wrap gap-6 p-4'>
      <DistressedPhoto />
      <div className='transform rotate-2'>
        <DistressedPhoto />
      </div>
      <div className='transform -rotate-1'>
        <DistressedPhoto />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple photos with random rotations, simulating how evidence photos might be scattered on a desk or in a file.',
      },
    },
  },
}

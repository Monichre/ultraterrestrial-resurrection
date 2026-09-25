import type {Meta, StoryObj} from '@storybook/react'
import HandwrittenNote from './HandwrittenNote'

const meta: Meta<typeof HandwrittenNote> = {
  title: 'Documents/HandwrittenNote',
  component: HandwrittenNote,
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
          'Handwritten note component with authentic script styling. Features custom handwriting font, subtle hover animations, and proper text styling for marginal notes and annotations in government documents.',
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The handwritten text content to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for customization',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'believe',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default handwritten note with standard text styling and hover effects.',
      },
    },
  },
}

export const ShortNotes: Story = {
  render: (args) => (
    <div className='space-y-4 p-4'>
      <HandwrittenNote {...args} text='11:30 AM' className='text-blue-900 -rotate-2' />
      <HandwrittenNote {...args} text='believe' className='text-blue-900 rotate-1' />
      <HandwrittenNote {...args} text='parallel' className='text-blue-900 -rotate-1' />
      <HandwrittenNote {...args} text='orbit' className='text-blue-900 rotate-2' />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Collection of short handwritten notes with various rotations, simulating marginal annotations on a document.',
      },
    },
  },
}

export const LongerNotes: Story = {
  render: (args) => (
    <div className='space-y-6 p-4 max-w-md'>
      <HandwrittenNote {...args} text='formation V mostly' className='text-blue-900 -rotate-3' />
      <HandwrittenNote
        {...args}
        text='targets moving at sheer determined pattern flight'
        className='text-blue-900 rotate-2'
      />
      <HandwrittenNote
        {...args}
        text='twelve moving STAG limit and limit limit'
        className='text-blue-900 -rotate-1'
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Longer handwritten notes demonstrating how the component handles multi-word phrases and longer text content.',
      },
    },
  },
}

export const DifferentColors: Story = {
  render: (args) => (
    <div className='space-y-4 p-4'>
      <HandwrittenNote {...args} text='Blue ink note' className='text-blue-700 rotate-1' />
      <HandwrittenNote {...args} text='Black ink note' className='text-gray-900 -rotate-2' />
      <HandwrittenNote {...args} text='Red ink note' className='text-red-700 rotate-2' />
      <HandwrittenNote {...args} text='Green ink note' className='text-green-700 -rotate-1' />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Handwritten notes in different ink colors, showing color customization options.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  args: {
    text: 'Your custom note here',
    className: 'text-blue-900 rotate-2',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground for testing different text content and styling. Use the controls to experiment with different notes and rotations.',
      },
    },
  },
}

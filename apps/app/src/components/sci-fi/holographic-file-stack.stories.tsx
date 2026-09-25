import type {Meta, StoryObj} from '@storybook/nextjs'
import {HolographicFileStack} from './holographic-file-stack'

const DEFAULT_STORY_FILES = [
  {id: 'doc1', title: 'Confidential Report', color: '#4f46e5'},
  {id: 'doc2', title: 'Evidence XK-467', color: '#8b5cf6'},
  {id: 'doc3', title: 'Testimony Recording', color: '#ec4899'},
  {id: 'doc4', title: 'Research Data', color: '#f43f5e'},
  {id: 'doc5', title: 'Location Map', color: '#10b981'},
]

const meta = {
  title: 'Sci-Fi/HolographicFileStack',
  component: HolographicFileStack,
  decorators: [
    (Story) => (
      <div className='w-[min(42rem,90vw)]'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          'An interactive React Three Fiber stack for previewing document or evidence collections.',
      },
    },
  },
  argTypes: {
    spacing: {
      control: {type: 'range', min: 0, max: 0.3, step: 0.01},
    },
    rotationFactor: {
      control: {type: 'range', min: 0, max: 1, step: 0.05},
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HolographicFileStack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    files: DEFAULT_STORY_FILES,
    spacing: 0.1,
    rotationFactor: 0.3,
  },
}

export const BuiltInDefaults: Story = {}

export const SingleFile: Story = {
  args: {
    files: [{id: 'doc1', title: 'Classified Document', color: '#4f46e5'}],
  },
}

export const EmptyStack: Story = {
  args: {
    files: [],
  },
}

export const NoSpacingOrRotation: Story = {
  args: {
    files: DEFAULT_STORY_FILES,
    spacing: 0,
    rotationFactor: 0,
  },
}

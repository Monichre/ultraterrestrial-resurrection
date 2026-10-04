import type {Meta, StoryObj} from '@storybook/react'
import {CanvasGrid} from './canvas-grid'

const meta: Meta<typeof CanvasGrid> = {
  title: 'Case Files/Canvas/CanvasGrid',
  component: CanvasGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CanvasGrid>

// Sample grid items
const gridItems = [
  {
    id: '1',
    content: (
      <div className='flex h-full items-center justify-center text-lg font-medium'>Evidence #1</div>
    ),
  },
  {
    id: '2',
    content: (
      <div className='flex h-full items-center justify-center text-lg font-medium'>Evidence #2</div>
    ),
    width: 2,
  },
  {
    id: '3',
    content: (
      <div className='flex h-full items-center justify-center text-lg font-medium'>Evidence #3</div>
    ),
    height: 2,
  },
  {
    id: '4',
    content: (
      <div className='flex h-full items-center justify-center text-lg font-medium'>Evidence #4</div>
    ),
  },
  {
    id: '5',
    content: (
      <div className='flex h-full items-center justify-center text-lg font-medium'>Evidence #5</div>
    ),
    width: 2,
    height: 2,
  },
]

export const Default: Story = {
  args: {
    items: gridItems,
    columns: 3,
    gap: 20,
  },
  decorators: [
    (Story) => (
      <div className='w-[800px] p-6 bg-gray-100 dark:bg-gray-800 rounded-lg'>
        <Story />
      </div>
    ),
  ],
}

export const TwoColumns: Story = {
  args: {
    items: gridItems,
    columns: 2,
    gap: 16,
  },
  decorators: [
    (Story) => (
      <div className='w-[600px] p-6 bg-gray-100 dark:bg-gray-800 rounded-lg'>
        <Story />
      </div>
    ),
  ],
}

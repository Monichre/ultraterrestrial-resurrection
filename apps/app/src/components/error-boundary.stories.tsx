import type {Meta, StoryObj} from '@storybook/react'
import ErrorBoundary from './error-boundary'

const meta = {
  title: 'Components/Utils/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ErrorBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const WithChildren: Story = {
  args: {
    children: (
      <div className='p-8 text-center'>
        <p className='text-lg font-semibold'>Content rendered successfully</p>
        <p className='text-sm text-muted-foreground'>
          This content is wrapped by the ErrorBoundary.
        </p>
      </div>
    ),
  },
}

export const WithCustomFallback: Story = {
  args: {
    children: <div>Safe content</div>,
    fallback: ({error}) => (
      <div className='p-8 text-center border border-red-500 rounded-lg'>
        <h2 className='text-xl font-bold text-red-500'>Custom Fallback</h2>
        <p className='text-sm mt-2'>{error?.message || 'An error occurred'}</p>
      </div>
    ),
  },
}

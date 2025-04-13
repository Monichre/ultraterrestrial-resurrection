import type {Meta, StoryObj} from '@storybook/react'
import {MotionDynamicToolbar} from './motion-dynamic-toolbar'

const meta: Meta<typeof MotionDynamicToolbar> = {
  title: 'Components/Toolbars/MotionDynamicToolbar',
  component: MotionDynamicToolbar,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{height: '300px', position: 'relative'}}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MotionDynamicToolbar>

export const Default: Story = {
  args: {},
}

// This story shows a custom animation of the toolbar opening and closing
export const WithInteraction: Story = {
  play: async ({canvasElement}) => {
    // We can't easily set state in the component, but this demonstrates
    // how you could add interaction tests with the component
    const canvas = canvasElement
    // Find search button and simulate clicks
    // Note: For real interaction testing, you'd use test libraries
    // like @storybook/testing-library's userEvent
  },
}

// A story to demonstrate the expanded search state
// Note: This would require exposing state controls for the toolbar
export const WithSearchExpanded: Story = {
  render: () => (
    <div style={{height: '300px', position: 'relative'}}>
      <div className='absolute bottom-8'>
        <div className='h-full w-full rounded-xl border border-zinc-950/10 bg-white'>
          <div style={{width: '300px'}}>
            <div className='overflow-hidden p-2'>
              <div className='flex space-x-2'>
                <button className='relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='M4 22a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5Z'></path>
                    <circle cx='12' cy='7' r='5'></circle>
                  </svg>
                </button>
                <div className='relative w-full'>
                  <input
                    className='h-9 w-full rounded-lg border border-zinc-950/10 bg-transparent p-2 focus:outline-none'
                    autoFocus
                    placeholder='Search notes'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

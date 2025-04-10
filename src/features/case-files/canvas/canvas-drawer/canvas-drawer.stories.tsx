import type {Meta, StoryObj} from '@storybook/react'
import {CanvasDrawer} from './canvas-drawer'
import {useState} from 'react'

const meta: Meta<typeof CanvasDrawer> = {
  title: 'Case Files/Canvas/CanvasDrawer',
  component: CanvasDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CanvasDrawer>

export const Left: Story = {
  args: {
    side: 'left',
    open: true,
    showHandle: true,
    children: (
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold'>Evidence Drawer</h3>
        <p className='text-sm text-muted-foreground'>
          This drawer can contain any content you need for your investigation. It slides in from the
          left side of the screen, providing easy access to tools and resources.
        </p>
        <div className='h-[300px] rounded-md bg-primary/10 flex items-center justify-center'>
          Content Area
        </div>
      </div>
    ),
  },
}

export const Right: Story = {
  args: {
    side: 'right',
    open: true,
    showHandle: true,
    children: (
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold'>Evidence Drawer</h3>
        <p className='text-sm text-muted-foreground'>
          This drawer can contain any content you need for your investigation. It slides in from the
          right side of the screen, providing easy access to tools and resources.
        </p>
        <div className='h-[300px] rounded-md bg-primary/10 flex items-center justify-center'>
          Content Area
        </div>
      </div>
    ),
  },
}

export const Interactive: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false)

    return (
      <div className='relative h-[500px] border rounded-lg overflow-hidden'>
        <div className='p-8 h-full flex items-center justify-center'>
          <button
            type='button'
            onClick={() => setOpen(true)}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md'>
            Open Drawer
          </button>
        </div>

        <CanvasDrawer {...args} open={open} onOpenChange={setOpen}>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Interactive Drawer</h3>
            <p className='text-sm text-muted-foreground'>
              This drawer can be opened and closed with the button or the handle.
            </p>
            <div className='h-[300px] rounded-md bg-primary/10 flex items-center justify-center'>
              Content Area
            </div>
          </div>
        </CanvasDrawer>
      </div>
    )
  },
  args: {
    side: 'right',
    showHandle: true,
  },
}

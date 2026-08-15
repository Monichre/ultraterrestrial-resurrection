import type {Meta, StoryObj} from '@storybook/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dotted-dialog'
import {Button} from '@/components/ui/button'

const meta = {
  title: 'Components/Dialog/DottedDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Open Dotted Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a dialog with a dotted background overlay pattern.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            Dialog body content goes here. The overlay uses a dotted pattern
            with a brightness and blur backdrop filter.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

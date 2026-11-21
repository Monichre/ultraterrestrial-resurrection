import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'Components/TestStub',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className='p-8 text-center border border-border rounded-lg'>
      <p className='text-sm text-muted-foreground'>
        This is a test stub file with no component exports.
      </p>
    </div>
  ),
}

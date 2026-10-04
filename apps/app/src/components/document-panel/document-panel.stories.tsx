import type {Meta, StoryObj} from '@storybook/react'
import {DocumentPanel} from './document-panel'

const meta = {
  title: 'Components/DocumentPanel/DocumentPanel',
  component: DocumentPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='flex min-h-screen w-full justify-center bg-black p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

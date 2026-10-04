import type {Meta, StoryObj} from '@storybook/react'
import {SectionCards} from './section-cards'

const meta = {
  title: 'Components/AdminDashboard/SectionCards',
  component: SectionCards,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='w-full p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

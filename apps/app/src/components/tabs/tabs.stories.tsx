import type {Meta, StoryObj} from '@storybook/react'
import {Tabs} from './tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      {
        title: 'Tab One',
        value: 'tab1',
        content: (
          <div className='w-full h-64 flex items-center justify-center bg-neutral-900 rounded-lg text-neutral-300'>
            Content for Tab One
          </div>
        ),
      },
      {
        title: 'Tab Two',
        value: 'tab2',
        content: (
          <div className='w-full h-64 flex items-center justify-center bg-neutral-900 rounded-lg text-neutral-300'>
            Content for Tab Two
          </div>
        ),
      },
      {
        title: 'Tab Three',
        value: 'tab3',
        content: (
          <div className='w-full h-64 flex items-center justify-center bg-neutral-900 rounded-lg text-neutral-300'>
            Content for Tab Three
          </div>
        ),
      },
    ],
  },
}

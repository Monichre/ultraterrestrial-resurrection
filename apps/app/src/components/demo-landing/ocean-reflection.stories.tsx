import type {Meta, StoryObj} from '@storybook/react'
import {OceanReflection} from './ocean-reflection'

const meta = {
  title: 'Components/DemoLanding/OceanReflection',
  component: OceanReflection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 to-black'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OceanReflection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

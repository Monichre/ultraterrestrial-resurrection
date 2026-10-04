import type {Meta, StoryObj} from '@storybook/nextjs'
import {CosmicNavigation} from './cosmic-navigation'

const meta = {
  title: 'Components/DemoLanding/CosmicNavigation',
  component: CosmicNavigation,
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
} satisfies Meta<typeof CosmicNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

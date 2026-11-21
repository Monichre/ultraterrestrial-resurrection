import type { Meta, StoryObj } from '@storybook/nextjs'
import BackgroundAuraAnimationContainer from './background-aura-animation-container'

const meta = {
  title: 'Design System/Lab Prototypes/Dev UI Embeds/Background Aura Animation',
  component: BackgroundAuraAnimationContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BackgroundAuraAnimationContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className='h-screen w-screen'>
        <Story />
      </div>
    ),
  ],
}

import type { Meta, StoryObj } from '@storybook/nextjs'
import SynthesisAutonomousUIShowcaseSection from './synthesis-autonomous-ui-showcase-section'

const meta = {
  title: 'Design System/Lab Prototypes/Dev UI Embeds/Synthesis Autonomous UI Showcase',
  component: SynthesisAutonomousUIShowcaseSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SynthesisAutonomousUIShowcaseSection>

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

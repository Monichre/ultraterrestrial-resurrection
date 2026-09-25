import type { Meta, StoryObj } from '@storybook/nextjs'
import QuantumNodeUIShowcaseSection from './quantum-node-ui-showcase-section'

const meta = {
  title: 'Design System/Lab Prototypes/Dev UI Embeds/Quantum Node UI Showcase',
  component: QuantumNodeUIShowcaseSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuantumNodeUIShowcaseSection>

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

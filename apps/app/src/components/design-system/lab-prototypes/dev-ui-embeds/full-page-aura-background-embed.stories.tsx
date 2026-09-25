import type { Meta, StoryObj } from '@storybook/nextjs'
import FullPageAuraBackgroundEmbed from './full-page-aura-background-embed'

const meta = {
  title: 'Design System/Lab Prototypes/Dev UI Embeds/Full-Page Aura Background',
  component: FullPageAuraBackgroundEmbed,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FullPageAuraBackgroundEmbed>

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

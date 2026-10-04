import type { Meta, StoryObj } from '@storybook/nextjs'
import FuturisticLabLandingAndDashboardLayout from './futuristic-lab-landing-and-dashboard-layout'

const meta = {
  title: 'Design System/Lab Prototypes/Dev UI Embeds/Futuristic Lab Landing + Dashboard',
  component: FuturisticLabLandingAndDashboardLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FuturisticLabLandingAndDashboardLayout>

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

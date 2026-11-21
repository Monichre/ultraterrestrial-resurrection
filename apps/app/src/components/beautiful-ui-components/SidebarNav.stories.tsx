import type { Meta, StoryObj } from '@storybook/nextjs'
import SidebarNav from './SidebarNav'
import { beautifulUiParameters, withBeautifulUiTheme } from './story-decorators'

const meta = {
  title: 'Design System/Beautiful UI/Sidebar Nav',
  component: SidebarNav,
  decorators: [
    withBeautifulUiTheme,
    (Story) => (
      <div className='max-w-[280px] h-[420px] overflow-hidden'>
        <Story />
      </div>
    ),
  ],
  parameters: beautifulUiParameters,
  tags: ['autodocs'],
} satisfies Meta<typeof SidebarNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dark: Story = {
  parameters: {
    beautifulUiTheme: 'dark',
    backgrounds: { default: 'dark-canvas' },
  },
}

import type { Meta, StoryObj } from '@storybook/nextjs'
import FineTuneCard from './FineTuneCard'
import { beautifulUiParameters, withBeautifulUiTheme } from './story-decorators'

const meta = {
  title: 'Design System/Beautiful UI/Fine-tune Card',
  component: FineTuneCard,
  decorators: [
    withBeautifulUiTheme,
    (Story) => (
      <div className='max-w-[640px]'>
        <Story />
      </div>
    ),
  ],
  parameters: beautifulUiParameters,
  tags: ['autodocs'],
} satisfies Meta<typeof FineTuneCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dark: Story = {
  parameters: {
    beautifulUiTheme: 'dark',
    backgrounds: { default: 'dark-canvas' },
  },
}

import type { Meta, StoryObj } from '@storybook/nextjs'
import ThinkingState from './ThinkingState'
import { beautifulUiParameters, withBeautifulUiTheme } from './story-decorators'

const meta = {
  title: 'Design System/Beautiful UI/Thinking',
  component: ThinkingState,
  decorators: [
    withBeautifulUiTheme,
    (Story) => (
      <div className='w-[min(28rem,90vw)]'>
        <Story />
      </div>
    ),
  ],
  parameters: beautifulUiParameters,
  argTypes: {
    variant: { control: 'select', options: ['Steps', 'Reasoning', 'Search', 'Coding'] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThinkingState>

export default meta
type Story = StoryObj<typeof meta>

export const Steps: Story = { args: { variant: 'Steps' } }
export const Reasoning: Story = { args: { variant: 'Reasoning' } }
export const Search: Story = { args: { variant: 'Search' } }
export const Coding: Story = { args: { variant: 'Coding' } }

export const Dark: Story = {
  args: { variant: 'Steps' },
  parameters: {
    beautifulUiTheme: 'dark',
    backgrounds: { default: 'dark-canvas' },
  },
}

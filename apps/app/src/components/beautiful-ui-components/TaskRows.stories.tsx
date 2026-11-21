import type { Meta, StoryObj } from '@storybook/nextjs'
import TaskRows from './TaskRows'
import { beautifulUiParameters, withBeautifulUiTheme } from './story-decorators'

const meta = {
  title: 'Design System/Beautiful UI/Task Rows',
  component: TaskRows,
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
    variant: { control: 'select', options: ['Capsules', 'List'] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TaskRows>

export default meta
type Story = StoryObj<typeof meta>

export const Capsules: Story = { args: { variant: 'Capsules' } }
export const List: Story = { args: { variant: 'List' } }

export const Dark: Story = {
  args: { variant: 'Capsules' },
  parameters: {
    beautifulUiTheme: 'dark',
    backgrounds: { default: 'dark-canvas' },
  },
}

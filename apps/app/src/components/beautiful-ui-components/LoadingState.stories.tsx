import type { Meta, StoryObj } from '@storybook/nextjs'
import LoadingState from './LoadingState'
import { beautifulUiParameters, withBeautifulUiTheme } from './story-decorators'

const meta = {
  title: 'Design System/Beautiful UI/Loading State',
  component: LoadingState,
  decorators: [withBeautifulUiTheme],
  parameters: beautifulUiParameters,
  argTypes: {
    variant: { control: 'select', options: ['Drive', 'Dots', 'Orbit'] },
    label: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingState>

export default meta
type Story = StoryObj<typeof meta>

export const Drive: Story = {
  args: { variant: 'Drive', label: 'Churning' },
}

export const Dots: Story = {
  args: { variant: 'Dots', label: 'Churning' },
}

export const Orbit: Story = {
  args: { variant: 'Orbit', label: 'Churning' },
}

export const Dark: Story = {
  args: { variant: 'Drive', label: 'Churning' },
  parameters: {
    beautifulUiTheme: 'dark',
    backgrounds: { default: 'dark-canvas' },
  },
}

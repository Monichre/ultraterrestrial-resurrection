import type {Meta, StoryObj} from '@storybook/react'
import {MarketingHero} from './MarketingHero'

const meta = {
  title: 'Marketing/Hero',
  component: MarketingHero,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#0B0C0F'}]},
  },
} satisfies Meta<typeof MarketingHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {title: 'Interact Naturally', eyebrow: 'AI Extensions'},
}

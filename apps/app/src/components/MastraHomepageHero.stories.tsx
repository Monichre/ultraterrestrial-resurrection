import type {Meta, StoryObj} from '@storybook/react'
import MastraHomepageHero from './MastraHomepageHero'

const meta = {
  title: 'Components/Hero/MastraHomepageHero',
  component: MastraHomepageHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MastraHomepageHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

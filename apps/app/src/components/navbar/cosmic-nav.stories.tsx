import type {Meta, StoryObj} from '@storybook/react'
import {CosmicNav} from './cosmic-nav'

const meta = {
  title: 'Navigation/CosmicNav',
  component: CosmicNav,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#000000'}]},
    chromatic: {
      delay: 500,
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(180deg, #080c1a 0%, #020611 55%, #01030b 100%)',
        }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CosmicNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomClass: Story = {
  args: {
    className: 'custom-nav-class',
  },
}

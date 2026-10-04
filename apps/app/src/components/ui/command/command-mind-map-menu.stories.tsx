import type { Meta, StoryObj } from '@storybook/react'
import { MindMapCommandMenu } from './command-mind-map-menu'

const meta = {
  title: 'Components/Command/MindMapCommandMenu',
  component: MindMapCommandMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A command menu interface designed for mind mapping applications with search and navigation capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Add argTypes if the component had props
  },
} satisfies Meta<typeof MindMapCommandMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default mind map command menu with projects, teams, and help sections.',
      },
    },
  },
}

export const WithSearchFocus: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Command menu with search input focused for immediate typing.',
      },
    },
  },
  play: async ( { canvasElement } ) => {
    const canvas = canvasElement
    const searchInput = canvas.querySelector( 'input[placeholder="What do you need?"]' ) as HTMLInputElement
    if ( searchInput ) {
      searchInput.focus()
    }
  },
}

export const Fullscreen: Story = {
  args: {},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Command menu displayed in fullscreen layout to show its modal-like behavior.',
      },
    },
  },
}

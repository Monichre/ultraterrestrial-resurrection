import type {Meta, StoryObj} from '@storybook/react'
import Experience from './Experience'

const meta: Meta<typeof Experience> = {
  title: 'Features | 3D | Events Journey',
  component: Experience,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sections: {
      control: 'object',
      description: 'Sections to display along the path',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the scene',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta

type Story = StoryObj<typeof Experience>

// Default story with standard configuration
export const Default: Story = {
  args: {
    sections: [
      {id: 'section1', title: 'Introduction', position: [0, 0, -10]},
      {id: 'section2', title: 'Features', position: [10, 0, 0]},
      {id: 'section3', title: 'Benefits', position: [0, 5, 10]},
      {id: 'section4', title: 'Conclusion', position: [-10, 0, 0]},
    ],
    years: Array.from({length: 10}, (_, i) => 1947 + i),
  },
}

// Minimal configuration with fewer sections
export const Minimal: Story = {
  args: {
    sections: [
      {id: 'start', title: 'Start', position: [0, 0, -10]},
      {id: 'end', title: 'End', position: [0, 0, 10]},
    ],
    years: Array.from({length: 10}, (_, i) => 1947 + i),
  },
}

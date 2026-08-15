import type {Meta, StoryObj} from '@storybook/react'
import {TransitionPanel} from './transition-panel'

const meta: Meta<typeof TransitionPanel> = {
  title: 'Components/Transition Panel',
  component: TransitionPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    activeIndex: {control: 'number'},
    transition: {control: 'object'},
    variants: {control: 'object'},
  },
}

export default meta
type Story = StoryObj<typeof TransitionPanel>

// Sample panels for use in stories
const samplePanels = [
  <div key='panel1' className='bg-blue-100 p-6 rounded-lg'>
    Panel 1
  </div>,
  <div key='panel2' className='bg-green-100 p-6 rounded-lg'>
    Panel 2
  </div>,
  <div key='panel3' className='bg-yellow-100 p-6 rounded-lg'>
    Panel 3
  </div>,
]

export const Default: Story = {
  args: {
    children: samplePanels,
    activeIndex: 0,
    className: 'w-60 h-20',
  },
}

export const SlideTransition: Story = {
  args: {
    children: samplePanels,
    activeIndex: 0,
    className: 'w-60 h-20',
    variants: {
      enter: {x: 300, opacity: 0},
      center: {x: 0, opacity: 1},
      exit: {x: -300, opacity: 0},
    },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
}

export const FadeTransition: Story = {
  args: {
    children: samplePanels,
    activeIndex: 0,
    className: 'w-60 h-20',
    variants: {
      enter: {opacity: 0},
      center: {opacity: 1},
      exit: {opacity: 0},
    },
    transition: {
      duration: 0.5,
    },
  },
}

export const ScaleTransition: Story = {
  args: {
    children: samplePanels,
    activeIndex: 0,
    className: 'w-60 h-20',
    variants: {
      enter: {scale: 0.8, opacity: 0},
      center: {scale: 1, opacity: 1},
      exit: {scale: 0.8, opacity: 0},
    },
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
}

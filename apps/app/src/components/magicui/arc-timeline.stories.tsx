import type {Meta, StoryObj} from '@storybook/react'
import {Bell, CloudLightning, Phone, Timer} from 'lucide-react'
import {ArcTimeline} from './arc-timeline'

const data = [
  {
    time: '2024',
    steps: [
      {
        icon: <CloudLightning className='h-5 w-5' />,
        content: 'Project kickoff and initial planning phase',
      },
      {
        icon: <Phone className='h-5 w-5' />,
        content: 'Stakeholder alignment and requirements gathering',
      },
    ],
  },
  {
    time: '2025',
    steps: [
      {
        icon: <Timer className='h-5 w-5' />,
        content: 'Development sprint cycles begin',
      },
      {
        icon: <Bell className='h-5 w-5' />,
        content: 'Beta release and user feedback collection',
      },
    ],
  },
]

const meta = {
  title: 'Components/MagicUI/ArcTimeline',
  component: ArcTimeline,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof ArcTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data,
  },
}

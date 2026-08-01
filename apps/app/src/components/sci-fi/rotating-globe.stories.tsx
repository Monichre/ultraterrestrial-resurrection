import type {Meta, StoryObj} from '@storybook/nextjs'
import {
  RotatingGlobe,
  ROTATING_GLOBE_DEFAULT_CITIES,
  type RotatingGlobeCity,
} from './rotating-globe'

const CUSTOM_CITIES: RotatingGlobeCity[] = [
  {lat: 33.4, lng: -104.5, city: 'Roswell', sublabel: '1947', dots: 42},
  {lat: 37.2, lng: -115.8, city: 'Area 51', sublabel: 'classified', dots: 28},
  {lat: 51.5, lng: -0.1, city: 'Rendlesham', sublabel: '1980', dots: 17},
]

const meta = {
  title: 'Sci-Fi/RotatingGlobe',
  component: RotatingGlobe,
  decorators: [
    (Story) => (
      <div className='h-[520px] w-[min(56rem,95vw)] overflow-hidden rounded-lg'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          'Interactive R3F hemisphere globe with city labels, scatter dots, and optional rotation tick audio.',
      },
    },
  },
  argTypes: {
    idleRotation: {
      control: {type: 'range', min: 0, max: 0.3, step: 0.01},
    },
    initialRotation: {
      control: {type: 'range', min: 0, max: 6.28, step: 0.01},
    },
    clickSound: {control: 'boolean'},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RotatingGlobe>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    cities: ROTATING_GLOBE_DEFAULT_CITIES,
    idleRotation: 0.06,
    initialRotation: 4,
    height: '100%',
    backgroundColor: '#0D0D0D',
    clickSound: false,
  },
}

export const WithClickSound: Story = {
  args: {
    ...Default.args,
    clickSound: true,
  },
}

export const CustomCities: Story = {
  args: {
    ...Default.args,
    cities: CUSTOM_CITIES,
    initialRotation: 2.4,
  },
}

export const CompactHeight: Story = {
  args: {
    ...Default.args,
    height: 320,
  },
}

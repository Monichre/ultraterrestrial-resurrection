import type {Meta, StoryObj} from '@storybook/react'
import type {ReactNode} from 'react'
import {Formation} from './Formation'
import {FormationUI} from './FormationUI'
import {SURFACES, type SurfaceId} from './surfaces'

const fullscreenDecorator = [
  (Story: () => ReactNode) => (
    <div style={{height: '100vh'}}>
      <Story />
    </div>
  ),
]

const meta: Meta<typeof Formation> = {
  title: 'Sci-Fi/Formation',
  component: Formation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: fullscreenDecorator,
}

export default meta
type Story = StoryObj<typeof Formation>

const surfaceStory = (surface: SurfaceId): Story => ({
  args: {surface},
})

export const Cellular: Story = surfaceStory('cellular')
export const Circular: Story = surfaceStory('circular')
export const Spiral: Story = surfaceStory('spiral')
export const Network: Story = surfaceStory('network')
export const Atrophy: Story = surfaceStory('atrophy')
export const Fundament: Story = surfaceStory('fundament')
export const Monde: Story = surfaceStory('monde')

export const AllSurfaces: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 8,
        padding: 8,
        minHeight: '100vh',
        background: '#111',
      }}>
      {(Object.keys(SURFACES) as SurfaceId[]).map((surface) => (
        <div key={surface} style={{height: 280, position: 'relative'}}>
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 2,
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
            {SURFACES[surface].title}
          </div>
          <Formation surface={surface} />
        </div>
      ))}
    </div>
  ),
  decorators: [],
}

export const FullUI: StoryObj<typeof FormationUI> = {
  render: () => (
    <div style={{height: '100vh'}}>
      <FormationUI />
    </div>
  ),
  decorators: [],
}

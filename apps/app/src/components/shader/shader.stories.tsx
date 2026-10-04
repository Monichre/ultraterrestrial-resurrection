import type {Meta, StoryObj} from '@storybook/react'
import {Canvas} from '@react-three/fiber'
import {Shader} from './shader'

const meta = {
  title: 'Components/Shader',
  component: Shader,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
  decorators: [
    (Story) => (
      <div style={{width: '100%', height: '500px', background: '#000'}}>
        <Canvas camera={{position: [0, 0, 5], fov: 50}}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Story />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof Shader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    position: [0, 0, 0],
    img: '/assets/earth2/placeholder.png',
    reference: {current: null},
  },
}

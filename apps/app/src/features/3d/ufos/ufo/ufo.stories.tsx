import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { Meta, StoryObj } from '@storybook/react'
import { UfoScene } from './Scene'
// import { TransformedUfoModel } from './ufo-model'

const SceneDecorator = ( Story: React.ComponentType ) => (
  <div style={{ width: '100%', height: '400px' }}>
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Story />
      <OrbitControls />
    </Canvas>
  </div>
)

// Transformed UFO Model Stories
// const TransformedMeta = {
//   title: '3D/UFO/Transformed',
//   component: UfoScene,
//   parameters: {
//     layout: 'fullscreen',
//   },
//   decorators: [SceneDecorator],
// } satisfies Meta<typeof UfoScene>

// export default TransformedMeta
// type TransformedStory = StoryObj<typeof UfoScene>

// export const TransformedDefault: TransformedStory = {
//   args: {
//     position: [0, 0, 0],
//     rotation: [0, 0, 0],
//     scale: 1,
//   },
// }

// export const TransformedHovering: TransformedStory = {
//   args: {
//     position: [0, 2, 0],
//     rotation: [0.2, 0.5, 0],
//     scale: 1.2,
//   },
// }

// Original UFO Scene Stories
const SceneMeta = {
  title: '3D/UFO/Original',
  component: UfoScene,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [SceneDecorator],
} satisfies Meta<typeof UfoScene>

type SceneStory = StoryObj<typeof SceneMeta>

export const SceneDefault: SceneStory = {
  args: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
  },
}

export const SceneHovering: SceneStory = {
  args: {
    position: [0, 2, 0],
    rotation: [0.2, 0.5, 0],
    scale: 1.2,
  },
}

export const SceneSpinning: SceneStory = {
  args: {
    position: [0, 1, 0],
    rotation: [0, Math.PI * 2, 0],
    scale: 0.8,
  },
}

export default SceneMeta
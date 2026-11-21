import * as THREE from 'three/webgpu'
import {Canvas, type CanvasProps, extend} from '@react-three/fiber'

extend(THREE as any)

export const WebGPUCanvas = (props: CanvasProps) => {
  return (
    <Canvas
      {...props}
      flat
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer(props as any)
        await renderer.init()
        return renderer
      }}>
      {props.children}
    </Canvas>
  )
}

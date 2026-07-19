'use client'

import {OrbitControls} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import {Suspense} from 'react'
import {CaseFileLayerMesh} from './case-file-layer'
import type {CaseFileLayer} from './data'

interface CaseFileSceneProps {
  layers: CaseFileLayer[]
  isOpen: boolean
  onSelectLayer: (layer: CaseFileLayer) => void
}

export function CaseFileScene({layers, isOpen, onSelectLayer}: CaseFileSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{position: [0, 1.4, 7.5], fov: 45}}
      gl={{alpha: true}}
      style={{background: 'transparent'}}>
      <ambientLight intensity={0.6} />
      <spotLight position={[6, 8, 6]} angle={0.3} penumbra={1} intensity={0.8} color='#f5e6c8' />
      <pointLight position={[-6, -3, -4]} intensity={0.4} color='#38bdf8' />

      <Suspense fallback={null}>
        {layers.map((layer, index) => (
          <CaseFileLayerMesh
            key={layer.id}
            layer={layer}
            index={index}
            total={layers.length}
            isOpen={isOpen}
            onSelect={onSelectLayer}
          />
        ))}
      </Suspense>

      <OrbitControls
        enabled={isOpen}
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={12}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.7}
        dampingFactor={0.08}
        enableDamping
      />
    </Canvas>
  )
}

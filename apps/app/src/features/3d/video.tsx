'use client'
import * as THREE from 'three'
import { useState, useEffect } from 'react'

export function Video({ src }) {
  const [video] = useState(() =>
    Object.assign(document.createElement('video'), {
      src,
      crossOrigin: 'Anonymous',
      loop: true,
      muted: true,
    })
  )
  useEffect(() => void video.play(), [video])
  return (
    <mesh
      position={[-2, 4, 0]}
      rotation={[0, Math.PI / 2, 0]}
      scale={[17, 10, 1]}
    >
      <planeGeometry />
      <meshBasicMaterial toneMapped={false}>
        <videoTexture
          attach='map'
          args={[video]}
          // @ts-ignore
          encoding={THREE.sRGBEncoding}
        />
      </meshBasicMaterial>
    </mesh>
  )
}

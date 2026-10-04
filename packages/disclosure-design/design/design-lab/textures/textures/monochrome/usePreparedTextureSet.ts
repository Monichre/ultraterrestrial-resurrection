import * as THREE from 'three'
import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

const textureManifest = {
  topo: {
    desktop: {
      color: '/textures/monochrome/topo_waves_portrait_lg.webp',
      luma: '/textures/monochrome/topo_waves_portrait_lg_luma.png',
      height: '/textures/monochrome/topo_waves_portrait_lg_height.png',
    },
    mobile: {
      color: '/textures/monochrome/topo_waves_portrait_md.webp',
      luma: '/textures/monochrome/topo_waves_portrait_md_luma.png',
      height: '/textures/monochrome/topo_waves_portrait_md_height.png',
    },
  },
  cloud: {
    desktop: {
      color: '/textures/monochrome/data_cloud_landscape_lg.webp',
      luma: '/textures/monochrome/data_cloud_landscape_lg_luma.png',
      height: '/textures/monochrome/data_cloud_landscape_lg_height.png',
    },
    mobile: {
      color: '/textures/monochrome/data_cloud_landscape_md.webp',
      luma: '/textures/monochrome/data_cloud_landscape_md_luma.png',
      height: '/textures/monochrome/data_cloud_landscape_md_height.png',
    },
  },
}

function prepColor(tex: THREE.Texture, maxAniso: number) {
  tex.colorSpace = THREE.SRGBColorSpace
  tex.flipY = false
  tex.anisotropy = Math.min(8, maxAniso)
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

function prepData(tex: THREE.Texture, maxAniso: number) {
  tex.colorSpace = THREE.NoColorSpace
  tex.flipY = false
  tex.anisotropy = Math.min(4, maxAniso)
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

export function usePreparedTextureSet(kind: keyof typeof textureManifest, mobile = false) {
  const { gl } = useThree()
  const maxAniso = gl.capabilities.getMaxAnisotropy()
  const paths = mobile ? textureManifest[kind].mobile : textureManifest[kind].desktop
  const textures = useTexture(paths)

  return useMemo(() => ({
    color: prepColor(textures.color, maxAniso),
    luma: prepData(textures.luma, maxAniso),
    height: prepData(textures.height, maxAniso),
  }), [textures, maxAniso])
}

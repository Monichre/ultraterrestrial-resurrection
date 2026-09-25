// AssetLoader.tsx

import { useMemo } from 'react'
import * as THREE from 'three'
import progressPromise from './progressPromise'
import { useLoader } from '@react-three/fiber'
import { TextureLoader, VideoTexture, LinearFilter } from 'three'

interface AssetLoaderProps {
  assetList: { [key: string]: string[] }
  isMobile: boolean
}

export function useAssetLoader({ assetList, isMobile }: AssetLoaderProps) {
  const assets: any = useMemo(() => ({ textures: {}, fonts: {} }), [])

  const textures = useLoader(
    TextureLoader,
    Object.keys(assetList).flatMap((month) => {
      return assetList[month]
        .filter((file) => !file.endsWith('.mp4'))
        .map((file) => `assets/${month}/${file}`)
    })
  )

  const videos = Object.keys(assetList).flatMap((month) => {
    return assetList[month]
      .filter((file) => file.endsWith('.mp4'))
      .map((file) => ({
        src: `/assets/${month}/${file}`,
        month,
        file,
      }))
  })
  // .map(video => {
  //   const videoElement = document.createElement('video');
  //   videoElement.style.height = '0';
  //   videoElement.muted = true;
  //   videoElement.loop = true;
  //   videoElement.crossOrigin = 'anonymous';
  //   videoElement.src = video.src;
  //   videoElement.load();
  //   document.body.appendChild(videoElement);

  //   return { videoElement, month: video.month, file: video.file };
  // });

  textures.forEach((texture) => {
    const [month, filename] = texture.image.src.split('/').slice(-2)
    if (!assets.textures[month]) {
      assets.textures[month] = {}
    }
    assets.textures[month][filename] = texture
  })

  // videos.forEach(({ videoElement, month, file }) => {
  //   const videoTexture = new VideoTexture(videoElement)
  //   videoTexture.minFilter = videoTexture.magFilter = LinearFilter
  //   videoTexture.anisotropy =
  //     new THREE.WebGLRenderer().capabilities.getMaxAnisotropy()

  //   if (!assets.textures[month]) {
  //     assets.textures[month] = {}
  //   }
  //   assets.textures[month][file] = videoTexture
  // })

  return assets
}

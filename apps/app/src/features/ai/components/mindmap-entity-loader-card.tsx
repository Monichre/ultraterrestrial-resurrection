'use client'

import {useRef, useCallback} from 'react'

const useWebcam = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageDataRef = useRef<ImageData | null>(null)

  const getImageData = useCallback(
    async (useCache: boolean) => {
      if (useCache && imageDataRef.current) return imageDataRef.current

      const canvas = canvasRef.current
      if (!canvas) return null

      const context = canvas.getContext('2d')
      if (!context) return null

      const newImageData = context.getImageData(0, 0, canvas.width, canvas.height)

      imageDataRef.current = newImageData

      return newImageData
    },
    [dimensions]
  )

  // Other hooks and logic...

  return {canvasRef, getImageData}
}

export default useWebcam

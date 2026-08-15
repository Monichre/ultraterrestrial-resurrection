'use client'

import { useState, useEffect } from 'react'

export const useRemoteImage = (url: string) => {
  console.log('url: ', url)
  const [imageUrl, setImageUrl]: any = useState(null)

  useEffect(() => {
    const getRemoteImage = async (url: string) => {
      const res: any = await fetch(`/api/image?imageUrl=${url}`)
      console.log('res: ', res)

      const img = await res.blob()
      console.log('img: ', img)
      // // console.log('img: ', img)
      // const objUrl = URL.createObjectURL(res)
      // console.log('objUrl: ', objUrl)
      setImageUrl(img)
    }
    getRemoteImage(url)
  }, [])

  return { imageUrl }
}

'use client'
import React, { useEffect, useRef } from 'react'

export type RenderLoggerProps = {
  id: any
  [key: string]: any // Add this line
}
export const RenderLogger = (props: RenderLoggerProps) => {
  const prevProps: React.MutableRefObject<RenderLoggerProps> = useRef(props)

  useEffect(() => {
    const changedProps = Object.keys(props).filter(
      (key: string) => props[key] !== prevProps.current[key]
    )

    if (changedProps.length > 0) {
      console.log('Component rendered due to changes in props:', changedProps)
    } else {
      console.log('Component rendered with no prop changes')
    }

    prevProps.current = props
  })

  return null
}

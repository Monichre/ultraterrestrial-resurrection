import { useCustomCursor } from '@/hooks/use-custom-cursor'
import React from 'react'
import './graph-paper.css'

interface GraphPaperBackgroundProps {
  children?: React.ReactNode
}

export const GraphPaperBackground = ( { children }: GraphPaperBackgroundProps ) => {
  useCustomCursor()

  return (
    <div className="graph-paper-bg relative w-full h-full">
      {children}
    </div>
  )
}



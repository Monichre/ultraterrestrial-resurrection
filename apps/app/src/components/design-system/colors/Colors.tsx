'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ColorPaletteProps {
  className?: string
}

export const ColorPalette = ({ className }: ColorPaletteProps) => {
  const colors = {
    paper: {
      'bg-paper': '#f4f1e8',
      'bg-paper-aged': '#e8e2d5',
    },
    ink: {
      'ink-black': '#1a1a1a',
      'ink-faded': '#4a4a4a',
    },
    fire: {
      'fire-orange': '#ff6b35',
      'fire-yellow': '#ffd23f',
    },
    atmosphere: {
      'smoke-gray': '#7d8491',
      'sky-dusk': '#8b95a7',
    },
    classified: {
      'danger-red': '#dc2626',
      'warning-amber': '#f59e0b',
      'secret-black': '#000000',
    },
    data: {
      'grid-lines': 'rgba(0, 0, 0, 0.15)',
      'noise-overlay': 'rgba(139, 129, 114, 0.3)',
    },
  }

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(colors).map(([category, categoryColors]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3 capitalize">{category.replace('-', ' ')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryColors).map(([name, value]) => (
              <div key={name} className="text-center">
                <div
                  className="w-full h-16 rounded-lg border border-gray-300 mb-2 shadow-sm"
                  style={{ backgroundColor: value }}
                />
                <div className="text-xs font-mono">{name}</div>
                <div className="text-xs text-gray-500">{value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export const ColorSwatch = ({ 
  color, 
  name, 
  className 
}: { 
  color: string
  name: string
  className?: string 
}) => {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div
        className="w-6 h-6 rounded border border-gray-300"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm font-mono">{name}</span>
    </div>
  )
}
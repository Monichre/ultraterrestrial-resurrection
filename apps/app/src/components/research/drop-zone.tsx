'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  isActive?: boolean
  className?: string
  children: React.ReactNode
}

export function DropZone({ isActive = false, className, children }: DropZoneProps) {
  return (
    <motion.div
      className={cn(
        'relative transition-all duration-200',
        isActive && 'scale-105',
        className
      )}
      animate={isActive ? {
        background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
        borderColor: 'rgba(34, 197, 94, 0.5)'
      } : {}}
    >
      {children}
    </motion.div>
  )
}
'use client'

import {motion} from 'framer-motion'
import {cn} from '@/utils'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  count?: number
  animated?: boolean
}

const skeletonVariants = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export function SkeletonLoader({
  className,
  variant = 'rectangular',
  width,
  height,
  count = 1,
  animated = true,
}: SkeletonLoaderProps) {
  const baseClasses = cn('bg-gray-200 dark:bg-gray-700', animated && 'animate-pulse', className)

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded'
      case 'circular':
        return 'rounded-full'
      case 'card':
        return 'h-32 rounded-lg'
      case 'rectangular':
      default:
        return 'rounded'
    }
  }

  const skeletonItem = (
    <motion.div
      className={cn(baseClasses, getVariantClasses())}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '100%'),
      }}
      variants={animated ? skeletonVariants : undefined}
      animate={animated ? 'animate' : undefined}
    />
  )

  if (count === 1) {
    return skeletonItem
  }

  return (
    <div className='space-y-2'>
      {Array.from({length: count}).map((_, index) => (
        <motion.div
          key={index}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: index * 0.1}}>
          {skeletonItem}
        </motion.div>
      ))}
    </div>
  )
}

// Specialized skeleton components for common use cases
export function ApplicationSkeleton() {
  return (
    <div className='flex flex-col items-center space-y-2 p-2'>
      <SkeletonLoader variant='rectangular' width={80} height={80} className='rounded-lg' />
      <SkeletonLoader variant='text' width={60} height={12} />
    </div>
  )
}

export function CommandSkeleton() {
  return (
    <div className='flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700'>
      <SkeletonLoader variant='circular' width={24} height={24} />
      <div className='flex-1 space-y-1'>
        <SkeletonLoader variant='text' width='60%' height={16} />
        <SkeletonLoader variant='text' width='40%' height={12} />
      </div>
    </div>
  )
}

export function ModelSelectionSkeleton() {
  return (
    <div className='space-y-3'>
      <SkeletonLoader variant='text' width='30%' height={20} />
      <div className='grid grid-cols-2 gap-2'>
        {Array.from({length: 4}).map((_, index) => (
          <SkeletonLoader key={index} variant='rectangular' height={40} className='rounded-lg' />
        ))}
      </div>
    </div>
  )
}

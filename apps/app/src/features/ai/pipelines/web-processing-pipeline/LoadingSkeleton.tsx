'use client'

import {motion} from 'motion/react'
import {Card} from '@/components/ui/card'
import {Skeleton} from '@/components/ui/skeleton'

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -20}}>
      <Card className='p-6 space-y-6 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer' />
        <div className='space-y-4'>
          <Skeleton className='h-8 w-3/4' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-1/3' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

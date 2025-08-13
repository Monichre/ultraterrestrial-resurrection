'use client'

import {motion, AnimatePresence} from 'framer-motion'
import {CheckCircle, Clock, AlertCircle, Loader2} from 'lucide-react'
import {cn} from '@/utils'

interface ProgressIndicatorProps {
  progress: number
  status: 'pending' | 'in-progress' | 'completed' | 'error'
  title: string
  description?: string
  className?: string
  showPercentage?: boolean
  animated?: boolean
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
  },
  'in-progress': {
    icon: Loader2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
}

export function ProgressIndicator({
  progress,
  status,
  title,
  description,
  className,
  showPercentage = true,
  animated = true,
}: ProgressIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-200',
        config.bgColor,
        config.borderColor,
        className
      )}
      initial={animated ? {opacity: 0, y: 10} : undefined}
      animate={animated ? {opacity: 1, y: 0} : undefined}
      exit={animated ? {opacity: 0, y: -10} : undefined}>
      <div className='flex items-start space-x-3'>
        <div className={cn('flex-shrink-0', config.color)}>
          <AnimatePresence mode='wait'>
            {status === 'in-progress' ? (
              <motion.div
                key='loading'
                initial={{rotate: 0}}
                animate={{rotate: 360}}
                transition={{duration: 1, repeat: Infinity, ease: 'linear'}}>
                <Icon className='w-5 h-5' />
              </motion.div>
            ) : (
              <motion.div
                key='static'
                initial={{scale: 0}}
                animate={{scale: 1}}
                transition={{type: 'spring', stiffness: 300, damping: 20}}>
                <Icon className='w-5 h-5' />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-medium text-gray-900 dark:text-white truncate'>{title}</h4>
            {showPercentage && (
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                {Math.round(progress)}%
              </span>
            )}
          </div>

          {description && (
            <p className='mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2'>
              {description}
            </p>
          )}

          {/* Progress Bar */}
          <div className='mt-2'>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
              <motion.div
                className={cn(
                  'h-1.5 rounded-full transition-colors duration-200',
                  status === 'completed' && 'bg-green-500',
                  status === 'in-progress' && 'bg-blue-500',
                  status === 'error' && 'bg-red-500',
                  status === 'pending' && 'bg-gray-400'
                )}
                initial={animated ? {width: 0} : undefined}
                animate={animated ? {width: `${progress}%`} : undefined}
                transition={animated ? {duration: 0.5, ease: 'easeOut'} : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Specialized progress indicators for common use cases
export function TaskProgressIndicator({
  tasks,
  onTaskRemove,
  className,
}: {
  tasks: Array<{
    id: string
    type: string
    status: 'pending' | 'in-progress' | 'completed' | 'error'
    progress: number
    title: string
    description?: string
  }>
  onTaskRemove?: (taskId: string) => void
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.2}}>
            <ProgressIndicator
              progress={task.progress}
              status={task.status}
              title={task.title}
              description={task.description}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function LoadingSpinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <motion.div
      className={cn('flex items-center justify-center', className)}
      initial={{opacity: 0}}
      animate={{opacity: 1}}>
      <motion.div
        className={cn('text-blue-500', sizeClasses[size])}
        animate={{rotate: 360}}
        transition={{duration: 1, repeat: Infinity, ease: 'linear'}}>
        <Loader2 className='w-full h-full' />
      </motion.div>
    </motion.div>
  )
}

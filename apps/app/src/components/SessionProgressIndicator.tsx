'use client'

import {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Loader2} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Progress} from '@/components/ui/progress'
import {BackgroundTask} from '@/contexts/SessionContext'
import {cn} from '@/utils'

interface SessionProgressIndicatorProps {
  tasks: BackgroundTask[]
  className?: string
  showDetails?: boolean
  onTaskRemove?: (taskId: string) => void
}

export function SessionProgressIndicator({
  tasks,
  className,
  showDetails: initialShowDetails = false,
  onTaskRemove,
}: SessionProgressIndicatorProps) {
  const [showDetails, setShowDetails] = useState(initialShowDetails)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const activeTasks = tasks.filter((task) => task.status === 'running' || task.status === 'pending')
  const completedTasks = tasks.filter((task) => task.status === 'completed')
  const failedTasks = tasks.filter((task) => task.status === 'failed')

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const getTaskIcon = (task: BackgroundTask) => {
    switch (task.status) {
      case 'pending':
        return <Clock className='w-3 h-3 text-yellow-400' />
      case 'running':
        return <Loader2 className='w-3 h-3 text-blue-400 animate-spin' />
      case 'completed':
        return <CheckCircle className='w-3 h-3 text-green-400' />
      case 'failed':
        return <XCircle className='w-3 h-3 text-red-400' />
      default:
        return <Clock className='w-3 h-3 text-gray-400' />
    }
  }

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'enrichment':
        return 'text-purple-400'
      case 'search':
        return 'text-blue-400'
      case 'analysis':
        return 'text-cyan-400'
      case 'connection':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  if (tasks.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      className={cn(
        'bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-3',
        'shadow-lg shadow-black/20',
        className
      )}>
      {/* Header */}
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            {activeTasks.length > 0 && <Loader2 className='w-3 h-3 text-blue-400 animate-spin' />}
            <span className='text-xs font-medium text-white/80'>Background Tasks</span>
          </div>
          <div className='flex items-center gap-1 text-xs text-white/60'>
            {activeTasks.length > 0 && (
              <span className='bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded'>
                {activeTasks.length} running
              </span>
            )}
            {completedTasks.length > 0 && (
              <span className='bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded'>
                {completedTasks.length} done
              </span>
            )}
            {failedTasks.length > 0 && (
              <span className='bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded'>
                {failedTasks.length} failed
              </span>
            )}
          </div>
        </div>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowDetails(!showDetails)}
          className='h-6 w-6 p-0 hover:bg-white/10'>
          {showDetails ? <ChevronUp className='w-3 h-3' /> : <ChevronDown className='w-3 h-3' />}
        </Button>
      </div>

      {/* Active Tasks Summary */}
      {activeTasks.length > 0 && (
        <div className='space-y-1 mb-2'>
          {activeTasks.slice(0, showDetails ? activeTasks.length : 2).map((task) => (
            <div key={task.id} className='flex items-center gap-2'>
              {getTaskIcon(task)}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-white/80 truncate'>{task.title}</span>
                  <span className='text-xs text-white/60 ml-2'>{task.progress.toFixed(0)}%</span>
                </div>
                <Progress value={task.progress} className='h-1.5 mt-1' />
              </div>
            </div>
          ))}

          {!showDetails && activeTasks.length > 2 && (
            <div className='text-xs text-white/60 text-center py-1'>
              +{activeTasks.length - 2} more tasks
            </div>
          )}
        </div>
      )}

      {/* Detailed View */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            className='space-y-2 overflow-hidden'>
            {/* All Tasks */}
            <div className='space-y-1 max-h-40 overflow-y-auto'>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  className='border border-white/10 rounded p-2 bg-black/20'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                      {getTaskIcon(task)}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-medium text-white/80 truncate'>
                            {task.title}
                          </span>
                          <span className={cn('text-xs capitalize', getTaskTypeColor(task.type))}>
                            {task.type}
                          </span>
                        </div>

                        {task.description && (
                          <p className='text-xs text-white/60 mt-1 truncate'>{task.description}</p>
                        )}

                        {(task.status === 'running' || task.status === 'pending') && (
                          <Progress value={task.progress} className='h-1 mt-1' />
                        )}

                        {task.status === 'failed' && task.error && (
                          <p className='text-xs text-red-300 mt-1 truncate'>Error: {task.error}</p>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center gap-1 ml-2'>
                      {(task.status === 'completed' || task.status === 'failed') &&
                        onTaskRemove && (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onTaskRemove(task.id)}
                            className='h-5 w-5 p-0 hover:bg-red-500/20 text-white/40 hover:text-red-300'>
                            <XCircle className='w-3 h-3' />
                          </Button>
                        )}

                      {task.data && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => toggleTaskExpansion(task.id)}
                          className='h-5 w-5 p-0 hover:bg-white/10'>
                          {expandedTasks.has(task.id) ? (
                            <ChevronUp className='w-3 h-3' />
                          ) : (
                            <ChevronDown className='w-3 h-3' />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Task Data */}
                  <AnimatePresence>
                    {expandedTasks.has(task.id) && task.data && (
                      <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: 'auto'}}
                        exit={{opacity: 0, height: 0}}
                        className='mt-2 pt-2 border-t border-white/10 overflow-hidden'>
                        <pre className='text-xs text-white/70 bg-black/30 p-2 rounded overflow-x-auto'>
                          {JSON.stringify(task.data, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Compact version for status bars
export function SessionProgressBadge({
  tasks,
  className,
}: {
  tasks: BackgroundTask[]
  className?: string
}) {
  const activeTasks = tasks.filter((task) => task.status === 'running' || task.status === 'pending')

  if (activeTasks.length === 0) {
    return null
  }

  const totalProgress =
    activeTasks.reduce((sum, task) => sum + task.progress, 0) / activeTasks.length

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.9}}
      animate={{opacity: 1, scale: 1}}
      className={cn(
        'flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs',
        className
      )}>
      <Loader2 className='w-3 h-3 animate-spin' />
      <span>{activeTasks.length} tasks</span>
      <div className='w-8 h-1 bg-blue-500/30 rounded-full overflow-hidden'>
        <motion.div
          className='h-full bg-blue-400'
          style={{width: `${totalProgress}%`}}
          transition={{duration: 0.3}}
        />
      </div>
    </motion.div>
  )
}

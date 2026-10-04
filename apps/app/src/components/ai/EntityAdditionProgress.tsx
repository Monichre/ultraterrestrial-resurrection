'use client'

import React, {useState, useEffect} from 'react'
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  Search,
  Database,
  Network,
  MapPin,
  Brain,
  Sparkles,
} from 'lucide-react'
import {motion, AnimatePresence, LayoutGroup} from 'framer-motion'

// Type definitions for our actual mindmap entity addition process
interface EntityAdditionStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  icon: React.ComponentType<{className?: string}>
  estimatedTime?: string
  tools?: string[]
}

interface EntityAdditionProgressProps {
  isVisible: boolean
  queryType?: string
  onComplete?: () => void
  onError?: (error: string) => void
}

export default function EntityAdditionProgress({
  isVisible,
  queryType = 'personnel',
  onComplete,
  onError,
}: EntityAdditionProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<EntityAdditionStep[]>([])

  // Detect reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Initialize steps based on query type
  useEffect(() => {
    if (!isVisible) return

    const entitySteps: EntityAdditionStep[] = [
      {
        id: 'query-processing',
        title: 'Processing Query',
        description: `Analyzing "${queryType}" search parameters`,
        status: 'pending',
        icon: Search,
        estimatedTime: '2s',
        tools: ['contextual-intelligence'],
      },
      {
        id: 'database-search',
        title: 'Searching Database',
        description: 'Querying Xata database with AI reasoning',
        status: 'pending',
        icon: Database,
        estimatedTime: '5-8s',
        tools: ['askXataWithAi', 'vector-search'],
      },
      {
        id: 'contextual-analysis',
        title: 'Contextual Analysis',
        description: 'Analyzing relevance and connections',
        status: 'pending',
        icon: Brain,
        estimatedTime: '3s',
        tools: ['prometheus-ai', 'graph-context'],
      },
      {
        id: 'node-positioning',
        title: 'Calculating Layout',
        description: 'Optimizing node positions to prevent overlap',
        status: 'pending',
        icon: MapPin,
        estimatedTime: '1s',
        tools: ['radial-layout', 'collision-detection'],
      },
      {
        id: 'graph-integration',
        title: 'Integrating Results',
        description: 'Adding nodes and edges with reasoning',
        status: 'pending',
        icon: Network,
        estimatedTime: '2s',
        tools: ['react-flow', 'sibling-edge'],
      },
      {
        id: 'enhancement',
        title: 'Enhancing Display',
        description: 'Applying contextual intelligence and visual polish',
        status: 'pending',
        icon: Sparkles,
        estimatedTime: '1s',
        tools: ['enhanced-nodes', 'spatial-grouping'],
      },
    ]

    setSteps(entitySteps)
    setCurrentStep(0)
  }, [isVisible, queryType])

  // Simulate the actual entity addition process timing
  useEffect(() => {
    if (!isVisible || steps.length === 0) return

    const progressSteps = async () => {
      const timings = [2000, 6000, 3000, 1000, 2000, 1000] // Real-world timings

      for (let i = 0; i < steps.length; i++) {
        // Start step
        setSteps((prev) =>
          prev.map((step, index) => (index === i ? {...step, status: 'in-progress'} : step))
        )

        setCurrentStep(i)

        // Wait for step duration
        await new Promise((resolve) => setTimeout(resolve, timings[i] || 2000))

        // Complete step
        setSteps((prev) =>
          prev.map((step, index) => (index === i ? {...step, status: 'completed'} : step))
        )

        // Brief pause between steps
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      // All steps completed
      setTimeout(() => {
        onComplete?.()
      }, 1000)
    }

    progressSteps().catch((error) => {
      console.error('Entity addition progress error:', error)
      onError?.(error.message)
    })
  }, [isVisible, steps.length, onComplete, onError])

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
      y: prefersReducedMotion ? 0 : 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.2, 0.65, 0.3, 0.9],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
      y: prefersReducedMotion ? 0 : -10,
      transition: {duration: 0.25},
    },
  }

  const stepVariants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: prefersReducedMotion ? 'tween' : 'spring',
        stiffness: 500,
        damping: 25,
      },
    },
  }

  const iconVariants = {
    pending: {
      scale: 1,
      rotate: 0,
      color: 'rgb(156, 163, 175)', // gray-400
    },
    'in-progress': {
      scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
      rotate: prefersReducedMotion ? 0 : [0, 5, 0],
      color: 'rgb(59, 130, 246)', // blue-500
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    completed: {
      scale: 1,
      rotate: 0,
      color: 'rgb(34, 197, 94)', // green-500
    },
    failed: {
      scale: 1,
      rotate: 0,
      color: 'rgb(239, 68, 68)', // red-500
    },
  }

  const progressBarVariants = {
    hidden: {width: '0%'},
    visible: {
      width: `${((currentStep + 1) / steps.length) * 100}%`,
      transition: {
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  if (!isVisible || steps.length === 0) return null

  const completedSteps = steps.filter((step) => step.status === 'completed').length
  const totalSteps = steps.length
  const currentStepData = steps[currentStep]

  return (
    <AnimatePresence mode='wait'>
      {isVisible && (
        <motion.div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4'
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}>
          <motion.div
            className='bg-card border-border rounded-lg border shadow-2xl w-full max-w-md overflow-hidden'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            layout>
            {/* Header */}
            <div className='p-4 border-b border-border bg-muted/30'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-semibold text-foreground'>Adding Entities</h3>
                  <p className='text-sm text-muted-foreground'>Searching for {queryType} records</p>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium text-foreground'>
                    {completedSteps}/{totalSteps}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {currentStepData?.estimatedTime && currentStepData.status === 'in-progress'
                      ? `~${currentStepData.estimatedTime}`
                      : 'Processing...'}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className='mt-3 h-2 bg-muted rounded-full overflow-hidden'>
                <motion.div
                  className='h-full bg-blue-500 rounded-full'
                  variants={progressBarVariants}
                  initial='hidden'
                  animate='visible'
                />
              </div>
            </div>

            {/* Steps */}
            <LayoutGroup>
              <div className='p-4 max-h-80 overflow-y-auto'>
                <ul className='space-y-3'>
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index === currentStep

                    return (
                      <motion.li
                        key={step.id}
                        className={`flex items-start space-x-3 p-2 rounded-md ${
                          isActive ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                        variants={stepVariants}
                        layout>
                        <motion.div
                          className='flex-shrink-0 mt-0.5'
                          animate={step.status}
                          variants={iconVariants}>
                          {step.status === 'completed' ? (
                            <CheckCircle2 className='h-4 w-4' />
                          ) : step.status === 'failed' ? (
                            <CircleAlert className='h-4 w-4' />
                          ) : step.status === 'in-progress' ? (
                            <CircleDotDashed className='h-4 w-4' />
                          ) : (
                            <Circle className='h-4 w-4' />
                          )}
                        </motion.div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center space-x-2'>
                            <Icon
                              className={`h-3.5 w-3.5 ${
                                step.status === 'completed'
                                  ? 'text-green-500'
                                  : step.status === 'in-progress'
                                    ? 'text-blue-500'
                                    : 'text-muted-foreground'
                              }`}
                            />
                            <h4
                              className={`text-sm font-medium ${
                                step.status === 'completed'
                                  ? 'text-green-700 line-through'
                                  : step.status === 'in-progress'
                                    ? 'text-blue-700'
                                    : 'text-foreground'
                              }`}>
                              {step.title}
                            </h4>
                          </div>

                          <p className='text-xs text-muted-foreground mt-1'>{step.description}</p>

                          {step.tools && step.tools.length > 0 && (
                            <div className='flex flex-wrap gap-1 mt-2'>
                              {step.tools.map((tool, toolIndex) => (
                                <motion.span
                                  key={toolIndex}
                                  className='inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary/50 text-secondary-foreground'
                                  initial={{opacity: 0, scale: 0.8}}
                                  animate={{
                                    opacity:
                                      step.status === 'in-progress' || step.status === 'completed'
                                        ? 1
                                        : 0.6,
                                    scale: 1,
                                    transition: {delay: toolIndex * 0.1},
                                  }}>
                                  {tool}
                                </motion.span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.li>
                    )
                  })}
                </ul>
              </div>
            </LayoutGroup>

            {/* Footer with current step highlight */}
            {currentStepData && (
              <motion.div className='p-3 border-t border-border bg-muted/30' layout>
                <div className='flex items-center space-x-2'>
                  <motion.div
                    animate={{
                      scale: prefersReducedMotion ? 1 : [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}>
                    <currentStepData.icon className='h-4 w-4 text-blue-500' />
                  </motion.div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-foreground'>{currentStepData.title}</p>
                    <p className='text-xs text-muted-foreground'>{currentStepData.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

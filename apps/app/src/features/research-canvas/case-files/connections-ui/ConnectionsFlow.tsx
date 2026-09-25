'use client'

import React, {useRef} from 'react'
import {type MotionValue, motion, useScroll, useTransform} from 'framer-motion'

import {cn} from '@/utils'
import {Card, CardContent} from '@/components/ui/card'

interface Node {
  id: string
  type: 'logic' | 'input' | 'output' | 'request'
  title: string
  value?: string
  x: number
  y: number
}

const nodes: Node[] = [
  {id: '1', type: 'logic', title: 'Logic', x: 50, y: 200},
  {
    id: '2',
    type: 'input',
    title: 'Input',
    value: 'logic was resolved to TRUE',
    x: 300,
    y: 100,
  },
  {
    id: '3',
    type: 'input',
    title: 'Input',
    value: 'logic was resolved to FAIL',
    x: 300,
    y: 250,
  },
  {id: '4', type: 'input', title: 'Input', value: '2500', x: 300, y: 400},
  {
    id: '5',
    type: 'request',
    title: 'Request',
    value: 'https://api.example.com/v1/data',
    x: 300,
    y: 550,
  },
  {id: '6', type: 'output', title: 'Output', value: '2500', x: 550, y: 400},
  {id: '7', type: 'output', title: 'Output', x: 800, y: 300},
]

const connections = [
  {from: '1', to: '2', color: '#FFB7C5'},
  {from: '1', to: '3', color: '#FFDDB7'},
  {from: '1', to: '4', color: '#B1C5FF'},
  {from: '1', to: '5', color: '#4FABFF'},
  {from: '2', to: '7', color: '#076EFF'},
  {from: '3', to: '7', color: '#FFB7C5'},
  {from: '4', to: '6', color: '#FFDDB7'},
  {from: '6', to: '7', color: '#B1C5FF'},
  {from: '5', to: '7', color: '#4FABFF'},
]

const transition = {
  duration: 0.8,
  ease: 'easeInOut',
}

export function ConnectionsFlowComponent({pathLengths}: {pathLengths: MotionValue[]}) {
  const containerRef = useRef<HTMLDivElement>(null)

  const getNodeById = (id: string) => nodes.find((node) => node.id === id)

  const createPath = (startX: number, startY: number, endX: number, endY: number) => {
    const midX = (startX + endX) / 2
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  }

  return (
    <div ref={containerRef} className='sticky top-20 w-full h-[800px] overflow-hidden p-4'>
      <div className='absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] opacity-10'>
        {Array.from({length: 1600}).map((_, i) => (
          <div key={`grid-${i}`} className='border-[0.5px] border-gray-500' />
        ))}
      </div>

      <svg
        className='absolute inset-0 size-full pointer-events-none'
        aria-labelledby='flowDiagramTitle'
        role='img'>
        <title id='flowDiagramTitle'>Connection Workflow Diagram</title>
        {connections.map((connection, index) => {
          const fromNode = getNodeById(connection.from)
          const toNode = getNodeById(connection.to)

          if (!fromNode || !toNode) return null

          const path = createPath(fromNode.x + 100, fromNode.y + 30, toNode.x, toNode.y + 30)

          return (
            <motion.path
              key={`path-${connection.from}-${connection.to}`}
              d={path}
              stroke={connection.color}
              style={{
                pathLength: pathLengths[index % pathLengths.length],
              }}
              strokeWidth={2}
              fill='none'
              initial={{pathLength: 0}}
              transition={transition}
            />
          )
        })}
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className='absolute'
          style={{left: node.x, top: node.y}}
          initial={{opacity: 0, scale: 0.8}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.3, delay: Number.parseInt(node.id) * 0.1}}>
          <Card
            className={cn(
              'w-[200px] bg-gray-900 border-gray-800',
              node.type === 'logic' && 'border-blue-500',
              node.type === 'request' && 'border-purple-500'
            )}>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <div
                  className={cn(
                    'size-2 rounded-full',
                    node.type === 'logic' && 'bg-blue-500',
                    node.type === 'input' && 'bg-gray-400',
                    node.type === 'output' && 'bg-gray-400',
                    node.type === 'request' && 'bg-purple-500'
                  )}
                />
                <span className='text-sm text-gray-400'>{node.title}</span>
              </div>
              {node.value && <p className='text-xs text-gray-500 break-all'>{node.value}</p>}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export function ConnectionsFlowDemo({title, description}: {title?: string; description?: string}) {
  const ref = React.useRef<HTMLDivElement>(null)

  // Use a scroll container setup that will work better with the animation
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.1'],
  })

  // Create path lengths with different thresholds to create a staggered animation
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const pathLengthSecond = useTransform(scrollYProgress, [0.05, 0.45], [0, 1])
  const pathLengthThird = useTransform(scrollYProgress, [0.1, 0.5], [0, 1])
  const pathLengthFourth = useTransform(scrollYProgress, [0.15, 0.55], [0, 1])
  const pathLengthFifth = useTransform(scrollYProgress, [0.2, 0.6], [0, 1])
  const pathLengthSix = useTransform(scrollYProgress, [0.25, 0.65], [0, 1])

  return (
    <div
      className='h-[200vh] w-full dark:border dark:border-white/[0.1] rounded-md relative overflow-hidden bg-black bg-grid-white/[0.1] bg-dot-white/[0.2]'
      ref={ref}>
      <div className='sticky top-0 pt-20 pb-10'>
        <p className='text-lg md:text-5xl font-normal pb-4 text-center bg-clip-text'>
          {title || 'Interactive Connection Flow'}
        </p>
        <p className='text-xs md:text-xl font-normal text-center text-neutral-400 mt-4 max-w-lg mx-auto'>
          {description || 'Scroll this component and see the workflow!'}
        </p>
        <ConnectionsFlowComponent
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
            pathLengthSix,
          ]}
        />
      </div>

      {/* Add more meaningful content at the bottom to enhance the scrolling experience */}
      <div className='h-[50vh] flex items-center justify-center flex-col gap-4 text-center p-8'>
        <p className='text-lg text-white/70'>Scroll back up to see the animation again</p>
        <p className='text-sm text-white/50 max-w-md'>
          The connections animate based on your scroll position. Each path animates progressively to
          create a staggered effect.
        </p>
      </div>
    </div>
  )
}

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
  duration: 0,
  ease: 'linear',
}
export function ConnectionsFlow({pathLengths}: {pathLengths: MotionValue[]}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const getNodeById = (id: string) => nodes.find((node) => node.id === id)

  const createPath = (startX: number, startY: number, endX: number, endY: number) => {
    const midX = (startX + endX) / 2
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  }

  return (
    <div ref={containerRef} className='sticky top-80 relative w-full h-[800px] overflow-hidden p-4'>
      <div className='absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] opacity-10'>
        {Array.from({length: 1600}).map((_, i) => (
          <div key={i} className='border-[0.5px] border-gray-500' />
        ))}
      </div>

      <svg className='absolute inset-0 size-full pointer-events-none'>
        {connections.map((connection, index) => {
          const fromNode = getNodeById(connection.from)!
          const toNode = getNodeById(connection.to)!
          const path = createPath(fromNode.x + 100, fromNode.y + 30, toNode.x, toNode.y + 30)

          return (
            <motion.path
              key={index}
              d={path}
              stroke={connection.color}
              style={{
                pathLength: pathLengths[index],
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

export function EntityConnectionsFlow({
  title,
  description,
}: {
  title?: string
  description?: string
}) {
  const ref = React.useRef(null)
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2])
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2])
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2])
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2])
  const pathLengthSix = useTransform(scrollYProgress, [0, 0.8], [0, 1.2])

  return (
    <div
      className='h-[400vh] w-full dark:border dark:border-white/[0.1] rounded-md relative overflow-clip'
      ref={ref}>
      <p className='text-lg md:text-7xl font-normal pb-4 text-center bg-clip-text'>
        {title || `Build with BuouUI`}
      </p>
      <p className='text-xs md:text-xl font-normal text-center text-neutral-400 mt-4 max-w-lg mx-auto'>
        {description || `Scroll this component and see the workflow!`}
      </p>
      <ConnectionsFlow
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
          pathLengthSix,
          pathLengthSix,
          pathLengthSix,
          pathLengthSix,
        ]}
      />
    </div>
  )
}

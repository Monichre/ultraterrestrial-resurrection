'use client'

import {useRef, useState, useMemo, useEffect} from 'react'
import {motion, useScroll, useTransform} from 'framer-motion'
import gsap from 'gsap'
import {cn} from '@/utils'
import {Card, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {PlusIcon, RefreshCwIcon} from 'lucide-react'

interface CustomNode {
  id: string
  type: 'logic' | 'input' | 'output' | 'request'
  title: string
  value?: string
  x: number
  y: number
}

interface Connection {
  from: string
  to: string
  color: string
}

export function CustomEntityConnectionsFlow() {
  const [nodes, setNodes] = useState<CustomNode[]>([
    {id: '1', type: 'logic', title: 'Start', x: 50, y: 200},
    {id: '2', type: 'input', title: 'User Input', value: 'Form Data', x: 300, y: 100},
    {id: '3', type: 'request', title: 'API Call', value: 'POST /api/submit', x: 550, y: 100},
    {id: '4', type: 'output', title: 'Response', value: 'Success: 200', x: 800, y: 100},
  ])

  const [connections, setConnections] = useState<Connection[]>([
    {from: '1', to: '2', color: '#FFB7C5'},
    {from: '2', to: '3', color: '#B1C5FF'},
    {from: '3', to: '4', color: '#4FABFF'},
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Set up scroll tracking with the right offset to ensure animation triggers
  const {scrollYProgress} = useScroll({
    // Important: Track the whole wrapper, not just the container
    target: wrapperRef,
    // Start animation when target enters view, end when it leaves
    offset: ['start 0.9', 'end 0.1'],
  })

  // Create separate path length values for each connection to stagger animation
  const pathLengths = useMemo(() => {
    return connections.map((_, i) => {
      // Stagger the animation slightly for each path
      return useTransform(scrollYProgress, [0, 0.6], [0, 1])
    })
  }, [scrollYProgress, connections])

  const getNodeById = (id: string) => nodes.find((node) => node.id === id)

  const createPath = (startX: number, startY: number, endX: number, endY: number) => {
    const midX = (startX + endX) / 2
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  }

  const addNode = () => {
    const newId = (nodes.length + 1).toString()
    const newNode: CustomNode = {
      id: newId,
      type: 'input',
      title: `Node ${newId}`,
      value: 'New node',
      x: 300,
      y: 200 + ((nodes.length * 80) % 400),
    }

    setNodes([...nodes, newNode])

    // Add a connection from the first node to this new node
    if (nodes.length > 0) {
      setConnections([
        ...connections,
        {
          from: '1',
          to: newId,
          color: `hsl(${Math.random() * 360}, 80%, 70%)`,
        },
      ])
    }
  }

  const resetWorkflow = () => {
    setNodes([
      {id: '1', type: 'logic', title: 'Start', x: 50, y: 200},
      {id: '2', type: 'input', title: 'User Input', value: 'Form Data', x: 300, y: 100},
      {id: '3', type: 'request', title: 'API Call', value: 'POST /api/submit', x: 550, y: 100},
      {id: '4', type: 'output', title: 'Response', value: 'Success: 200', x: 800, y: 100},
    ])

    setConnections([
      {from: '1', to: '2', color: '#FFB7C5'},
      {from: '2', to: '3', color: '#B1C5FF'},
      {from: '3', to: '4', color: '#4FABFF'},
    ])
  }

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        '.node-card',
        {scale: 0.8, opacity: 0},
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      )
    }
  }, []) // Only run on mount, not when nodes change

  return (
    <div ref={wrapperRef} className='relative h-[150vh] w-full'>
      <div className='sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 flex justify-center gap-4 border-b'>
        <Button onClick={addNode} size='sm'>
          <PlusIcon className='h-4 w-4 mr-2' /> Add Node
        </Button>
        <Button onClick={resetWorkflow} variant='outline' size='sm'>
          <RefreshCwIcon className='h-4 w-4 mr-2' /> Reset
        </Button>
      </div>

      <div
        ref={containerRef}
        className='sticky top-24 w-full h-[500px] overflow-hidden p-4 border rounded-lg my-8'>
        <div className='absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] opacity-10'>
          {Array.from({length: 1600}).map((_, i) => (
            <div key={`grid-${i}`} className='border-[0.5px] border-gray-500' />
          ))}
        </div>

        <svg
          className='absolute inset-0 size-full pointer-events-none'
          aria-labelledby='flowTitle'
          role='img'>
          <title id='flowTitle'>Connection Flow Diagram</title>
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
                  pathLength: pathLengths[index],
                }}
                strokeWidth={2}
                fill='none'
                initial={{pathLength: 0}}
                transition={{duration: 1.5, delay: index * 0.2}}
              />
            )
          })}
        </svg>

        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className='absolute node-card'
            style={{left: node.x, top: node.y}}
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.3, delay: Number.parseInt(node.id) * 0.1}}>
            <Card
              className={cn(
                'w-[200px] bg-gray-900 border-gray-800',
                node.type === 'logic' && 'border-blue-500',
                node.type === 'request' && 'border-purple-500',
                node.type === 'input' && 'border-green-500',
                node.type === 'output' && 'border-amber-500'
              )}>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <div
                    className={cn(
                      'size-2 rounded-full',
                      node.type === 'logic' && 'bg-blue-500',
                      node.type === 'input' && 'bg-green-500',
                      node.type === 'output' && 'bg-amber-500',
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

      {/* Add some text at the bottom so there's something to scroll to */}
      <div className='h-[60vh] flex items-center justify-center flex-col gap-4 text-center p-8'>
        <p className='text-lg opacity-70'>Scroll back up to see the animation again</p>
        <p className='text-sm opacity-50 max-w-md'>
          The connections are animated based on scroll position. As you scroll up and down, the
          paths will animate accordingly.
        </p>
      </div>
    </div>
  )
}

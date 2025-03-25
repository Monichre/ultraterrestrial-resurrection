/* eslint-disable react/display-name */
'use client'

import { Handle, Position, type Node } from '@xyflow/react'
import { memo, useEffect, useState } from 'react'

import { Card } from '@/components/ui/card'
// import { useGraph } from '@/contexts/graph/graph-context'

type CardProps = React.ComponentProps<typeof Card>

import { BlurAppear } from '@/components/animated/animated-wrappers'
import { RootNodeCard } from '@/features/mindmap/components/cards/root-node-card/root-node-card'
import { useMindMap } from '@/contexts'
// import { useLayoutedElements } from '@/features/mindmap/graph'

type NumberNode = Node<{ number: number }, 'number'>

export type RootNode = Node<{
  data: {
    name: string
    type: string
    childCount: number
    label: string
    url: string
    handles: string[]
    concise?: boolean
  }
  handles?: string[]
}>

const RN = ( node: RootNode ) => {
  console.log( 'node: ', node )
  const { useUpdateNodeInternals, useNodesData } = useMindMap()
  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles]: any = useState( [] )
  const nodeData = useNodesData( node.id )
  console.log( 'nodeData: ', nodeData )

  useEffect( () => {
    if ( node?.data?.handles && node.data?.handles.length ) {
      const { data } = node

      setHandles( data.handles )
      updateNodeInternals( node.id )
    }

    // if (node?.data?.concise) {
    //   updateNodeInternals(node.id)
    // }
  }, [node, updateNodeInternals, nodeData] )
  const container = {
    hidden: { opacity: 0, height: 0, width: 0 },
    show: {
      opacity: 1,
      height: 'auto',
      width: 'auto',
      transition: {
        delayChildren: 0.5,
        type: 'spring',
        stiffness: 100,
      },
    },
  }
  return (
    <BlurAppear>
      <div className='border border-white/50 rounded-[calc(var(--radius)-2px)] relative w-fit h-fit'>
        {handles && handles?.length
          ? handles.map( ( id: string ) => (
            <Handle
              key={id}
              type='source'
              position={Position.Bottom}
              id={id}
              isConnectable={true}
            />
          ) )
          : null}
        <RootNodeCard nodeData={node} />
      </div>
    </BlurAppear>
  )
}

export const RootNode = memo( RN )

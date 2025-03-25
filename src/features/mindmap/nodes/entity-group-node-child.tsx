/* eslint-disable react/display-name */
'use client'
import { memo, useEffect, useState } from 'react'

import { BlurAppear } from '@/components/animated'
import { renderEntity } from '@/features/mindmap/components/cards/render-entity-card'
import { useMindMap } from '@/contexts'
import { Handle, Position } from '@xyflow/react'

interface Photo {
  id: string
  name: string
  mediaType: string
  enablePublicUrl: boolean
  signedUrlTimeout: number
  uploadUrlTimeout: number
  size: number
  version: number
  url: string
}

const ENC = memo( ( node: any ) => {
  const { useUpdateNodeInternals, useNodesData } = useMindMap()
  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles]: any = useState( [] )
  const nodeData = useNodesData( node.id )

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

  const component = renderEntity( {
    type: node.data.type,
    data: {
      ...node.data,
      id: node.id,
    },
  } )



  const markUp = (
    <BlurAppear
      className={`rounded-[calc(var(--radius)-2px)] relative h-auto ${node.parentId} ${node.className} w-full`}
    >
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
      <Handle type='target' position={Position.Top} />

      {component}
    </BlurAppear>
  )

  // if (domNode) {
  //   return createPortal(markUp, domNode)
  // }

  return markUp
} )

export const EntityGroupNodeChild = memo( ENC )

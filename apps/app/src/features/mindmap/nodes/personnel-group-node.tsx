 
'use client'
import { memo, useEffect, useState } from 'react'


import { KeyFiguresIcon } from '@/components/icons'
import { CoreNodeBottom, CoreNodeContainer, CoreNodeContent } from '@/features/mindmap/nodes/core-node-ui'

import { useMindMap } from '@/contexts'
import { Handle, Position } from '@xyflow/react'
import { SparklesIcon } from 'lucide-react'


export const AiButton: React.FC = () => {
  return (
    <button
      className="group flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-neutral-400/15 active:bg-neutral-400/25"
      type="button"
    >
      <SparklesIcon aria-hidden="true" className="w-4 h-4 text-neutral-400" />
      <span className="w-0 overflow-hidden transition-all duration-500 group-hover:w-20">
        <span className="whitespace-nowrap text-neutral-400 text-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          Ask AI
        </span>
      </span>
    </button>
  )
}

const PersonnelGroupNode = memo( ( node: any ) => {
  const { useUpdateNodeInternals, useNodesData, updateNode } = useMindMap()
  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles]: any = useState( [] )
  const nodeData = useNodesData( node.id )
  console.log( 'nodeData: ', nodeData )
  const type = nodeData.id.split( '-' )[0]

  useEffect( () => {
    if ( node?.data?.handles && node.data?.handles.length ) {
      const { data } = node

      setHandles( data.handles )
      updateNodeInternals( node.id )
    }

    if ( node?.data?.concise ) {
      updateNodeInternals( node.id )
    }
  }, [node, updateNodeInternals, nodeData] )



  return (
    <>

      <CoreNodeContainer id={node.id} className=' motion-opacity-in-0 h-full w-full' style={{
        minHeight: node?.initialHeight,
        minWidth: node?.initialWidth,
      }}>
        <CoreNodeContent>
          {/* <p className='text-sm text-white font-nunito'>{nodeData?.data?.input}</p> */}
          <p>|</p>
        </CoreNodeContent>
        <CoreNodeBottom>
          <KeyFiguresIcon />
          <div>
            <AiButton />
          </div>
        </CoreNodeBottom>
      </CoreNodeContainer>

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
    </>
  )
} )

PersonnelGroupNode.displayName = 'PersonnelGroupNode'
export { PersonnelGroupNode }

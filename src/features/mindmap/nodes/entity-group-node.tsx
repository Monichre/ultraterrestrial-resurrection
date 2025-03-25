/* eslint-disable react/display-name */
'use client'
import { memo, useEffect, useState } from 'react'

import { Handle, Position } from '@xyflow/react'

import { BlurAppear } from '@/components/animated/animated-wrappers'
import { useMindMap } from '@/contexts'
import { renderEntityGroup } from '@/features/mindmap/components/cards/render-entity-card'
import './nodes.css'

const dayjs = require( 'dayjs' )
const utc = require( 'dayjs/plugin/utc' )
dayjs.extend( utc )
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

const GN = memo( ( props: any ) => {
  const { useUpdateNodeInternals, useNodesData, updateNode } = useMindMap()
  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles]: any = useState( [] )
  const nodeData = useNodesData( props.id )
  console.log( 'nodeData: ', nodeData )
  const type = nodeData.id.split( '-' )[0]

  useEffect( () => {
    if ( props?.data?.handles && props.data?.handles.length ) {
      const { data } = props

      setHandles( data.handles )
      updateNodeInternals( props.id )
    }

    // if (props?.data?.concise) {
    //   updateNodeInternals(props.id)
    // }
  }, [props, updateNodeInternals, nodeData] )

  // useEffect( () => {
  //   if ( type === 'topics' ) {
  //     updateNode( props.id, {
  //       style: {
  //         height: GROUP_NODE_WIDTH,
  //         width: GROUP_NODE_HEIGHT,
  //       },
  //     } )
  //   }
  // }, [props.id, type, updateNode] )

  return (

    <>
      <Handle type="target" position={Position.Top} />

      <BlurAppear className=" motion-opacity-in-0" id={props.id}>


        {handles && handles.length
          ? handles.map( ( id: string ) => (
            <Handle
              key={id}
              type="source"
              position={Position.Bottom}
              id={id}
              isConnectable={true}
            />
          ) )
          : null}


        <div className="overflow-hidden rounded-3xl bg-white dark:bg-black">
          {renderEntityGroup( {
            type: type,
            data: {
              ...nodeData,
              ...props,
            },
          } )}
        </div>
        {/* <div className='absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent' /> */}
      </BlurAppear>
    </>
  )
} )

export const EntityGroupNode = memo( GN )

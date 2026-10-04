/* eslint-disable react/display-name */
'use client'
import { memo, useEffect, useState } from 'react'


import { SubjectMatterExpertCard } from '@/features/mindmap/components/cards/subject-matter-expert-card'
import { useMindMap } from '@/contexts'

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

const PN = memo( ( node: any ) => {
  console.log( 'node: ', node )
  const { useUpdateNodeInternals, useNodesData } = useMindMap()
  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles]: any = useState( [] )
  const nodeData = useNodesData( node.id )
  const type = node.data.type

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
  // relative min-w-[300px] !w-[300px]
  {
    /* // <BlurAppear> */
  }
  const { data, ...rest } = node
  const card = {
    ...rest,
    ...data,
    ...nodeData.data
  }
  return (
    <div id={`${node.id}-child`}>

      <SubjectMatterExpertCard card={card} />
    </div>

    // <Handle type='target' position={Position.Top} />



    // {handles && handles?.length
    //   ? handles.map( ( id: string ) => (
    //     <Handle
    //       key={id}
    //       type='source'
    //       position={Position.Bottom}
    //       id={id}
    //       isConnectable={true}
    //     />
    //   ) )
    //   : null}
  )

} )

export const PersonnelGroupNodeChild = memo( PN )

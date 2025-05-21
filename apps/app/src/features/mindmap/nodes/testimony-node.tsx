'use client'

import { memo, useEffect, useState } from 'react'
import { TestimonyCard } from '../components/cards/testimony-card'

import { useMindMap } from '@/contexts'
import { Handle, Position } from '@xyflow/react'

{
  /* <div class="_animate-running_150t4_1 _speed-normal_150t4_5 nodrag overflow-hidden rounded-3xl bg-white dark:bg-black" style="opacity: 1; will-change: auto;"><main id="e6c86507-11ca-4479-bcc6-583abe5d1381" class="space-y-3.5 w-96 border-2 p-1.5 rounded-3xl duration-200 border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 group hover:border-indigo-200 dark:hover:border-indigo-800"><section class="overflow-visible relative rounded-2xl duration-200 border-2 bg-neutral-50 px-4 py-5 shadow-lg shadow-neutral-200/50 dark:bg-neutral-950 dark:shadow-neutral-800/50 border-neutral-200 dark:border-neutral-800"><div class="nodrag peer/wrap relative flex w-full flex-col items-stretch gap-2 font-medium text-neutral-600 duration-500 dark:text-neutral-50"><div class="flex flex-col gap-3 font-inter"><div class="mark-scroll-bar overflow-y-auto"><p class="w-full cursor-text select-text whitespace-pre-wrap pr-2 align-middle text-sm leading-6 selection:bg-white/50">Create the beginning architecture for a mindmap designed to connect all the data points within the ufology/disclosure topic</p></div></div></div></section><div class="flex w-full items-center justify-between px-1 font-mono text-[0.65rem]"><div class="flex items-center gap-1 rounded-full bg-neutral-200 py-1 pl-2 pr-2.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"><div class="size-5"><span class="relative flex shrink-0 overflow-hidden rounded-full absolute aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200 pointer-events-none" data-state="closed" style="border-color: rgba(255, 255, 255, 0.5); transform: translateX(0px);"><img class="aspect-square size-full object-cover" src="https://avatars.githubusercontent.com/u/12517531?v=4"></span></div></div><span>09-29 04:29</span></div></main><button class="invisible ring-neutral-950/10 dark:ring-neutral-50/10 absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-neutral-200 p-1 outline-none ring-2 duration-200 md:hover:block md:peer-hover/wrap:block dark:bg-neutral-800" data-state="closed"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-180 h-4 w-4 duration-200"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></button><div data-handleid="in" data-nodeid="e6c86507-11ca-4479-bcc6-583abe5d1381" data-handlepos="top" data-id="1-e6c86507-11ca-4479-bcc6-583abe5d1381-in-target" class="react-flow__handle react-flow__handle-top nodrag nopan pointer-events-none invisible target connectable connectablestart connectableend connectionindicator"></div><div data-handleid="out" data-nodeid="e6c86507-11ca-4479-bcc6-583abe5d1381" data-handlepos="bottom" data-id="1-e6c86507-11ca-4479-bcc6-583abe5d1381-out-source" class="react-flow__handle react-flow__handle-bottom nodrag nopan pointer-events-none invisible source connectable connectablestart connectableend connectionindicator"></div></div> */
}
const TN = memo( ( node: any ) => {
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
  return (
    <>
      <Handle type='target' position={Position.Top} />
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

      <TestimonyCard
        card={{
          id: nodeData?.id,
          ...nodeData.data,
        }}
        key={node.id}
      />
    </>
  )
} )

TN.displayName = 'TestimonyNode'

export const TestimonyNode = memo( TN )

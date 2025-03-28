'use client'

import { useEffect, useState } from 'react'

import { timer } from 'd3-timer'
import { useReactFlow } from '@xyflow/react'

export type UseAnimatedNodeOptions = {
  animationDuration?: number
}

function useAnimatedNodes(
  nodes: Node[],
  { animationDuration = 300 }: UseAnimatedNodeOptions = {}
) {
  const [tmpNodes, setTmpNodes] = useState(nodes)
  const { getNode } = useReactFlow()

  useEffect(() => {
    const transitions = nodes.map((node: any) => ({
      id: node.id,
      from: getNode(node.id)?.position ?? node.position,
      to: node.position,
      node,
    }))

    const t = timer((elapsed: any) => {
      const s = elapsed / animationDuration

      const currNodes = transitions.map(({ node, from, to }) => {
        return {
          ...node,
          position: {
            x: from.x + (to.x - from.x) * s,
            y: from.y + (to.y - from.y) * s,
          },
        }
      })

      setTmpNodes(currNodes)

      if (elapsed > animationDuration) {
        // it's important to set the final nodes here to avoid glitches
        setTmpNodes(nodes)
        t.stop()
      }
    })

    return () => t.stop()
  }, [nodes, getNode, animationDuration])

  return { nodes: tmpNodes }
}

export default useAnimatedNodes

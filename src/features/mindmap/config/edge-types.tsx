import { FloatingEdge } from '@/features/mindmap/edges/FloatingEdge'
import { FlowEdge } from '@/features/mindmap/edges/FlowEdge'
import { SequentialEdge } from '@/features/mindmap/edges/SequentialEdge'
import { SiblingEdge } from '@/features/mindmap/edges/SiblingEdge'
import { SmartStepEdge } from '@tisoap/react-flow-smart-edge'

export const edgeTypes: any = {
  siblingEdge: SiblingEdge,
  floating: FloatingEdge,
  sequential: SequentialEdge,
  smart: SmartStepEdge,
  flowEdge: FlowEdge,
  // rootEdge: RootEdge,
}

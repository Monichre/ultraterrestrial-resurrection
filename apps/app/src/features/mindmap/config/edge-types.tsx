import {BaseEdge, BezierEdge, SmoothStepEdge, StraightEdge} from '@xyflow/react'
import {AnimatedSvgEdge} from '@/features/mindmap/edges/animated-svg-edge'
import {DataEdge} from '@/features/mindmap/edges/data-edge'
import {AIAnimatedEdge} from '@/features/mindmap/edges/ai-animated-edge'

export const edgeTypes = {
  default: BezierEdge,
  straight: StraightEdge,
  smoothstep: SmoothStepEdge,
  bezier: BezierEdge,
  baseEdge: BaseEdge,
  animatedSvgEdge: AnimatedSvgEdge,
  dataEdge: DataEdge,
  aiAnimatedEdge: AIAnimatedEdge,
}

import {BezierEdge, SmoothStepEdge, StraightEdge} from '@xyflow/react'
import {AnimatedSvgEdge} from '@/features/mindmap/edges/animated-svg-edge'
import {DataEdge} from '@/features/mindmap/edges/data-edge'
import {AIAnimatedEdge} from '@/features/mindmap/edges/ai-animated-edge'
import {SiblingEdge} from '@/features/mindmap/edges/SiblingEdge'

export const edgeTypes = {
  default: BezierEdge,
  straight: StraightEdge,
  smoothstep: SmoothStepEdge,
  bezier: BezierEdge,
  animatedSvgEdge: AnimatedSvgEdge,
  dataEdge: DataEdge,
  aiAnimatedEdge: AIAnimatedEdge,
  siblingEdge: SiblingEdge,
}

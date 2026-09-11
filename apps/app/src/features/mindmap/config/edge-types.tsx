import {BezierEdge, SmoothStepEdge, StraightEdge} from '@xyflow/react'
import {AnimatedSvgEdge} from '@/features/mindmap/edges/animated-svg-edge'
import {DataEdge} from '@/features/mindmap/edges/data-edge'
import {AIAnimatedEdge} from '@/features/mindmap/edges/ai-animated-edge'
import {SiblingEdge} from '@/features/mindmap/edges/SiblingEdge'
import {NarrativeEdge} from '@/features/guided-tours/shared/edges/NarrativeEdge'
import {TOUR_NARRATIVE_EDGE_TYPE} from '@/features/guided-tours/shared/types/flow-model'

export const edgeTypes = {
  // Guided-tour narrative path (T-050 s3): claim → basis → counterpoint …
  [TOUR_NARRATIVE_EDGE_TYPE]: NarrativeEdge,
  default: BezierEdge,
  straight: StraightEdge,
  smoothstep: SmoothStepEdge,
  bezier: BezierEdge,
  animatedSvgEdge: AnimatedSvgEdge,
  dataEdge: DataEdge,
  aiAnimatedEdge: AIAnimatedEdge,
  siblingEdge: SiblingEdge,
}

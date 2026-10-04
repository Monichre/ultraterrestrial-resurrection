'use client'

import { Timeline } from './timeline'

export interface ThreeDTimelineJourneyProps {
  events: any
  experts: any
}

export const ThreeDTimelineJourney: React.FC<ThreeDTimelineJourneyProps> = ({
  events,
  experts,
}: ThreeDTimelineJourneyProps) => {
  return <Timeline events={events} experts={experts} />

  // // Initial HMR Setup
}
// if (module.hot) {
//   module.hot.accept()

//   module.hot.dispose(() => {
//     window.assets = timeline.assets
//     timeline.renderer.domElement.removeEventListener('wheel', timeline.scroll)
//     removeEventListener('resize', timeline.resize)
//     timeline.renderer.domElement.removeEventListener(
//       'mousedown',
//       timeline.mouseDown
//     )
//     timeline.renderer.domElement.removeEventListener(
//       'mouseup',
//       timeline.mouseUp
//     )
//     removeEventListener('mousemove', timeline.mouseMove)
//     document.querySelector('canvas').remove()
//     timeline.renderer.forceContextLoss()
//     timeline.renderer.context = null
//     timeline.renderer.domElement = null
//     timeline.renderer = null
//     cancelAnimationFrame(timeline.animationId)

//     timeline.gesture.destroy()
//   })
// }

// const timeline = new Timeline()
// window.timeline = timeline

export type TransitionProps = {
  transition: {
    duration: number
    easing:
      | 'anticipate'
      | 'backIn'
      | 'backOut'
      | 'backInOut'
      | 'circIn'
      | 'circOut'
      | 'circInOut'
      | 'easeIn'
      | 'easeOut'
      | 'easeInOut'
  }
  children?: any
}

export interface AnimatedComponentProps {
  animation: AnimationConfig
  children: any
}

export type AnimationFields = {
  slide: boolean
  fade: boolean
  scale: boolean
  animateInnerBlocks: boolean
  duration: number
  delay: number
  type: `entry` | `exit`
  direction: `up` | `down` | `left` | `right`
}
export type Animation = {
  entry?: AnimationFields
  exit?: AnimationFields
}
const determineOriginOrDestination

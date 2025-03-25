import { MotionAnimatedDivProps, animationConfig } from './config.animations'

export const configureAnimationSequence = (
  animation: any
): MotionAnimatedDivProps => {
  const { direction, duration = 1, delay = 0, exit } = animation
  const animationStyle = !direction
    ? `${booleanToString(animation)}-in}`
    : direction === 'split-h'
    ? direction
    : `${booleanToString(animation)}-in-${direction}`

  return {
    ...animationConfig[animationStyle],
    duration: convertToSeconds(duration),
    delay,
    exit,
  }
}

export const convertToSeconds = (value: number, threshold = 1000): number => {
  if (value >= threshold) {
    return value / 1000
  }
  return value
}

export const booleanToString = ({ slide, fade }: any) =>
  slide && fade ? 'slide-fade' : slide ? 'slide' : 'fade'

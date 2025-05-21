import { motion } from 'framer-motion'

export function Grain({ opacity, style }: any) {
  const keyframesX = [
    '0%',
    '-5%',
    '-15%',
    '7%',
    '-5%',
    '-15%',
    '15%',
    '0%',
    '3%',
    '-10%',
  ]
  const keyframesY = [
    '0%',
    '-10%',
    '5%',
    '-25%',
    '25%',
    '10%',
    '0%',
    '15%',
    '35%',
    '10%',
  ]
  const containerStyle = {
    backgroundSize: '256px 256px',
    backgroundRepeat: 'repeat',
    background:
      "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          ...containerStyle,
          opacity: opacity,
          inset: '-200%',
          width: '400%',
          height: '400%',
          position: 'absolute',
        }}
        animate={{ x: keyframesX, y: keyframesY }}
        transition={{
          // ease: steps(10, "start"),
          repeat: Infinity,
          duration: 8,
        }}
      />
    </div>
  )
}

Grain.defaultProps = {
  opacity: 0.5,
}

import React, { memo } from 'react'
import { ShootingStars } from './ShootingStars'
import { StarsBackground } from './stars-background'

export const ShootingStarsBackground = memo(() => (
  <>
    <ShootingStars />
    <StarsBackground />
  </>
))

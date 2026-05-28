'use client'

import dynamic from 'next/dynamic'

const CanvasCursor = dynamic(
  () => import('@/components/ui/canvas-cursor').then((mod) => mod.CanvasCursor),
  {
    ssr: false,
  }
)

const ShootingStars = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.ShootingStars),
  {
    ssr: false,
  }
)
const StarsBackground = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.StarsBackground),
  {
    ssr: false,
  }
)

const PlanetaryIntro = dynamic(
  () =>
    import('@/layouts/home/planetary-intro').then((mod) => mod.PlanetaryIntro),
  { ssr: false }
)

export type HomeProps = {}

export const Home: React.FC<HomeProps> = () => {
  return (
    <div className='h-[100vh] w-[100vw] relative overflow-hidden bg-black'>
      {/* Background star layers (DOM) sit behind the unified WebGL scene */}
      <ShootingStars />
      <StarsBackground />

      {/* Single cinematic R3F scene + GSAP-driven title */}
      <PlanetaryIntro />

      <CanvasCursor />
    </div>
  )
}

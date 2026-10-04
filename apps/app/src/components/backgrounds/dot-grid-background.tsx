import { cn } from '@/utils'

export function DotGridBackground( { children }: any ) {
  return (
    <div
      className={`h-full w-full absolute z-0 top-0 left-0 flex items-center justify-center bg-black bg-dot-white/[0.2]`}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div
        className={`absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]`}
      ></div>
      {children}
    </div>
  )
}
export function DotGridBackgroundBlack( { children }: any ) {
  return (
    <div
      className={`h-full w-full absolute z-0 top-0 left-0 flex items-center justify-center bg-black bg-dot-white/[0.2]`}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div
        className={`absolute pointer-events-none inset-0 flex items-center justify-center bg-black `}
      ></div>
      {children}
    </div>
  )
}

export function DotGridBackgroundWhite( { children }: any ) {
  return (
    <div
      className={`h-full w-full absolute z-0 top-0 left-0 flex items-center justify-center bg-white bg-dot-black/[0.2]`}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div
        className={`absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]`}
      ></div>
      {children}
    </div>
  )
}

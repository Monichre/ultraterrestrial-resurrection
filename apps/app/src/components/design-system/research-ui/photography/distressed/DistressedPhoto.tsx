import {cn} from '@/utils'

export default function DistressedPhoto() {
  return (
    <div className='relative'>
      {/* Date stamp */}
      <div className='absolute -top-6 right-4 z-10'>
        <span
          className='text-xs font-mono text-gray-700 bg-amber-100/80 px-2 py-1 border border-gray-300'
          style={{
            fontFamily: "'Courier New', monospace",
          }}>
          JUL 19 1952
        </span>
      </div>

      {/* Photo container with distressed edges */}
      <div
        className={cn(
          'relative w-48 h-56 bg-gray-900 border-4 border-amber-200 overflow-visible ',
          'shadow-lg transform rotate-1',
          'hover:rotate-0 transition-transform duration-300',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-black/20'
        )}
        style={{
          clipPath: 'polygon(2% 0%, 98% 1%, 99% 85%, 95% 100%, 0% 98%, 1% 15%)',
        }}>
        {/* Tape effect */}
        <div
          className='absolute -top-2 left-8 w-16 h-6 bg-amber-200/60 border border-amber-300 rotate-12 z-0'
          style={{
            background: 'linear-gradient(45deg, rgba(245,245,220,0.8), rgba(240,230,140,0.6))',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
          }}
        />

        {/* Photo content - UFO lights */}
        <div className='absolute inset-4 bg-black overflow-hidden'>
          {/* UFO lights */}
          <div className='absolute top-8 left-12 w-3 h-3 bg-yellow-200 rounded-full blur-sm opacity-80' />
          <div className='absolute top-12 left-20 w-2 h-2 bg-white rounded-full blur-sm opacity-90' />
          <div className='absolute top-16 left-8 w-2 h-2 bg-yellow-100 rounded-full blur-sm opacity-70' />
          <div className='absolute top-20 left-24 w-3 h-3 bg-yellow-300 rounded-full blur-sm opacity-85' />
          <div className='absolute top-24 left-16 w-2 h-2 bg-white rounded-full blur-sm opacity-75' />
          <div className='absolute top-28 left-28 w-2 h-2 bg-yellow-200 rounded-full blur-sm opacity-80' />
          <div className='absolute top-32 left-12 w-3 h-3 bg-yellow-100 rounded-full blur-sm opacity-70' />
          <div className='absolute top-36 left-20 w-2 h-2 bg-white rounded-full blur-sm opacity-90' />

          {/* Additional atmospheric glow */}
          <div className='absolute inset-0 bg-gradient-radial from-yellow-900/20 via-transparent to-transparent' />
        </div>

        {/* Vintage photo grain effect */}
        <div
          className='absolute inset-0 opacity-30 mix-blend-multiply'
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '4px 4px, 6px 6px',
          }}
        />
      </div>

      {/* TOP SECRET stamp on photo */}
      <div
        className={cn(
          'absolute bottom-4 left-4 px-3 py-1',
          'border-2 border-red-800 bg-red-100/80',
          'transform -rotate-12'
        )}>
        <span
          className='text-red-800 font-bold text-xs tracking-wider'
          style={{
            fontFamily: "'Arial Black', sans-serif",
          }}>
          TOP SECRET
        </span>
      </div>
    </div>
  )
}

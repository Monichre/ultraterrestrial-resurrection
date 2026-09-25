'use client'

export function GlowingSun() {
  return (
    <div className='relative flex items-center justify-center'>
      {/* Outer Glow Rings */}
      <div className='absolute h-96 w-96 rounded-full bg-gradient-radial from-yellow-400/30 via-orange-500/20 to-transparent animate-pulse'></div>
      <div className='absolute h-80 w-80 rounded-full bg-gradient-radial from-yellow-300/40 via-orange-400/30 to-transparent animate-pulse delay-300'></div>
      <div className='absolute h-64 w-64 rounded-full bg-gradient-radial from-yellow-200/50 via-orange-300/40 to-transparent animate-pulse delay-500'></div>

      {/* Main Sun Body */}
      <div className='relative h-48 w-48 rounded-full bg-gradient-radial from-white via-yellow-200 to-yellow-400 shadow-2xl overflow-hidden'>
        {/* Horizontal Lines Pattern */}
        <div className='absolute inset-0 opacity-60'>
          {Array.from({length: 12}).map((_, i) => (
            <div
              key={i}
              className='absolute left-0 right-0 h-0.5 bg-yellow-100/80'
              style={{
                top: `${(i + 1) * 8}%`,
                transform: 'translateY(-50%)',
              }}
            />
          ))}
        </div>

        {/* Central Bright Core */}
        <div className='absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-inner'></div>
      </div>

      {/* Radiating Light Beams */}
      <div className='absolute inset-0'>
        {Array.from({length: 8}).map((_, i) => (
          <div
            key={i}
            className='absolute h-1 w-24 bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent'
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: 'left center',
              transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
            }}
          />
        ))}
      </div>

      {/* Subtle Orbital Rings */}
      <div
        className='absolute h-72 w-72 rounded-full border border-white/10 animate-spin'
        style={{animationDuration: '20s'}}></div>
      <div
        className='absolute h-80 w-80 rounded-full border border-white/5 animate-spin'
        style={{animationDuration: '30s'}}></div>
    </div>
  )
}

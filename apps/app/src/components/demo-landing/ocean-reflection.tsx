'use client'

export function OceanReflection() {
  return (
    <div className='absolute bottom-0 left-0 right-0 h-32 overflow-hidden'>
      {/* Ocean Surface */}
      <div className='relative h-full w-full bg-gradient-to-b from-blue-800/50 to-blue-900/80'>
        {/* Water Ripples */}
        <div className='absolute inset-0 opacity-30'>
          {Array.from({length: 6}).map((_, i) => (
            <div
              key={i}
              className='absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'
              style={{
                bottom: `${i * 12 + 8}px`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>

        {/* Reflected Light Shimmer */}
        <div className='absolute top-0 left-1/2 h-8 w-32 -translate-x-1/2 bg-gradient-to-b from-yellow-300/20 to-transparent blur-sm animate-pulse'></div>

        {/* Subtle Wave Animation */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-wave'></div>
      </div>

      {/* Ocean Floor Suggestion */}
      <div className='absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-blue-900/60 to-slate-900'></div>
    </div>
  )
}

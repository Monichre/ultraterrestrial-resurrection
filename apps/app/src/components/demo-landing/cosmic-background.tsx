'use client'

export function CosmicBackground() {
  return (
    <div className='absolute inset-0 overflow-hidden'>
      {/* Starfield */}
      <div className='relative'>
        <div className='absolute inset-0'>
          {Array.from({length: 50}).map((_, i) => (
            <div
              key={i}
              className='absolute h-px w-px bg-white rounded-full animate-pulse'
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Atmospheric Glow */}
        <div className='absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-blue-400/10 via-purple-500/5 to-transparent blur-3xl'></div>

        {/* Nebula-like Clouds */}
        <div className='absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-radial from-purple-600/10 to-transparent blur-2xl animate-pulse'></div>
        <div className='absolute bottom-1/3 left-1/4 h-48 w-48 rounded-full bg-gradient-radial from-blue-500/10 to-transparent blur-2xl animate-pulse delay-1000'></div>

        {/* Cosmic Dust */}
        <div className='absolute inset-0 opacity-20'>
          {Array.from({length: 20}).map((_, i) => (
            <div
              key={i}
              className='absolute h-0.5 w-0.5 bg-white/40 rounded-full'
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${0.3 + Math.random() * 0.7})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

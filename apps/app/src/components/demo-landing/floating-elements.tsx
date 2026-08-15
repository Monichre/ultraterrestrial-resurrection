'use client'

export function FloatingElements() {
  const floatingTexts = [
    {text: 'THE CREATIVE\nSPECTRUM', position: {top: '30%', left: '8%'}},
    {text: 'THE ESSENCE\nOF SOUND', position: {top: '30%', right: '8%'}},
    {
      text: 'DEEP AI EXPERIENCE, SCIENCE\nTO ALL ENERGY, DISTANCE\nEVRTH IS PREFERANCE, ETHICS',
      position: {bottom: '25%', left: '5%'},
    },
    {text: 'BETWEEN THE\nAWAKERS AND\nTHE BEYOND', position: {bottom: '25%', right: '5%'}},
  ]

  const geometricElements = [
    {type: 'circle', position: {top: '20%', left: '15%'}, size: 'small'},
    {type: 'circle', position: {top: '40%', right: '20%'}, size: 'medium'},
    {type: 'circle', position: {bottom: '40%', left: '20%'}, size: 'small'},
    {type: 'dot', position: {top: '60%', right: '15%'}, size: 'tiny'},
    {type: 'dot', position: {bottom: '60%', right: '25%'}, size: 'tiny'},
  ]

  return (
    <div className='absolute inset-0 pointer-events-none z-30'>
      {/* Floating Text Elements */}
      {floatingTexts.map((item, index) => (
        <div
          key={index}
          className='absolute text-white/60 text-xs font-light tracking-wider leading-relaxed whitespace-pre-line'
          style={item.position}>
          {item.text}
        </div>
      ))}

      {/* Geometric Elements */}
      {geometricElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${
            element.type === 'circle'
              ? 'border border-white/20 rounded-full'
              : 'bg-white/40 rounded-full'
          } ${
            element.size === 'tiny'
              ? 'h-1 w-1'
              : element.size === 'small'
                ? 'h-8 w-8'
                : element.size === 'medium'
                  ? 'h-12 w-12'
                  : 'h-16 w-16'
          }`}
          style={element.position}
        />
      ))}

      {/* Subtle Connection Lines */}
      <div className='absolute top-1/3 left-1/4 h-px w-16 bg-gradient-to-r from-white/20 to-transparent rotate-45'></div>
      <div className='absolute bottom-1/3 right-1/4 h-px w-12 bg-gradient-to-r from-transparent to-white/20 -rotate-12'></div>

      {/* Small Dots Array */}
      <div className='absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-1'>
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className='h-1 w-1 bg-white/40 rounded-full'></div>
        ))}
      </div>
    </div>
  )
}

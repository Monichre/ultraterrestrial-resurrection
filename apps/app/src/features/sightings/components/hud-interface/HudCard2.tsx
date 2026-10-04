import type React from 'react'

interface HudCard2Props {
  className?: string
}

const HudCard2: React.FC<HudCard2Props> = ({className}) => {
  return (
    <div
      className={`relative w-full h-full bg-black text-white/80 font-mono overflow-hidden ${className}`}>
      <div className='relative w-full h-full perspective-[1000px] overflow-hidden'>
        {/* Grid lines */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute left-0 right-0 bottom-[30%] border-b border-white/10 transform rotateX-[60deg] -translate-z-[100px] shadow-[0_0_20px_rgba(255,255,255,0.1)]' />
          <div className='absolute top-[30%] bottom-0 left-1/2 border-l border-white/10 transform rotateX-[60deg] -translate-z-[100px] shadow-[0_0_20px_rgba(255,255,255,0.1)]' />
        </div>

        {/* Holographic elements */}
        <div className='absolute inset-0 flex items-center justify-center transform-style-preserve-3d animate-[float_10s_ease-in-out_infinite]'>
          {/* FL-87 label */}
          <div className='absolute top-[20%] left-[40%] text-white/80 text-xs transform translate-z-[50px] rotateX-[5deg] -rotateY-[5deg] text-shadow-[0_0_5px_rgba(255,255,255,0.5)]'>
            FL-87
          </div>

          {/* Vertical dotted line */}
          <div className="absolute h-[60%] w-px bg-white/20 left-1/2 top-[20%] transform translate-z-[20px] rotateX-[5deg] -rotateY-[5deg] shadow-[0_0_10px_rgba(255,255,255,0.3)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-transparent before:to-white/30 before:bg-[length:1px_10px] before:bg-repeat-y" />

          {/* Main panel */}
          <div className='absolute right-[30%] top-[30%] w-[180px] h-[240px] border border-white/30 rounded-[2px] bg-white/5 backdrop-blur-[4px] transform translate-z-[80px] rotateX-[5deg] -rotateY-[10deg] shadow-[0_0_20px_rgba(255,255,255,0.1)] flex flex-col'>
            <div className='border-b border-white/20 p-2 text-white/80 text-xs'>VMT-84/31</div>
            <div className='flex-1 flex items-center justify-center'>
              <div className="relative w-16 h-16 rounded-full border border-white/40 flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-radial-gradient before:from-white/10 before:to-white/0 before:to-70%">
                <span className='text-white/90 text-lg'>A4</span>
              </div>
            </div>
            <div className='border-t border-white/20 p-2'>
              <div className='text-white/60 text-[10px]'>READING</div>
              <div className='text-white/60 text-[10px]'>STATUS</div>
            </div>
          </div>

          {/* Stacked panels */}
          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-white/20 rounded-[2px] bg-white/5 backdrop-blur-[4px] shadow-[0_0_15px_rgba(255,255,255,0.05)] transform-style-preserve-3d translate-z-[60px] translate-x-0 rotateX-[5deg] -rotateY-[5deg] opacity-100' />
          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-white/20 rounded-[2px] bg-white/5 backdrop-blur-[4px] shadow-[0_0_15px_rgba(255,255,255,0.05)] transform-style-preserve-3d translate-z-[50px] -translate-x-[10px] rotateX-[5deg] -rotateY-[5deg] opacity-85' />
          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-white/20 rounded-[2px] bg-white/5 backdrop-blur-[4px] shadow-[0_0_15px_rgba(255,255,255,0.05)] transform-style-preserve-3d translate-z-[40px] -translate-x-[20px] rotateX-[5deg] -rotateY-[5deg] opacity-70' />
          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-white/20 rounded-[2px] bg-white/5 backdrop-blur-[4px] shadow-[0_0_15px_rgba(255,255,255,0.05)] transform-style-preserve-3d translate-z-[30px] -translate-x-[30px] rotateX-[5deg] -rotateY-[5deg] opacity-55' />
          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-white/20 rounded-[2px] bg-white/5 backdrop-blur-[4px] shadow-[0_0_15px_rgba(255,255,255,0.05)] transform-style-preserve-3d translate-z-[20px] -translate-x-[40px] rotateX-[5deg] -rotateY-[5deg] opacity-40' />
          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-white/20 rounded-[2px] bg-white/5 backdrop-blur-[4px] shadow-[0_0_15px_rgba(255,255,255,0.05)] transform-style-preserve-3d translate-z-[10px] -translate-x-[50px] rotateX-[5deg] -rotateY-[5deg] opacity-25' />

          {/* Bottom label */}
          <div className='absolute bottom-[25%] right-[35%] text-white/70 text-xs py-1 px-3 border border-white/20 bg-black/50 transform translate-z-[30px] rotateX-[65deg] -rotateY-[5deg] text-shadow-[0_0_5px_rgba(255,255,255,0.3)]'>
            SAMPLE: 4/5
          </div>
        </div>

        {/* Ambient glow effects */}
        <div className='absolute top-[33%] left-1/2 w-[300px] h-[300px] rounded-full transform -translate-x-1/2 -translate-y-1/2 bg-radial-gradient from-white/5 to-white/0 to-70% pointer-events-none' />

        {/* Scan lines effect */}
        <div className='absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.05)_50%)] bg-[length:100%_4px]' />
      </div>
    </div>
  )
}

export default HudCard2

// Add these custom animation keyframes in your global CSS or tailwind.config.js
// @keyframes float {
//   0%, 100% {
//     transform: translateY(0) rotateX(2deg) rotateY(-2deg);
//   }
//   50% {
//     transform: translateY(-10px) rotateX(4deg) rotateY(-4deg);
//   }
// }

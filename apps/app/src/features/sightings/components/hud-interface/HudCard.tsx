import {useState, useEffect} from 'react'

interface HudCardProps {
  className?: string
}

const HudCard = ({className = ''}: HudCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(true)

  // Animation for floating effect
  useEffect(() => {
    // Optional: Add any initialization here
  }, [])

  return (
    <div
      className={`bg-black text-[rgba(255,255,255,0.8)] font-mono overflow-hidden h-screen w-screen ${className}`}>
      <div className='relative w-full h-full perspective-[1000px] overflow-hidden'>
        {/* Dialog box */}
        {dialogOpen && (
          <div className='absolute top-4 right-4 bg-[rgba(255,255,255,0.1)] backdrop-blur-md rounded px-3 py-1.5 flex items-center gap-3 z-50'>
            <span className='text-white text-sm'>Holographic interface initialized</span>
            <button
              className='bg-transparent border-none text-white cursor-pointer text-base'
              onClick={() => setDialogOpen(false)}
              aria-label='Close dialog'>
              ×
            </button>
          </div>
        )}

        {/* Grid lines */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute left-0 right-0 bottom-[30%] border-b border-[rgba(255,255,255,0.1)] transform rotate-x-60 -translate-z-[100px] shadow-[0_0_20px_rgba(255,255,255,0.1)]'></div>
          <div className='absolute top-[30%] bottom-0 left-1/2 border-l border-[rgba(255,255,255,0.1)] transform rotate-x-60 -translate-z-[100px] shadow-[0_0_20px_rgba(255,255,255,0.1)]'></div>
        </div>

        {/* Holographic elements container */}
        <div className='absolute inset-0 flex items-center justify-center transform-style-3d animate-float'>
          {/* FL-87 label */}
          <div className='absolute top-[20%] left-[40%] text-[rgba(255,255,255,0.8)] text-xs transform translate-z-[50px] rotate-x-5 -rotate-y-5 shadow-[0_0_5px_rgba(255,255,255,0.5)]'>
            FL-87
          </div>

          {/* Vertical dotted line */}
          <div className='absolute h-[60%] w-px bg-[rgba(255,255,255,0.2)] left-1/2 top-[20%] transform translate-z-[20px] rotate-x-5 -rotate-y-5 shadow-[0_0_10px_rgba(255,255,255,0.3)] dotted-line'></div>

          {/* Main panel */}
          <div className='absolute right-[30%] top-[30%] w-[180px] h-[240px] border border-[rgba(255,255,255,0.3)] rounded-sm bg-[rgba(255,255,255,0.05)] backdrop-blur-md transform translate-z-[80px] rotate-x-5 -rotate-y-10 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex flex-col'>
            <div className='border-b border-[rgba(255,255,255,0.2)] p-2 text-[rgba(255,255,255,0.8)] text-xs'>
              SYSTEM STATUS
            </div>
            <div className='flex-1 flex items-center justify-center'>
              <div className='relative w-16 h-16 rounded-full border border-[rgba(255,255,255,0.4)] flex items-center justify-center circle-gradient'>
                <span className='text-[rgba(255,255,255,0.9)] text-lg'>87%</span>
              </div>
            </div>
            <div className='border-t border-[rgba(255,255,255,0.2)] p-2'>
              <div className='text-[rgba(255,255,255,0.6)] text-[10px]'>
                OPERATIONAL CAPACITY: OPTIMAL
              </div>
            </div>
          </div>

          {/* Stacked panels */}
          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-[rgba(255,255,255,0.2)] rounded-sm bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] transform translate-z-[60px] translate-x-0 rotate-x-5 -rotate-y-5 opacity-100 transform-style-3d'></div>

          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-[rgba(255,255,255,0.2)] rounded-sm bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] transform translate-z-[50px] -translate-x-[10px] rotate-x-5 -rotate-y-5 opacity-85 transform-style-3d'></div>

          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-[rgba(255,255,255,0.2)] rounded-sm bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] transform translate-z-[40px] -translate-x-[20px] rotate-x-5 -rotate-y-5 opacity-70 transform-style-3d'></div>

          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-[rgba(255,255,255,0.2)] rounded-sm bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] transform translate-z-[30px] -translate-x-[30px] rotate-x-5 -rotate-y-5 opacity-55 transform-style-3d'></div>

          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-[rgba(255,255,255,0.2)] rounded-sm bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] transform translate-z-[20px] -translate-x-[40px] rotate-x-5 -rotate-y-5 opacity-40 transform-style-3d'></div>

          <div className='absolute left-[30%] top-[35%] w-[100px] h-[140px] border border-[rgba(255,255,255,0.2)] rounded-sm bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] transform translate-z-[10px] -translate-x-[50px] rotate-x-5 -rotate-y-5 opacity-25 transform-style-3d'></div>
        </div>

        {/* Status indicator circles */}
        <div className='absolute top-[20px] left-[20px] flex flex-col gap-2'>
          <div className='w-3 h-3 rounded-full bg-[rgba(0,255,127,0.8)] shadow-[0_0_10px_rgba(0,255,127,0.7)] animate-pulse'></div>
          <div className='w-3 h-3 rounded-full bg-[rgba(255,165,0,0.8)] shadow-[0_0_10px_rgba(255,165,0,0.7)] animate-[pulse_2s_ease-in-out_infinite]'></div>
          <div className='w-3 h-3 rounded-full bg-[rgba(255,255,255,0.5)] shadow-[0_0_5px_rgba(255,255,255,0.7)] animate-[pulse_3s_ease-in-out_infinite]'></div>
        </div>

        {/* Bottom info */}
        <div className='absolute bottom-[20px] left-[20px] text-[rgba(255,255,255,0.4)] text-xs'>
          SYSTEM v2.87.14 / SECURITY LEVEL 3 /{' '}
          <span className='text-[rgba(0,255,127,0.6)]'>◉ ONLINE</span>
        </div>
      </div>

      <style jsx>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .perspective-\\[1000px\\] {
          perspective: 1000px;
        }

        .rotate-x-60 {
          transform: rotateX(60deg);
        }

        .rotate-x-5 {
          transform: rotateX(5deg);
        }

        .-rotate-y-5 {
          transform: rotateY(-5deg);
        }

        .-rotate-y-10 {
          transform: rotateY(-10deg);
        }

        .translate-z-\\[10px\\] {
          transform: translateZ(10px);
        }

        .translate-z-\\[20px\\] {
          transform: translateZ(20px);
        }

        .translate-z-\\[30px\\] {
          transform: translateZ(30px);
        }

        .translate-z-\\[40px\\] {
          transform: translateZ(40px);
        }

        .translate-z-\\[50px\\] {
          transform: translateZ(50px);
        }

        .translate-z-\\[60px\\] {
          transform: translateZ(60px);
        }

        .translate-z-\\[80px\\] {
          transform: translateZ(80px);
        }

        .-translate-z-\\[100px\\] {
          transform: translateZ(-100px);
        }

        .circle-gradient::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 70%
          );
        }

        .dotted-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 100%;
          background-image: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.3) 100%
          );
          background-size: 1px 10px;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateZ(0) rotateX(0deg);
          }
          50% {
            transform: translateY(-10px) translateZ(5px) rotateX(2deg);
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export default HudCard

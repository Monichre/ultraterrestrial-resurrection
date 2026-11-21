import {useEffect, useRef} from 'react'
import {initAnimations} from './HudDash.animations'

interface HudDashProps {
  className?: string
}

const HudDash: React.FC<HudDashProps> = ({className}) => {
  const torusCanvasRef = useRef<HTMLCanvasElement>(null)
  const frequencyCanvasRef = useRef<HTMLCanvasElement>(null)
  const amplitudeCurveCanvasRef = useRef<HTMLCanvasElement>(null)
  const dynamicsCanvasRef = useRef<HTMLCanvasElement>(null)
  const meshCanvasRef = useRef<HTMLCanvasElement>(null)
  const trackingCanvasRef = useRef<HTMLCanvasElement>(null)
  const progressBlocksRef = useRef<HTMLDivElement>(null)
  const dotMatrixRef = useRef<HTMLDivElement>(null)
  const shape1Ref = useRef<SVGSVGElement>(null)
  const shape2Ref = useRef<SVGSVGElement>(null)
  const shape3Ref = useRef<SVGSVGElement>(null)
  const shape4Ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const canvasRefs = {
      torusCanvas: torusCanvasRef.current,
      frequencyCanvas: frequencyCanvasRef.current,
      amplitudeCurveCanvas: amplitudeCurveCanvasRef.current,
      dynamicsCanvas: dynamicsCanvasRef.current,
      meshCanvas: meshCanvasRef.current,
      trackingCanvas: trackingCanvasRef.current,
    }

    const shapeRefs = {
      shape1: shape1Ref.current,
      shape2: shape2Ref.current,
      shape3: shape3Ref.current,
      shape4: shape4Ref.current,
    }

    const progressBlocks = progressBlocksRef.current
    const dotMatrix = dotMatrixRef.current

    // Animation cleanup handles
    const cleanupHandles = initAnimations(canvasRefs, shapeRefs, progressBlocks, dotMatrix)

    // Cleanup function
    return () => {
      if (cleanupHandles) {
        for (const interval of cleanupHandles.intervals) {
          clearInterval(interval)
        }
        for (const frameId of cleanupHandles.animationFrames) {
          cancelAnimationFrame(frameId)
        }
      }
    }
  }, [])

  return (
    <div className={`bg-black text-white font-mono text-xs overflow-x-hidden ${className}`}>
      <div className='grid grid-cols-12 gap-2 p-4 min-h-screen'>
        {/* Left Column */}
        <div className='col-span-3 flex flex-col gap-4'>
          <div>
            <h3 className='text-white m-0'>Random shapes</h3>
            <h4 className='text-gray-600 m-0'>Processing</h4>
          </div>

          <div className='bg-black border border-gray-700 rounded overflow-hidden'>
            <div className='flex justify-between items-center p-1 border-b border-gray-700'>
              <span>Shapes</span>
              <span>-□×</span>
            </div>
            <div className='p-2 relative'>
              <div className='grid gap-4'>
                <div className='border border-gray-700 h-16 p-2 flex items-center justify-center'>
                  <span className='text-[10px] mr-2'>22PM</span>
                  <svg className='w-10 h-[30px]' ref={shape1Ref} viewBox='0 0 40 30'>
                    <path
                      d='M10 15 L20 15 L20 25'
                      stroke='white'
                      fill='none'
                      strokeWidth='1'></path>
                  </svg>
                </div>

                <div className='border border-gray-700 h-16 p-2 flex items-center justify-center'>
                  <span className='text-[10px] mr-2'>45PM</span>
                  <svg className='w-10 h-[30px]' ref={shape2Ref} viewBox='0 0 40 30'>
                    <path
                      d='M10 20 L15 10 L20 15 L25 5 L30 20'
                      stroke='white'
                      fill='none'
                      strokeWidth='1'></path>
                  </svg>
                </div>

                <div className='border border-gray-700 h-16 p-2 flex items-center justify-center'>
                  <svg className='w-5 h-5' ref={shape3Ref} viewBox='0 0 20 20'>
                    <circle
                      cx='10'
                      cy='10'
                      r='8'
                      stroke='white'
                      fill='none'
                      strokeWidth='1'></circle>
                  </svg>
                </div>

                <div className='border border-gray-700 h-16 p-2 flex items-center justify-center'>
                  <span className='text-[10px] mr-2'>83PM</span>
                  <svg className='w-10 h-[30px]' ref={shape4Ref} viewBox='0 0 40 30'>
                    <path
                      d='M10 15 L20 25 L30 10'
                      stroke='white'
                      fill='none'
                      strokeWidth='1'></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-auto'>
            <h3 className='text-white m-0'>Procedural generation</h3>
            <h4 className='text-gray-600 m-0'>AE</h4>
          </div>

          <div className='bg-black border border-gray-700 rounded overflow-hidden'>
            <div className='flex justify-between items-center p-1 border-b border-gray-700'>
              <span>TORUS UI V006</span>
              <span>-□×</span>
            </div>
            <div className='p-2 relative'>
              <div className='flex'>
                <div className='flex-1 h-[150px]'>
                  <canvas ref={torusCanvasRef} className='w-full h-full'></canvas>
                </div>
                <div className='w-16 flex flex-col gap-2'>
                  <div className='bg-gray-800 text-center text-[10px] p-1'>HEIGHT</div>
                  <div className='bg-gray-800 text-center text-[10px] p-1'>WIDTH</div>
                  <div className='bg-gray-800 text-center text-[10px] p-1'>DEPTH</div>
                </div>
              </div>
              <div className='text-[10px] mt-2'>
                <div id='torus-size'>Size: 9405</div>
                <div id='torus-x'>X: 1042</div>
                <div id='torus-y'>Y: 5673</div>
                <div id='torus-z'>Z: 9473</div>
              </div>
              <div className='flex gap-1 mt-2'>
                <div className='h-1 bg-white' style={{width: '48px'}}></div>
                <div className='h-1 bg-white' style={{width: '32px'}}></div>
                <div className='h-1 bg-white' style={{width: '64px'}}></div>
              </div>
              <div className='flex gap-1 mt-2'>
                <div className='w-4 h-4 bg-gray-800'></div>
                <div className='w-4 h-4 bg-gray-700'></div>
                <div className='w-4 h-4 bg-gray-600'></div>
                <div className='w-4 h-4 bg-gray-500'></div>
                <div className='w-4 h-4 bg-white'></div>
                <div className='w-4 h-4 bg-gray-600'></div>
                <div className='w-4 h-4 bg-gray-700'></div>
              </div>
              <div className='text-gray-600 mt-2'>Workflow</div>
              <div className='text-gray-600'>C4D</div>
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div className='col-span-3 flex flex-col gap-4'>
          <div className='bg-black border border-gray-700 rounded overflow-hidden'>
            <div className='flex justify-between items-center p-1 border-b border-gray-700'>
              <span>Procedural</span>
              <span>-□×</span>
            </div>
            <div className='p-2 relative h-[600px]'>
              <div className='absolute top-2 left-2 text-[10px]'>FREQUENCY</div>
              <canvas ref={frequencyCanvasRef} className='w-full h-full'></canvas>
              <div className='absolute bottom-2 left-2 text-[10px]'>BLEND</div>
              <div className='absolute bottom-2 right-2 text-[10px]'>SPEED</div>
            </div>
          </div>

          <div className='bg-black border border-gray-700 rounded overflow-hidden'>
            <div className='flex justify-between items-center p-1 border-b border-gray-700'>
              <span>AMPLITUDE</span>
              <span>-□×</span>
            </div>
            <div className='p-2 relative'>
              <div className='flex h-32'>
                <div className='w-16 flex flex-col justify-between items-center'>
                  <div className='w-2 h-8 bg-white'></div>
                  <div className='w-2 h-8 bg-white'></div>
                  <div className='w-2 h-8 bg-white'></div>
                </div>
                <div className='flex-1 flex flex-col'>
                  <div className='h-16 border-b border-gray-700 flex items-center justify-center'>
                    <canvas ref={amplitudeCurveCanvasRef} className='w-full h-full'></canvas>
                  </div>
                  <div className='h-16 flex items-center justify-center'>
                    <div className='flex flex-col gap-2 w-full px-4'>
                      <div id='amp-bar-1' className='h-1 bg-white' style={{width: '100%'}}></div>
                      <div id='amp-bar-2' className='h-1 bg-white' style={{width: '90%'}}></div>
                      <div id='amp-bar-3' className='h-1 bg-white' style={{width: '95%'}}></div>
                      <div id='amp-bar-4' className='h-1 bg-white' style={{width: '85%'}}></div>
                      <div id='amp-bar-5' className='h-1 bg-white' style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
                <div
                  id='amplitude-value'
                  className='text-[10px] self-end transform rotate-90 origin-bottom-left ml-6'>
                  2578
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='col-span-6 flex flex-col gap-4'>
          <div className='bg-black border border-gray-700 rounded overflow-hidden'>
            <div className='flex justify-between items-center p-1 border-b border-gray-700'>
              <span>Dynamics</span>
              <span>-□×</span>
            </div>
            <div className='p-2 relative h-[300px]'>
              <canvas ref={dynamicsCanvasRef} className='w-full h-full'></canvas>
              <div id='dynamics-tl' className='absolute top-2 left-2 text-[10px]'>
                146642
              </div>
              <div id='dynamics-tr' className='absolute top-2 right-2 text-[10px]'>
                389751
              </div>
              <div id='dynamics-bl' className='absolute bottom-2 left-2 text-[10px]'>
                748271
              </div>
              <div id='dynamics-br' className='absolute bottom-2 right-2 text-[10px]'>
                898525
              </div>

              <div className='absolute bottom-16 left-0 right-0 text-center'>
                <div className='text-[10px] mb-1'>Process of some importance</div>
                <div className='flex items-center justify-center'>
                  <div className='text-[10px] w-8 text-center'>[</div>
                  <div ref={progressBlocksRef} className='flex gap-px'>
                    {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className='w-4 h-4 bg-gray-700 progress-block'></div>
                    ))}
                  </div>
                  <div className='text-[10px] w-8 text-center'>]</div>
                </div>
                <div className='flex justify-between mt-1 px-8 text-[10px]'>
                  <div>math.py</div>
                  <div>render.py</div>
                  <div>fragment.glsl</div>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-black border border-gray-700 rounded overflow-hidden'>
            <div className='flex justify-between items-center p-1 border-b border-gray-700'>
              <span>Mesh</span>
              <span>-□×</span>
            </div>
            <div className='p-2 relative h-[100px]'>
              <canvas ref={meshCanvasRef} className='w-full h-full'></canvas>
              <div id='mesh-left' className='absolute top-2 left-8 text-[10px]'>
                533254
              </div>
              <div
                id='mesh-center'
                className='absolute top-2 left-1/2 transform -translate-x-1/2 text-[10px]'>
                301
              </div>
              <div id='mesh-right' className='absolute top-2 right-8 text-[10px]'>
                957452
              </div>
              <div id='mesh-far-right' className='absolute top-2 right-2 text-[10px]'>
                5263
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-black border border-gray-700 rounded overflow-hidden'>
              <div className='flex justify-between items-center p-1 border-b border-gray-700'>
                <span>Tracking</span>
                <span>-□×</span>
              </div>
              <div className='p-2 relative h-64'>
                <div className='absolute top-2 left-2 text-[10px]'>SIMULATION 3</div>
                <div className='absolute top-4 left-2 text-[10px]'>SOLUTION</div>
                <canvas ref={trackingCanvasRef} className='w-full h-full'></canvas>
                <div id='tracking-loss' className='absolute bottom-2 left-2 text-[10px]'>
                  Loss: 6190
                </div>
                <div
                  ref={dotMatrixRef}
                  className='absolute bottom-16 left-2 right-2 grid grid-cols-10 gap-1'>
                  {Array.from({length: 50}).map((_, i) => (
                    <div key={i} className='w-2 h-2 bg-white rounded-full dot opacity-[0.5]'></div>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex flex-col'>
              <div>
                <h3 className='text-white m-0'>Mouse tracking</h3>
                <h4 className='text-gray-600 m-0'>Python / AE</h4>
              </div>

              <div className='mt-auto'>
                <h3 className='text-white m-0'>Workflow</h3>
                <h4 className='text-gray-600 m-0'>AE</h4>
              </div>

              <div className='text-gray-600 text-[10px] leading-normal mt-auto'>
                Other workspaces are reflections
                <br />
                on the workflow of digital artist
                <br />
                in specialized applications
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='absolute top-4 right-4'>
        <div className='text-white m-0'>Workflow</div>
        <div className='text-gray-600 m-0'>C4D</div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(0.95);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes blink {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes wave {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        .rotate {
          animation: rotate 10s infinite linear;
        }

        .blink {
          animation: blink 1.5s infinite ease-in-out;
        }

        .slide {
          animation: slide 3s infinite ease-in-out;
        }

        .wave {
          animation: wave 2s infinite ease-in-out;
        }

        .progress-block.active {
          background-color: white;
        }
      `}</style>
    </div>
  )
}

export default HudDash

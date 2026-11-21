import {useEffect, useRef, useState} from 'react'
import gsap from 'gsap'
import Zdog from 'zdog'

interface AnimatedHudInterfaceProps {
  className?: string
}

const AnimatedHudInterface = ({className = ''}: AnimatedHudInterfaceProps) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const illoRef = useRef<any>(null)
  const anchorRef = useRef<any>(null)
  const animReqRef = useRef<number | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const setup = () => {
    const crosslines = gsap.utils.toArray('line')
    const circles = gsap.utils.toArray('circle')
    const localData = gsap.utils.toArray('.local li')
    const remoteData = gsap.utils.toArray('.remote li')
    const btn = document.querySelector('button')

    gsap.set('.blob', {opacity: 0})
    gsap.set('.reticule', {opacity: 1, scale: 1})
    gsap.set(['.local h3', '.remote h3'], {opacity: 0})
    gsap.set('.cube', {opacity: 0})
    gsap.set(btn, {opacity: 0})

    gsap.set(['#retPath', '#reticuleText'], {clearProps: 'all'})

    if (btn) {
      btn.addEventListener('click', () => {
        if (tlRef.current) tlRef.current.restart()
      })
    }

    localData.forEach((item) => {
      gsap.set(item, {
        x: -20,
        opacity: 0,
      })
    })

    remoteData.forEach((item) => {
      gsap.set(item, {
        x: 20,
        opacity: 0,
      })
    })

    crosslines.forEach((line) => {
      gsap.set(line, {
        attr: {x2: 250, y2: 250},
      })
    })

    circles.forEach((circle) => {
      gsap.set(circle, {
        attr: {r: 1},
        opacity: 0,
      })
    })

    gsap.set(['#tl polyline', '#tr polyline', '#br polyline', '#bl polyline'], {
      attr: {
        'stroke-dasharray': 60,
        'stroke-dashoffset': 60,
      },
    })
    gsap.set(['#tl text', '#tr text', '#br text', '#bl text'], {opacity: 0})

    if (animReqRef.current) {
      cancelAnimationFrame(animReqRef.current)
      animReqRef.current = null
    }
  }

  const showButton = () => {
    gsap.to('button', 0.3, {opacity: 1})
  }

  const showCube = () => {
    gsap.to('.cube', 0.5, {opacity: 1})

    illoRef.current = new Zdog.Illustration({element: '.zdog-canvas'})
    const TAU = Zdog.TAU

    anchorRef.current = new Zdog.Anchor({
      addTo: illoRef.current,
      translate: {x: -15, y: -15},
      rotate: {x: TAU / 3, y: TAU / 3},
    })

    new Zdog.Box({
      addTo: anchorRef.current,
      width: 60,
      height: 60,
      depth: 60,
      stroke: 1,
      fill: false,
      color: '#E6E6E6',
    })

    animate()
  }

  const animate = () => {
    if (anchorRef.current && illoRef.current) {
      anchorRef.current.rotate.y += 0.03
      anchorRef.current.rotate.x += 0.03
      illoRef.current.updateRenderGraph()
      animReqRef.current = requestAnimationFrame(animate)
    }
  }

  const showBlob = () => {
    gsap.to('.blob', 5, {opacity: 1})
  }

  const interfaceDataAnim = () => {
    gsap.to(['.local h3', '.remote h3'], 0.3, {
      keyframes: {
        opacity: [0, 1, 0, 1, 0, 1, 0, 1],
      },
    })

    const localData = gsap.utils.toArray('.local li')
    localData.forEach((item, i) => {
      gsap.to(item, 0.6, {
        x: 0,
        opacity: 1,
        delay: i * 0.2,
      })
    })

    const remoteData = gsap.utils.toArray('.remote li')
    remoteData.forEach((item, i) => {
      gsap.to(item, 0.6, {
        x: 0,
        opacity: 1,
        delay: i * 0.2,
      })
    })
  }

  const bannerAnim = () => {
    gsap.to(['#tl polyline', '#tr polyline', '#br polyline', '#bl polyline'], 0.3, {
      attr: {
        'stroke-dasharray': 60,
        'stroke-dashoffset': 0,
      },
    })

    gsap.to(['#tl text', '#tr text', '#br text', '#bl text'], 0.3, {
      keyframes: {
        opacity: [0, 1, 0, 1, 0, 1, 0, 1],
      },
      delay: 0.2,
    })
  }

  const reticuleAnim = () => {
    gsap.to('#retPath', 0.1, {
      opacity: 0.4,
      repeat: 20,
    })

    gsap.to('#reticuleText', 0.1, {
      opacity: 0.4,
      repeat: 20,
    })
  }

  const reticuleFade = () => {
    gsap.to('.reticule', 0.5, {
      opacity: 0,
      scale: 0,
      transformOrigin: '50% 50%',
    })
  }

  const circlesAnim = () => {
    const circles = gsap.utils.toArray('circle')
    const tl = gsap.timeline({
      ease: 'circ.inOut',
      duration: 0.6,
    })

    tl.to(circles[0], {
      attr: {r: 80},
      opacity: 1,
    }).to(
      circles[1],
      {
        attr: {r: 80},
        opacity: 1,
      },
      '-=0.2'
    )

    tl.to(
      circles[2],
      {
        attr: {r: 80},
        opacity: 1,
      },
      '-=0.4'
    )
  }

  const crossLinesAnim = () => {
    const crosslines = gsap.utils.toArray('line')
    const dur = 0.7
    const easing = 'circ.inOut'

    gsap.to(crosslines[0], dur, {
      attr: {x2: 100, y2: 100},
      ease: easing,
    })

    gsap.to(crosslines[1], dur, {
      attr: {x2: 400, y2: 100},
      ease: easing,
    })

    gsap.to(crosslines[2], dur, {
      attr: {x2: 400, y2: 400},
      ease: easing,
    })

    gsap.to(crosslines[3], dur, {
      attr: {x2: 100, y2: 400},
      ease: easing,
    })
  }

  const initTimeline = () => {
    tlRef.current = gsap.timeline()

    tlRef.current
      .add(setup)
      .add(reticuleAnim)
      .add(reticuleFade, 2)
      .add(circlesAnim, 1.5)
      .add(crossLinesAnim, 2.5)
      .add(bannerAnim, 3)
      .add(interfaceDataAnim, 3.5)
      .add(showBlob, 2.5)
      .add(showCube, 3.8)
      .add(showButton, 5)
  }

  useEffect(() => {
    if (!isInitialized) {
      initTimeline()
      setIsInitialized(true)
    }

    return () => {
      if (animReqRef.current) {
        cancelAnimationFrame(animReqRef.current)
      }
    }
  }, [isInitialized])

  // Restart animation handler
  const handleRestart = () => {
    if (tlRef.current) {
      tlRef.current.restart()
    }
  }

  return (
    <div
      className={`bg-[#161313] min-h-screen ${className}`}
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/pinstripe-light.png')",
      }}>
      <section className='h-screen relative grid place-items-center'>
        <div className='blob absolute w-[500px] h-[500px] z-[2]'>
          <svg
            width='100%'
            height='100%'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            id='blobSvg'>
            <path id='blob'>
              <animate
                attributeName='d'
                dur='10000ms'
                repeatCount='indefinite'
                calcMode='spline'
                keySplines='0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1'
                values={`M418,314.5Q427,379,362,386Q297,393,247.5,401.5Q198,410,152,382.5Q106,355,74,302.5Q42,250,45.5,177Q49,104,121.5,91Q194,78,247.5,86Q301,94,341,124.5Q381,155,395,202.5Q409,250,418,314.5Z;
                        M459,321.5Q447,393,387,440Q327,487,255,472Q183,457,140,409Q97,361,77.5,305.5Q58,250,77.5,194.5Q97,139,144.5,105Q192,71,254,58.5Q316,46,382,76Q448,106,459.5,178Q471,250,459,321.5Z;
                        M460.5,313.5Q425,377,369,411Q313,445,249.5,446Q186,447,150.5,397.5Q115,348,66,299Q17,250,64.5,200Q112,150,155,120Q198,90,248.5,94.5Q299,99,366,108Q433,117,464.5,183.5Q496,250,460.5,313.5Z;
                        M440.5,323.5Q452,397,381,416Q310,435,256.5,414.5Q203,394,137,387Q71,380,56.5,315Q42,250,62.5,189Q83,128,128.5,72.5Q174,17,237.5,55.5Q301,94,350.5,117.5Q400,141,414.5,195.5Q429,250,440.5,323.5Z;
                        M418,314.5Q427,379,362,386Q297,393,247.5,401.5Q198,410,152,382.5Q106,355,74,302.5Q42,250,45.5,177Q49,104,121.5,91Q194,78,247.5,86Q301,94,341,124.5Q381,155,395,202.5Q409,250,418,314.5Z`}
              />
            </path>
          </svg>
        </div>

        <div className='blob absolute w-[500px] h-[500px] z-[1] blur-[5px]'>
          <svg
            width='100%'
            height='100%'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            id='blobSvg'>
            <path id='blob'>
              <animate
                attributeName='d'
                dur='10000ms'
                repeatCount='indefinite'
                calcMode='spline'
                keySplines='0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1'
                values={`M418,314.5Q427,379,362,386Q297,393,247.5,401.5Q198,410,152,382.5Q106,355,74,302.5Q42,250,45.5,177Q49,104,121.5,91Q194,78,247.5,86Q301,94,341,124.5Q381,155,395,202.5Q409,250,418,314.5Z;
                        M459,321.5Q447,393,387,440Q327,487,255,472Q183,457,140,409Q97,361,77.5,305.5Q58,250,77.5,194.5Q97,139,144.5,105Q192,71,254,58.5Q316,46,382,76Q448,106,459.5,178Q471,250,459,321.5Z;
                        M460.5,313.5Q425,377,369,411Q313,445,249.5,446Q186,447,150.5,397.5Q115,348,66,299Q17,250,64.5,200Q112,150,155,120Q198,90,248.5,94.5Q299,99,366,108Q433,117,464.5,183.5Q496,250,460.5,313.5Z;
                        M440.5,323.5Q452,397,381,416Q310,435,256.5,414.5Q203,394,137,387Q71,380,56.5,315Q42,250,62.5,189Q83,128,128.5,72.5Q174,17,237.5,55.5Q301,94,350.5,117.5Q400,141,414.5,195.5Q429,250,440.5,323.5Z;
                        M418,314.5Q427,379,362,386Q297,393,247.5,401.5Q198,410,152,382.5Q106,355,74,302.5Q42,250,45.5,177Q49,104,121.5,91Q194,78,247.5,86Q301,94,341,124.5Q381,155,395,202.5Q409,250,418,314.5Z`}
              />
            </path>
          </svg>
        </div>

        <div className='interface absolute w-[500px] h-[500px] z-[3]'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            viewBox='0 0 500 500'>
            <line x1='250' y1='250' x2='100' y2='100' stroke='#FCFCFC' />
            <line x1='250' y1='250' x2='400' y2='100' stroke='#FCFCFC' />
            <line x1='250' y1='250' x2='400' y2='400' stroke='#FCFCFC' />
            <line x1='250' y1='250' x2='100' y2='400' stroke='#FCFCFC' />
            <circle cx='250' cy='250' r='80' />
            <circle cx='250' cy='250' r='80' />
            <circle cx='250' cy='250' r='80' />

            <g className='banner' id='tl'>
              <text x='58' y='203'>
                LOCAL
              </text>
              <polyline points='150 190, 140 200, 105 200' />
            </g>

            <g className='banner' id='tr'>
              <text x='408' y='203'>
                REMOTE
              </text>
              <polyline points='350 190, 360 200, 395 200' />
            </g>

            <g className='banner' id='br'>
              <text x='408' y='303'>
                REMOTE
              </text>
              <polyline points='350 310, 360 300, 395 300' />
            </g>

            <g className='banner' id='bl'>
              <text x='58' y='303'>
                LOCAL
              </text>
              <polyline points='150 310, 140 300, 105 300' />
            </g>

            <g className='reticule' transform='translate(235, 225)'>
              <path id='retPath' d='M0,10 L0,0 10,0' />
              <path id='retPath' d='M20,0 L30,0 30,10' />
              <path id='retPath' d='M30,20 L30,30 20,30' />
              <path id='retPath' d='M0,20 L0,30 10,30' />

              <text id='reticuleText' x='16' y='50'>
                Loading
              </text>
            </g>
          </svg>
        </div>

        <div className='interface-data absolute w-[460px] z-[4] font-mono text-[#e6e6e6] uppercase grid grid-cols-2'>
          <div className='local'>
            <h3 className='text-sm mb-[5px] text-[#10a510]'>192.168.0.1</h3>
            <ul>
              <li className='text-xs p-[2px] grid grid-cols-[12ch_1fr] pl-8'>
                Delay <span>-0.489</span>
              </li>
              <li className='text-xs p-[2px] grid grid-cols-[12ch_1fr] pl-8'>
                Offset <span>-0.025</span>
              </li>
              <li className='text-xs p-[2px] grid grid-cols-[12ch_1fr] pl-8'>
                Jitter <span>3.113</span>
              </li>
              <li className='text-xs p-[2px] grid grid-cols-[12ch_1fr] pl-8'>
                Stratum <span>1</span>
              </li>
            </ul>
          </div>
          <div className='remote text-right'>
            <h3 className='text-sm mb-[5px] text-[#10a510]'>192.162.25.1</h3>
            <ul>
              <li className='text-xs p-[2px] grid grid-cols-[1fr_12ch] pr-8'>
                Delay <span>-0.289</span>
              </li>
              <li className='text-xs p-[2px] grid grid-cols-[1fr_12ch] pr-8'>
                Offset <span>1.025</span>
              </li>
              <li className='text-xs p-[2px] grid grid-cols-[1fr_12ch] pr-8'>
                Jitter <span>0.203</span>
              </li>
              <li className='text-xs p-[2px] grid grid-cols-[1fr_12ch] pr-8'>
                Stratum <span>0</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='cube absolute z-[5] w-[160px] h-[160px] rounded-full overflow-hidden'>
          <canvas className='zdog-canvas' width='200' height='200'></canvas>
        </div>

        <button
          onClick={handleRestart}
          className='absolute bottom-[30%] left-1/2 -translate-x-1/2 z-10 border border-[#10a510] bg-transparent px-[10px] py-[5px] text-[0.7rem] text-[#10a510] uppercase cursor-pointer'>
          Replay
        </button>
      </section>
    </div>
  )
}

export default AnimatedHudInterface

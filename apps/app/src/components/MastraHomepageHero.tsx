'use client'

import {CloudIcon, LocalDevIcon} from '@/components/icons'
import {TerminalDisplay} from '@/components/terminal-display'
import React, {useState, useEffect, useRef} from 'react'

const MastraHomepageHero = () => {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0})
  const [isMounted, setIsMounted] = useState(false)

  // Create refs for the cards
  const cardRef1 = useRef<HTMLDivElement>(null)
  const cardRef2 = useRef<HTMLDivElement>(null)
  const cardRef3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      // Get the position relative to the viewport
      const x = e.clientX
      const y = e.clientY
      setMousePosition({x, y})
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Calculate the position for each card based on its position in the DOM
  const getGradientPosition = (element: HTMLElement | null) => {
    if (!element) return {x: mousePosition.x, y: mousePosition.y}

    const rect = element.getBoundingClientRect()
    // Calculate position relative to the element
    const x = mousePosition.x - rect.left
    const y = mousePosition.y - rect.top

    return {x, y}
  }

  return (
    <div className='bg-neutral-950 text-zinc-300 w-full py-24 relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-center gap-10'>
          {/* Event banner */}
          <a
            href='https://lu.ma/ol89h2cz'
            className='inline-flex items-center bg-green-500 rounded-full border-2 border-gray-50/[0.08] py-1 pl-1 pr-3 text-sm font-medium cursor-pointer relative'>
            <div
              className='flex items-center gap-2 w-80 h-5'
              style={{
                maskImage:
                  'linear-gradient(60deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0.4) 50%, rgb(0, 0, 0) 75%)',
                maskPosition: '0.0153113% 50%',
                maskSize: '400%',
              }}>
              <span
                className='inline-flex items-center px-2 bg-neutral-900 text-green-500 text-[0.63rem] font-semibold uppercase rounded-full h-5 leading-3 min-w-fit w-28'
                style={{letterSpacing: '2px'}}>
                Th Apr 3, 9am PT
              </span>
              <span className='text-zinc-950 text-xs font-semibold h-4 leading-4 overflow-hidden text-ellipsis w-52'>
                Build Agentic Workflows with Mastra
              </span>
            </div>
          </a>

          {/* Main headline */}
          <h1 className='text-white text-[4rem] leading-[4.5rem] font-semibold text-center max-w-xl mx-auto'>
            The TypeScript <span>Agent Framework</span>
          </h1>

          {/* Subheading */}
          <p className='text-neutral-400 font-medium text-center max-w-2xl w-[72%] mx-auto'>
            From the team that brought you <span className='text-purple-800'>Gatsby</span>:
            prototype and productionize AI features with a modern Javascript stack.
          </p>

          {/* Command prompt */}
          <div className='relative w-80 h-24 p-1'>
            <button
              type='button'
              className='flex flex-col items-center justify-center text-center w-80 h-20 p-3 bg-neutral-900 border-2 border-neutral-700 rounded-md text-sm cursor-pointer relative'
              style={{appearance: 'button'}}>
              <div className='text-neutral-200 font-semibold h-5 leading-5 w-56'>
                $ npx create-mastra@latest
              </div>
              <div className='text-zinc-400 h-5 leading-5 w-28'>press to copy</div>
            </button>
          </div>

          {/* Feature cards with flashlight effect */}
          <div className='mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl opacity-50'>
            {isMounted && (
              <>
                {/* CLOUD CARD */}
                <div className='relative h-60 cursor-none' ref={cardRef1}>
                  <div className='text-sm h-60 leading-5 relative select-none w-full flex border-2 border-neutral-700 border-solid rounded-md overflow-hidden p-2'>
                    <div className='h-20 opacity-20 relative w-full'>
                      -cloud
                      <CloudIcon />
                    </div>
                    <div
                      className='absolute inset-[0.13rem] z-10 rounded-md opacity-80 pointer-events-none'
                      style={{
                        background: `radial-gradient(200px at ${
                          getGradientPosition(cardRef1.current).x
                        }px ${
                          getGradientPosition(cardRef1.current).y
                        }px, rgb(38, 38, 38), rgba(0, 0, 0, 0) 100%)`,
                      }}
                    />
                  </div>
                </div>

                {/* FRAMEWORK CARD */}
                <div className='relative h-60 cursor-none' ref={cardRef2}>
                  <div className='text-sm h-60 leading-5 relative select-none w-full flex border-2 border-neutral-700 border-solid rounded-md overflow-hidden p-2'>
                    <div className='h-40 opacity-20 relative w-full'>
                      -framework
                      <div className='h-44 mt-2 w-96 overflow-hidden'>
                        <pre className='h-44 w-96 rounded-xl'>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              1
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>const chefAgent = new Agent(&#123;</span>
                              </span>
                            </div>
                          </div>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              2
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>{'  '}name: 'Chef Agent',</span>
                              </span>
                            </div>
                          </div>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              3
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>{'  '}instructions: </span>
                              </span>
                            </div>
                          </div>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              4
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>
                                  {'    '}"You are Michel, a practical and experienced home chef" +
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              5
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>{'    '}"who helps people cook great meals."</span>
                              </span>
                            </div>
                          </div>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              6
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>{'  '}model: openai('gpt-4o-mini'),</span>
                              </span>
                            </div>
                          </div>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              7
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>{'  '}memory,</span>
                              </span>
                            </div>
                          </div>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              8
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>{'  '}workflow: &#123; chefWorkflow &#125;</span>
                              </span>
                            </div>
                          </div>
                          <div className='h-5 w-96 table-row'>
                            <span className='text-neutral-500 text-xs h-5 leading-4 pr-4 text-right w-6 table-cell'>
                              9
                            </span>
                            <div className='text-blue-300 h-5 w-96'>
                              <span className='text-white text-xs leading-4 opacity-80'>
                                <span>&#125;);</span>
                              </span>
                            </div>
                          </div>
                        </pre>
                      </div>
                    </div>
                    <div
                      className='absolute inset-[0.13rem] z-10 rounded-md opacity-80 pointer-events-none'
                      style={{
                        background: `radial-gradient(200px at ${
                          getGradientPosition(cardRef2.current).x
                        }px ${
                          getGradientPosition(cardRef2.current).y
                        }px, rgb(38, 38, 38), rgba(0, 0, 0, 0) 100%)`,
                      }}
                    />
                  </div>
                </div>

                {/* LOCAL DEV CARD */}
                <div className='relative h-60 cursor-none' ref={cardRef3}>
                  <div className='bg-neutral-950 text-sm h-60 leading-5 relative select-none w-full flex border-2 border-neutral-700 border-solid rounded-md overflow-hidden p-2'>
                    <div className='h-20 opacity-20 relative w-full'>
                      -local dev
                      <LocalDevIcon />
                      <TerminalDisplay />
                    </div>
                    <div
                      className='absolute inset-[0.13rem] z-10 rounded-md opacity-80 pointer-events-none'
                      style={{
                        background: `radial-gradient(200px at ${
                          getGradientPosition(cardRef3.current).x
                        }px ${
                          getGradientPosition(cardRef3.current).y
                        }px, rgb(38, 38, 38), rgba(0, 0, 0, 0) 100%)`,
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MastraHomepageHero

'use client'

// import {useIsomorphicLayoutEffect} from 'framer-motion'
// import {usePathname} from 'next/navigation'
// import {useRef} from 'react'
// import gsap from 'gsap'
// // import {ScrollTrigger, ScrollSmoother} from 'gsap/ScrollTrigger'
// import {ScrollTrigger} from 'gsap-trial/dist/ScrollTrigger'
// import {ScrollSmoother} from 'gsap-trial/dist/ScrollSmoother'

// export const ScrollThroughWrapper = ({children}: {children: React.ReactNode}) => {
//   const smoother = useRef()
//   const ctx = useRef()
//   const pathname = usePathname()

//   console.log('🚀 ~ ScrollThroughWrapper ~ pathname:', pathname)

//   useIsomorphicLayoutEffect(() => {
//     gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

//     ctx.current = gsap.context(() => {
//       smoother.current = ScrollSmoother.create({
//         smooth: 2,
//         effects: true,
//       })
//     })

//     return () => ctx.current.revert()
//   }, [pathname])

//   return (
//     <div id='smooth-wrapper'>
//       <div id='smooth-content'>{children}</div>
//     </div>
//   )
// }

import {Suspense, useEffect, useRef} from 'react'
import gsap from 'gsap'
import {ScrollThrough3D} from '@/features/3d/scroll-through-3d/ScrollThroughThreeD'
import {Loading} from '@/components/loaders/loading'

// Define prop types
interface Section {
  id: string
  title: string
}

interface ScrollThroughWrapperProps {
  sections: Section[]
  years: number[]
}

export function ScrollThroughWrapper({sections, years}: ScrollThroughWrapperProps) {
  const preloaderRef = useRef<HTMLDivElement>(null)
  const loadingBarRef = useRef<HTMLDivElement>(null)
  const loadingTextRef = useRef<HTMLSpanElement>(null)
  const mainContentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const loadingBar = loadingBarRef.current
    const loadingText = loadingTextRef.current
    const preloader = preloaderRef.current
    const mainContent = mainContentRef.current

    const obj = {progress: 0}

    const tl = gsap.timeline({
      onUpdate: () => {
        const prog = Math.round(obj.progress)
        if (loadingText) loadingText.textContent = `Loading ${prog} / 100`
        if (loadingBar) loadingBar.style.width = `${prog * 2}px`
      },
      onComplete: () => {
        if (loadingText) loadingText.textContent = 'Loading complete'
        gsap.delayedCall(0.5, () => {
          gsap.to([loadingBar, loadingText], {
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            onComplete: () => {
              if (loadingText) loadingText.style.display = 'none'
              if (loadingBar) loadingBar.style.display = 'none'
              gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                ease: 'expo.out',
                onComplete: () => {
                  if (preloader) preloader.style.display = 'none'
                  if (mainContent) {
                    mainContent.style.display = 'block'
                    gsap.fromTo(
                      mainContent,
                      {opacity: 0},
                      {opacity: 1, duration: 1, ease: 'expo.out'}
                    )
                  }
                },
              })
            },
          })
        })
      },
    })

    tl.to(obj, {progress: 100, duration: 3, ease: 'linear'})

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <>
      <div id='preloader' ref={preloaderRef}>
        <span id='loading-text' ref={loadingTextRef}>
          Loading 0 / 100
        </span>
        <div id='loading-bar-bg'>
          <div id='loading-bar' ref={loadingBarRef} />
        </div>
      </div>
      <nav>
        <menu>
          <ul>
            <li>
              <a href='#section-1'>Section 1</a>
            </li>
            <li>
              <a href='#section-2'>Section 2</a>
            </li>
            <li>
              <a href='#section-3'>Section 3</a>
            </li>
            <li>
              <a href='#section-4'>Section 4</a>
            </li>
            <li>
              <a href='#section-5'>Section 5</a>
            </li>
          </ul>
          <div id='underline' />
        </menu>
      </nav>
      <main ref={mainContentRef} style={{display: 'none'}}>
        {sections.map((section) => (
          <section className='panel' id={section.id} key={section.id}>
            <h3>{section.title}</h3>
          </section>
        ))}
      </main>

      <Suspense fallback={<Loading />}>
        <ScrollThrough3D years={years} />
        <div className='scrollTarget' />
      </Suspense>
    </>
  )
}

// 'use client'

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

'use client'

import dynamic from 'next/dynamic'
import {Suspense, useEffect} from 'react'
import anime from 'animejs'
import Loading from './loading'

const Experience = dynamic(() => import('./Experience'), {
  ssr: false,
})

export function ScrollThroughWrapper({sections, years}: {sections: any; years: any}) {
  useEffect(() => {
    let progress = 0
    const loadingBar = document.getElementById('loading-bar')
    const loadingText = document.getElementById('loading-text')
    const preloader = document.getElementById('preloader')
    const mainContent = document.querySelector('main')

    function updateProgress() {
      if (progress <= 100) {
        if (loadingText) loadingText.textContent = `Loading ${progress} / 100`
        if (loadingBar) loadingBar.style.width = `${progress * 2}px`
        progress++
        setTimeout(updateProgress, 30)
      } else {
        if (loadingText) loadingText.textContent = 'Loading complete'
        setTimeout(hidePreloader, 500)
      }
    }

    function hidePreloader() {
      anime({
        targets: '#loading-bar, #loading-text',
        opacity: 0,
        duration: 1000,
        easing: 'easeOutExpo',
        complete: () => {
          if (loadingText) loadingText.style.display = 'none'
          if (loadingBar) loadingBar.style.display = 'none'
          anime({
            targets: '#preloader',
            opacity: 0,
            duration: 1000,
            easing: 'easeOutExpo',
            complete: () => {
              if (preloader) preloader.style.display = 'none'
              if (mainContent) mainContent.style.display = 'block'
              anime({
                targets: 'main',
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutExpo',
              })
            },
          })
        },
      })
    }

    updateProgress()
  }, [])

  return (
    <>
      <div id='preloader'>
        <span id='loading-text'>Loading 0 / 100</span>
        <div id='loading-bar-bg'>
          <div id='loading-bar'></div>
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
          <div id='underline'></div>
        </menu>
      </nav>
      <main style={{display: 'none'}}>
        {sections.map((section: any) => (
          <section className='panel' id={section.id} key={section.id}>
            <h3>{section.title}</h3>
          </section>
        ))}
      </main>
      <div className='scrollTarget' />
      <Suspense fallback={<Loading />}>
        <Experience years={years} />
      </Suspense>
    </>
  )
}

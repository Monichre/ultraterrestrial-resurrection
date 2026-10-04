'use client'
import Image from 'next/image'
import { useEffect, useRef, type Key } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

//optional hook for smooth scrolling

export type SwipeGridItem = {
  name: string
  content: string
  src: any
}

const SwipeGrid = ({
  items,
  children,
}: {
  items: SwipeGridItem[]
  children: any
}) => {
  const grid = useRef<any>(null)
  const gridWrap = useRef<any>(null)

  const hasRun = useRef(false)

  const applyAnimation = () => {
    // Register Scroll Triggren
    gsap.registerPlugin(ScrollTrigger)

    // Child elements of grid
    const gridItems = grid.current?.querySelectorAll('.grid__item')
    const gridItemsInner = [...gridItems].map((item) =>
      item.querySelector('.grid__item-inner')
    )

    // Define GSAP timeline with ScrollTrigger
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: gridWrap.current,
        start: 'top bottom+=5%',
        end: 'bottom top-=5%',
        scrub: true,
        // markers: true // Optional: for debugging
      },
    })

    grid.current.style.perspective = '1000px'
    grid.current.style.width = 'calc(1 / 0.65 * 100%)'
    grid.current.style.height = 'calc(1 / 0.5 * 100%)'

    timeline
      .set(gridWrap.current, {
        rotationY: 25,
      })
      .set(gridItems, {
        z: () => gsap.utils.random(-1600, 200),
      })
      .fromTo(
        gridItems,
        { xPercent: () => gsap.utils.random(-1000, -500) },
        { xPercent: () => gsap.utils.random(500, 1000) },
        0
      )
      .fromTo(gridItemsInner, { scale: 2 }, { scale: 0.5 }, 0)
  }

  useEffect(() => {
    //make sure we run this function only once
    if (!hasRun.current && grid.current) {
      applyAnimation()
      window.scrollTo({ top: 0 })
      hasRun.current = true
    }
  }, [grid])

  return (
    <div className='z-10 w-full overflow-hidden bg-stone-200 dark:bg-stone-900'>
      {children}
      <section className='relative mb-[20vh]'>
        <div
          ref={grid}
          className='grid h-[calc(1/1*100%)] w-[calc(1/1*100%)] p-8'
          style={{ perspective: '1500px' }}
        >
          <div
            style={{ transformStyle: 'preserve-3d' }}
            ref={gridWrap}
            className='grid h-auto w-full grid-cols-4 gap-[2vw]'
          >
            {items?.length
              ? items.map((item: any, index: Key | null | undefined) => (
                  <div
                    key={index}
                    className='grid__item relative grid aspect-[1.5] h-auto w-full place-items-center overflow-hidden rounded-md ring-1'
                  >
                    <Image
                      style={{
                        filter: 'grayscale(100%)',
                      }}
                      quality={100}
                      src={
                        (item.photo && item.photo.length
                          ? item.photo[0]?.signedUrl || item?.photo[0]?.url
                          : '/atro-4.png') || '/atro-4.png'
                      }
                      height={300}
                      width={300}
                      className='grid__item-inner h-auto absolute top-0 left-0 w-full h-full z-0 object-cover'
                      alt='image'
                    />
                    <div className='relative z-10 p-4 text-left'>
                      <h3 className='font-bebasNeuePro tracking-wide uppercase text-white'>
                        {item.name}
                      </h3>
                      <p className='font-source text-white tracking-wide'>
                        {item.role}
                      </p>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SwipeGrid

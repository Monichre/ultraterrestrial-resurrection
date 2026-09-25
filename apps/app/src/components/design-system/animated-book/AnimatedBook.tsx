import React, {useRef, useEffect} from 'react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useGSAP} from '@gsap/react'
import type {CSSProperties} from 'react'

type CustomStyle = CSSProperties & {'--page-index'?: number}

gsap.registerPlugin(ScrollTrigger)

export const AnimatedBook: React.FC<{pages: {front: string; back: string}[]}> = ({pages}) => {
  const bookRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const book = bookRef.current
    if (!book) return

    gsap.to(book, {
      scrollTrigger: {
        scrub: 1,
        start: () => 0,
        end: () => window.innerHeight * 0.25,
      },
      scale: 1,
    })

    const bookPages = book.querySelectorAll('.book__page')
    bookPages.forEach((page, index) => {
      gsap.set(page, {z: index === 0 ? 13 : -index * 1})
      if (index === bookPages.length - 1) return

      gsap.to(page, {
        rotateY: `-=${180 - index / 2}`,
        scrollTrigger: {
          scrub: 1,
          start: () => (index + 1) * (window.innerHeight * 0.25),
          end: () => (index + 2) * (window.innerHeight * 0.25),
        },
      })

      gsap.to(page, {
        z: index === 0 ? -13 : index,
        scrollTrigger: {
          scrub: 1,
          start: () => (index + 1) * (window.innerHeight * 0.25),
          end: () => (index + 1.5) * (window.innerHeight * 0.25),
        },
      })
    })
  }, [])

  return (
    <div ref={bookRef} className='book'>
      <div className='book__spine'></div>
      <div
        className='page book__page book__cover book__cover--front'
        style={{'--page-index': 1} as CustomStyle}>
        <div className='page__half page__half--front'>{/* Front cover content */}</div>
        <div className='page__half page__half--back'>
          <div className='book__insert'></div>
        </div>
      </div>
      {pages.map((page, index) => (
        <div
          key={index}
          className='page book__page'
          style={{'--page-index': index + 2} as CustomStyle}>
          <div className='page__half page__half--front'>
            <div className='page__number'>{index * 2 + 1}</div>
            {page.front}
          </div>
          <div className='page__half page__half--back'>
            <div className='page__number'>{index * 2 + 2}</div>
            {page.back}
          </div>
        </div>
      ))}
      <div
        className='page book__page book__cover book__cover--back'
        style={{'--page-index': pages.length + 2} as CustomStyle}>
        <div className='page__half page__half--front'></div>
        <div className='page__half page__half--back'>
          {/* Back cover content */}
          <div className='book__insert'></div>
        </div>
      </div>
    </div>
  )
}

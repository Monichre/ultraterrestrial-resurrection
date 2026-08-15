'use client'

import {cn} from '@/utils/cn'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useLayoutEffect, useRef, type CSSProperties} from 'react'
import {BearSticker} from './BearSticker'
import {
  BOOK_LEAVES,
  COVER_CODE_SNIPPET,
  LOGO_HREF,
  LOGO_SRC,
  PAGE_COUNT,
  PAGE_SCROLL_VH,
  type BookLeaf,
} from './fixtures'
import './LittleBook.css'

gsap.registerPlugin(ScrollTrigger)

export interface LittleBookProps {
  leaves?: BookLeaf[]
  coverCode?: string
  hint?: string
  className?: string
  style?: CSSProperties
}

function PageFace({
  href,
  src,
  number,
  side,
}: {
  href: string
  src: string
  number: number
  side: 'front' | 'back'
}) {
  return (
    <div className={cn('little-book__half', `little-book__half--${side}`)}>
      <a href={href} target='_blank' rel='noreferrer noopener'>
        <img src={src} alt='' />
      </a>
      <div className='little-book__page-number'>{number}</div>
    </div>
  )
}

export function LittleBook({
  leaves = BOOK_LEAVES,
  coverCode = COVER_CODE_SNIPPET,
  hint = 'Scroll',
  className,
  style,
}: LittleBookProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const book = bookRef.current
    if (!root || !book) return

    const ctx = gsap.context(() => {
      const pageScrollPx = () => window.innerHeight * (PAGE_SCROLL_VH / 100)

      gsap.to(book, {
        scrollTrigger: {
          scrub: 1,
          start: () => 0,
          end: () => pageScrollPx(),
        },
        scale: 1,
      })

      gsap.to('.little-book__logo', {
        scrollTrigger: {
          scrub: true,
          start: () => 13.5 * pageScrollPx(),
          end: () => 14 * pageScrollPx(),
        },
        opacity: 1,
      })

      const pages = gsap.utils.toArray<HTMLElement>('.little-book__sheet')
      pages.forEach((page, index) => {
        gsap.set(page, {z: index === 0 ? 13 : -index * 1})
        // Back cover (last sheet) stays put — matches original early-return
        if (index === pages.length - 1) return

        gsap.to(page, {
          rotateY: `-=${180 - index / 2}`,
          scrollTrigger: {
            scrub: 1,
            start: () => (index + 1) * pageScrollPx(),
            end: () => (index + 2) * pageScrollPx(),
          },
        })

        gsap.to(page, {
          z: index === 0 ? -13 : index,
          scrollTrigger: {
            scrub: 1,
            start: () => (index + 1) * pageScrollPx(),
            end: () => (index + 1.5) * pageScrollPx(),
          },
        })
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [leaves])

  const cssVars = {
    '--page-count': PAGE_COUNT,
    '--page-scroll': PAGE_SCROLL_VH,
    ...style,
  } as CSSProperties

  return (
    <div ref={rootRef} className={cn('little-book', className)} style={cssVars}>
      <p className='little-book__hint'>{hint}</p>

      <div ref={bookRef} className='little-book__book'>
        <div className='little-book__spine' />

        {/* Front cover — page-index 1 */}
        <div
          className='little-book__page little-book__sheet little-book__cover little-book__cover--front'
          style={{'--page-index': 1} as CSSProperties}>
          <div className='little-book__half little-book__half--front'>
            <span className='little-book__code'>{coverCode}</span>
            <BearSticker className='little-book__sticker' />
          </div>
          <div className='little-book__half little-book__half--back'>
            <div className='little-book__insert' />
          </div>
        </div>

        {leaves.map((leaf, index) => (
          <div
            key={`${leaf.front.number}-${leaf.back.number}`}
            className='little-book__page little-book__sheet'
            style={{'--page-index': index + 2} as CSSProperties}>
            <PageFace {...leaf.front} side='front' />
            <PageFace {...leaf.back} side='back' />
          </div>
        ))}

        {/* Back cover — last index */}
        <div
          className='little-book__page little-book__sheet little-book__cover little-book__cover--back'
          style={{'--page-index': leaves.length + 2} as CSSProperties}>
          <div className='little-book__half little-book__half--front' />
          <div className='little-book__half little-book__half--back'>
            <span className='little-book__code'>{coverCode}</span>
          </div>
          <div className='little-book__insert'>
            <a href={LOGO_HREF} target='_blank' rel='noopener noreferrer'>
              <img className='little-book__logo' src={LOGO_SRC} alt='jhey.dev' />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

LittleBook.displayName = 'LittleBook'

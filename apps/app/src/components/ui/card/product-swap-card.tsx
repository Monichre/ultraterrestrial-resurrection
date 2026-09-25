'use client'

import * as React from 'react'
import Link from 'next/link'
import {ChevronDown} from 'lucide-react'
import {motion, AnimatePresence, type MotionProps} from 'framer-motion'
import {Button} from '@/components/ui/button'
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area'
import {Badge} from '@/components/ui/badge'
import {cn} from '@/utils/cn'

type ProductData = {
  title: string
  excerpt: string
  createdAt: string
  domain: string
  slug: string
  alt: string[]
  techStack: string[]
  thumbnail: string[]
  actionLabel?: string
}

const DEFAULT_PRODUCT: ProductData = {
  title: 'SHSF Dashboard Application',
  excerpt:
    'Modern, responsive dashboard application built with React and Next.js. Features include real-time analytics, user management, and customizable widgets.',
  createdAt: 'March 18, 2025',
  domain: 'shsf-dashboard.dev',
  actionLabel: 'View product',
  slug: 'shsf-dashboard',
  alt: [
    'SHSF Dashboard dark mode interface showing analytics charts',
    'SHSF Dashboard light mode interface showing user management panel',
  ],
  techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  thumbnail: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=640&h=360&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=640&h=360&auto=format&fit=crop',
  ],
}

type ProductSwapCardProps = React.HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    product?: ProductData
    onSwap?: (isFirstVisible: boolean) => void
  }

const ProductSwapCard = React.forwardRef<HTMLDivElement, ProductSwapCardProps>((props, ref) => {
  const {product = DEFAULT_PRODUCT, className, onSwap, ...restProps} = props

  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const thumbnails = product.thumbnail

  const handleSwap = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    const nextIndex = (activeIndex + 1) % thumbnails.length
    setActiveIndex(nextIndex)

    if (onSwap) {
      onSwap(nextIndex === 0)
    }

    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        'w-full space-y-4 rounded-lg bg-sidebar p-4 border max-w-96 overflow-hidden',
        className
      )}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, ease: 'easeOut'}}
      {...restProps}>
      <div className='flex items-center justify-center gap-4'>
        <Button
          onClick={handleSwap}
          size='icon'
          variant='outline'
          className={cn(
            'shrink-0 transition-all duration-200 shadow-sm',
            isTransitioning && 'pointer-events-none opacity-70'
          )}
          aria-label={`Show ${activeIndex === 0 ? 'next' : 'previous'} image`}
          disabled={isTransitioning}>
          <div className='transition-transform duration-500 ease-out'>
            <ChevronDown
              size={20}
              strokeWidth={1.5}
              className={cn(
                'transition-all duration-300 ease-in-out',
                activeIndex === 1 && 'rotate-180'
              )}
            />
          </div>
        </Button>

        <div className='relative aspect-video w-full overflow-hidden rounded-xl'>
          <AnimatePresence initial={false}>
            {thumbnails.map((src, index) => (
              <motion.div
                key={src}
                className={cn(
                  'absolute inset-0 h-full w-full',
                  activeIndex === index ? 'z-10' : 'z-0'
                )}
                initial={false}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.92,
                  y: activeIndex === index ? 0 : index < activeIndex ? '-100%' : '100%',
                }}
                transition={{
                  opacity: {duration: 0.5, ease: 'easeInOut'},
                  scale: {duration: 0.5, ease: 'easeOut'},
                  y: {duration: 0.6, ease: [0.33, 1, 0.68, 1]},
                }}>
                <div className='h-full w-full overflow-hidden rounded-xl border'>
                  <img
                    src={src}
                    alt={product.alt[index]}
                    className='h-full w-full object-cover transition-all duration-500'
                    style={{
                      objectPosition: index === 0 ? 'top' : 'center',
                    }}
                    loading='lazy'
                    draggable={false}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className='absolute bottom-2 right-2 z-20 flex gap-1.5 rounded-full bg-black/30 backdrop-blur-sm px-2 py-1.5 shadow-sm border border-white/20'>
            {thumbnails.map((_, index) => (
              <button
                key={index}
                onClick={() => !isTransitioning && setActiveIndex(index)}
                className={cn(
                  'size-2 rounded-full transition-all duration-300 cursor-pointer',
                  activeIndex === index
                    ? 'bg-white scale-110 ring-1 ring-white/50 ring-offset-1 ring-offset-black/30'
                    : 'bg-white/60 hover:bg-white/80'
                )}
                aria-label={`View image ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='space-y-2'>
          <h2 className='line-clamp-1 font-medium'>{product.title}</h2>
          <p className='line-clamp-3 text-sm text-muted-foreground'>{product.excerpt}</p>
          <Link
            href={`/product/${product.slug}`}
            className="text-sm inline-block font-medium text-primary transition-colors duration-300 after:content-['_↗'] hover:text-primary/80">
            {product.actionLabel || 'Product details'}
          </Link>
        </div>

        <ScrollArea className='w-full'>
          <div className='flex gap-2 pb-1'>
            {product.techStack.map((tag, index) => (
              <Badge key={index} className='shrink-0 bg-muted-foreground hover:bg-muted-background'>
                {tag}
              </Badge>
            ))}
          </div>
          <ScrollBar orientation='horizontal' className='h-1.5' />
        </ScrollArea>

        <div className='flex items-center justify-between gap-4 text-xs'>
          <time className='text-muted-foreground'>{product.createdAt}</time>
          <a
            className='text-muted-foreground transition-colors duration-300 hover:text-muted-foreground/80'
            href={product.domain}
            target='_blank'
            rel='noopener noreferrer'>
            {product.domain}
          </a>
        </div>
      </div>
    </motion.div>
  )
})

ProductSwapCard.displayName = 'ProductSwapCard'

export {ProductSwapCard}

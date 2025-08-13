import * as React from 'react'
import {cn} from '@/utils'
import {ClassificationLevel} from './types'

interface VintageDocumentCardProps {
  className?: string
  children: React.ReactNode
  classification: ClassificationLevel
  title: string
  date: string
  location?: string
}

const ClassificationBadge = ({level}: {level: ClassificationLevel}) => {
  const getClassificationStyles = (classification: ClassificationLevel) => {
    const baseStyles =
      'inline-block px-3 py-1 text-sm font-bold tracking-wider transform -rotate-3 border-2'

    switch (classification) {
      case 'top-secret':
        return `${baseStyles} bg-red-600 text-white border-red-800 shadow-red-900/30`
      case 'secret':
        return `${baseStyles} bg-orange-500 text-white border-orange-700 shadow-orange-800/30`
      case 'confidential':
        return `${baseStyles} bg-yellow-500 text-black border-yellow-700 shadow-yellow-800/30`
      case 'unclassified':
        return `${baseStyles} bg-green-600 text-white border-green-800 shadow-green-900/30`
      default:
        return `${baseStyles} bg-gray-500 text-white border-gray-700 shadow-gray-800/30`
    }
  }

  return (
    <div className='absolute top-4 right-4 z-10'>
      <span className={cn(getClassificationStyles(level), 'shadow-lg')}>
        {level.toUpperCase().replace('-', ' ')}
      </span>
    </div>
  )
}

const VintageDocumentCard = React.forwardRef<HTMLDivElement, VintageDocumentCardProps>(
  ({className, children, classification, title, date, location, ...props}, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base vintage paper styling
          // 'relative bg-amber-50 dark:bg-amber-100',
          'document-background-manilla-darker',
          'subtle-graph-paper-grid-bg',
          // 'border-2 border-amber-200 dark:border-amber-300',
          'shadow-2xl',
          // Aged paper effect
          // 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-amber-100/20 before:to-amber-200/40',
          // 'before:pointer-events-none before:rounded-lg',
          // Slight paper curl effect
          // 'after:absolute after:top-0 after:right-0 after:w-6 after:h-6',
          // 'after:bg-gradient-to-br after:from-amber-200 after:to-amber-300',
          // 'after:transform after:rotate-45 after:-translate-y-1 after:translate-x-1',
          // 'after:shadow-md after:rounded-sm after:opacity-60',
          // Paper texture simulation with vignette effect
          // 'bg-[radial-gradient(circle_at_20%_20%,rgba(139,69,19,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(139,69,19,0.05)_0%,transparent_50%)]',
          // Enhanced vignette for authentic aging
          // 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]',
          // Overall card styling with enhanced depth
          'rounded-lg p-6 max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-300',
          // Enhanced aged spots and depth
          // 'shadow-[inset_0_0_20px_rgba(139,69,19,0.1),0_8px_32px_rgba(139,69,19,0.3)]',
          // Vintage document filters
          // 'filter saturate-90 contrast-110 blur-[0.3px]',
          className
        )}
        {...props}>
        {/* Classification Badge */}
        <ClassificationBadge level={classification} />

        {/* Masking tape effect for attachment */}
        <div className='absolute top-2 left-8 w-16 h-8 bg-gray-200/80 dark:bg-gray-300/80 transform -rotate-12 shadow-sm'>
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
        </div>
        <div className='absolute top-2 right-12 w-16 h-8 bg-gray-200/80 dark:bg-gray-300/80 transform rotate-6 shadow-sm'>
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
        </div>

        {/* Document Header */}
        <div className='relative z-10 mb-6'>
          <div className='text-center mb-4'>
            <h1 className='text-2xl font-bold text-black dark:text-gray-900 tracking-wider'>
              {title}
            </h1>
            {date && (
              <p className='text-lg text-gray-800 dark:text-gray-700 mt-1'>
                &mdash; {date} &mdash;
              </p>
            )}
            {location && (
              <p className='text-sm text-gray-700 dark:text-gray-600 mt-1 italic'>{location}</p>
            )}
          </div>
        </div>

        {/* Document Content */}
        <div className='relative z-10 text-black dark:text-gray-900'>{children}</div>

        {/* Vintage aging spots */}
        <div className='absolute top-16 right-20 w-3 h-3 bg-amber-300/40 rounded-full blur-sm'></div>
        <div className='absolute bottom-20 left-12 w-2 h-2 bg-amber-400/30 rounded-full blur-sm'></div>
        <div className='absolute top-32 left-6 w-1 h-1 bg-amber-500/50 rounded-full'></div>
      </div>
    )
  }
)

VintageDocumentCard.displayName = 'VintageDocumentCard'

export {VintageDocumentCard, ClassificationBadge}
export type {VintageDocumentCardProps}

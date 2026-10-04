'use client'

import * as React from 'react'
import {cn} from '@/utils'
import type {ClassificationLevel} from './types'
import './vintage-document.css'

interface VintageDocumentCardProps {
  className?: string
  children: React.ReactNode
  classification: ClassificationLevel
  title: string
  date: string
  location?: string
  fileRef?: string
}

function stampLabel(level: ClassificationLevel) {
  return `[ ${level.toUpperCase().replace('-', ' ')} ]`
}

const ClassificationBadge = ({level}: {level: ClassificationLevel}) => {
  return (
    <div className='vd-stamp' data-level={level} aria-label={`Classification ${level}`}>
      {stampLabel(level)}
    </div>
  )
}

const VintageDocumentCard = React.forwardRef<HTMLDivElement, VintageDocumentCardProps>(
  (
    {
      className,
      children,
      classification,
      title,
      date,
      location,
      fileRef = 'UT·VD // PERSONNEL',
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('vd-card', className)} {...props}>
        <ClassificationBadge level={classification} />

        <div className='vd-file-ref'>{fileRef}</div>

        <header className='vd-header'>
          <h1 className='vd-title'>{title}</h1>
          {date && <p className='vd-meta-line'>{date}</p>}
          {location && <p className='vd-location'>{location}</p>}
        </header>

        <div className='vd-body'>{children}</div>
      </div>
    )
  }
)

VintageDocumentCard.displayName = 'VintageDocumentCard'

export {VintageDocumentCard, ClassificationBadge}
export type {VintageDocumentCardProps}

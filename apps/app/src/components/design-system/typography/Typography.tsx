'use client'

import * as React from 'react'
import {cn} from '@/lib/utils'
import {cva, type VariantProps} from 'class-variance-authority'
import './typography.css'

const typographyVariants = cva('transition-all duration-200', {
  variants: {
    variant: {
      // Modern/Tech Interface Headings (Main App) - Uses Monument Grotesk
      h1: 'text-5xl md:text-6xl font-bold tracking-tight leading-tight font-monument',
      h2: 'text-4xl md:text-5xl font-bold tracking-tight leading-tight font-monument',
      h3: 'text-3xl md:text-4xl font-semibold tracking-tight leading-snug font-monument',
      h4: 'text-2xl md:text-3xl font-semibold tracking-tight leading-snug font-monument',
      h5: 'text-xl md:text-2xl font-medium tracking-tight leading-snug font-monument',
      h6: 'text-lg md:text-xl font-medium tracking-tight leading-snug font-monument',

      // Dystopian/Dramatic Headings
      'heading-main':
        'text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none font-monument transform hover:scale-105 transition-transform duration-300',
      'heading-distorted':
        'text-5xl md:text-6xl font-black uppercase tracking-widest leading-none font-monument transform scale-x-110 skew-x-[-5deg]',
      'heading-classified':
        'text-4xl md:text-5xl font-black uppercase tracking-wider leading-none relative font-monument classified-stamp',

      // Subheadings
      subheading: 'text-2xl md:text-3xl font-semibold uppercase tracking-wider font-monument',
      'subheading-glitch':
        'text-2xl md:text-3xl font-semibold uppercase tracking-wider font-monument',

      // Body Text - Using Neue Haas and Lukas Sans
      body: 'text-base leading-normal font-neue-haas',
      'body-large': 'text-lg leading-relaxed font-neue-haas',
      'body-small': 'text-sm leading-normal font-neue-haas',
      caption: 'text-xs leading-tight font-lukas tracking-wide uppercase opacity-70',

      // Technical/Data Display - Using Monument Grotesk Mono
      'data-label':
        'text-xs font-medium tracking-wider uppercase font-monument-mono opacity-80 data-table-text',
      'data-value': 'text-sm tabular-nums font-monument-mono data-table-text font-semibold',
      coordinates: 'text-xs tabular-nums font-monument-mono tracking-tight opacity-80',
      timestamp: 'text-xs font-monument-mono opacity-80',
      code: 'text-sm bg-muted px-2 py-1 rounded font-monument-mono',

      // Buttons / UI labels
      button: 'text-sm font-semibold uppercase tracking-wide font-neue-haas',

      // Research/Archival Interface (Noir Aesthetic)
      typewriter: 'font-typewriter tracking-wide leading-relaxed text-fragment text-aged',
      'typewriter-animated': 'font-typewriter text-typewriter tracking-wide',
      handwritten: 'font-handwriting leading-loose text-lg transform rotate-[-1deg]',
      annotation: 'text-xs font-handwriting transform rotate-1 opacity-70',
      stamp:
        'font-anton text-xl tracking-widest uppercase font-black transform rotate-[3deg] classified-stamp',

      // Special Effects
      glitch: 'glitch-element font-research-terminal tracking-wider uppercase',
      redacted: 'redacted-text font-typewriter tracking-wider',
      'scan-line': 'font-research-terminal scan-line-text tracking-wider',
      blurred: 'text-fragment filter blur-[0.3px]',
      faded: 'opacity-60 text-aged',
    },

    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      accent: 'text-accent-foreground',

      // Research/Archival colors
      'ink-black': 'text-[#1a1a1a]',
      'ink-faded': 'text-[#4a4a4a]',
      'fire-orange': 'text-[#ff6b35]',
      'classified-red': 'text-gradient-classified',

      // Special effects
      'fire-gradient': 'text-gradient-fire',
      glow: 'text-shadow-glow',
      'hard-shadow': 'text-shadow-hard',
    },

    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },

    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black',
    },

    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },

    transform: {
      none: 'transform-none',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    },
  },

  defaultVariants: {
    variant: 'body',
    color: 'default',
    weight: 'normal',
    align: 'left',
    transform: 'none',
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
  glitch?: boolean
  rotation?: number
  dataText?: string
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      align,
      transform,
      color,
      as,
      glitch,
      rotation,
      dataText,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Component = as || 'p'

    const combinedStyle = {
      ...style,
      ...(rotation && {'--rotation': `${rotation}deg`, transform: 'rotate(var(--rotation))'}),
    }

    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({variant, size, weight, align, transform, color}),
          glitch && 'glitch-element',
          className
        )}
        style={combinedStyle as React.CSSProperties}
        data-text={glitch ? dataText || children : undefined}
        {...props}>
        {children}
      </Component>
    )
  }
)

Typography.displayName = 'Typography'

export {Typography, typographyVariants}

// Convenience components for common use cases

// Modern/Tech Interface Components
export const Heading = React.forwardRef<HTMLHeadingElement, TypographyProps>((props, ref) => (
  <Typography as='h1' variant='heading-main' {...props} ref={ref} />
))
Heading.displayName = 'Heading'

export const SubHeading = React.forwardRef<HTMLHeadingElement, TypographyProps>((props, ref) => (
  <Typography as='h2' variant='h3' {...props} ref={ref} />
))
SubHeading.displayName = 'SubHeading'

export const DataLabel = React.forwardRef<HTMLSpanElement, TypographyProps>((props, ref) => (
  <Typography as='span' variant='data-label' {...props} ref={ref} />
))
DataLabel.displayName = 'DataLabel'

export const DataValue = React.forwardRef<HTMLSpanElement, TypographyProps>((props, ref) => (
  <Typography as='span' variant='data-value' {...props} ref={ref} />
))
DataValue.displayName = 'DataValue'

export const Code = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
  <Typography as='code' variant='code' {...props} ref={ref} />
))
Code.displayName = 'Code'

// Research/Archival Interface Components
export const TypewriterText = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
  <Typography variant='typewriter' {...props} ref={ref} />
))
TypewriterText.displayName = 'TypewriterText'

export const HandwrittenNote = React.forwardRef<HTMLSpanElement, TypographyProps>((props, ref) => (
  <Typography as='span' variant='handwritten' {...props} ref={ref} />
))
HandwrittenNote.displayName = 'HandwrittenNote'

export const ClassifiedStamp = React.forwardRef<HTMLSpanElement, TypographyProps>((props, ref) => (
  <Typography as='span' variant='stamp' color='classified-red' {...props} ref={ref} />
))
ClassifiedStamp.displayName = 'ClassifiedStamp'

// Special Effects Components
export const GlitchText = React.forwardRef<HTMLElement, TypographyProps>(
  ({children, dataText, ...props}, ref) => (
    <Typography
      variant='glitch'
      glitch
      dataText={dataText || String(children)}
      {...props}
      ref={ref}>
      {children}
    </Typography>
  )
)
GlitchText.displayName = 'GlitchText'

export const RedactedText = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
  <Typography variant='redacted' {...props} ref={ref} />
))
RedactedText.displayName = 'RedactedText'

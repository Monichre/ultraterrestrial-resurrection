import type {ReactNode} from 'react'
import {CornerBrackets} from './CornerBrackets'

type Props = {
  title?: string
  subtitle?: string
  className?: string
  innerClassName?: string
  brackets?: boolean
  bracketSize?: number
  ariaLabel?: string
  children: ReactNode
  as?: 'section' | 'div'
}

/**
 * Outlined HUD panel: 1px hairline border, sharp corners, optional red
 * L-corner brackets and an uppercase title.
 */
export const Panel = ({
  title,
  subtitle,
  className = '',
  innerClassName = '',
  brackets = true,
  bracketSize = 12,
  ariaLabel,
  children,
  as = 'section',
}: Props) => {
  const Tag = as
  return (
    <Tag
      aria-label={ariaLabel ?? title}
      className={`relative border border-hud-border-faint ${className}`}>
      {brackets ? <CornerBrackets size={bracketSize} inset={-1} /> : null}
      {title ? (
        <div className='px-4 pt-4'>
          <h2 className='text-[12px] font-medium uppercase tracking-[0.1em] text-hud-text-primary'>
            {title}
          </h2>
          {subtitle ? (
            <p className='mt-1 text-[9px] uppercase tracking-[0.08em] text-hud-text-secondary'>
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className={`p-4 ${title ? 'pt-3' : ''} ${innerClassName}`}>{children}</div>
    </Tag>
  )
}

import type React from 'react'

export interface SpriteIconProps extends React.SVGProps<SVGSVGElement> {
  icon: string
}

export const SpriteIcon: React.FC<SpriteIconProps> = ({icon, className, fill, ...props}) => (
  <svg
    aria-hidden='true'
    className={className || 'h-4 w-4 overflow-hidden'}
    fill={fill || 'rgb(0, 0, 0)'}
    {...props}>
    <use fill={fill || 'rgb(0, 0, 0)'} href={`/icons/sprite.svg#${icon}`} />
  </svg>
)

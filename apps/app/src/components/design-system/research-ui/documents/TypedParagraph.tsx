import React from 'react'
import {cn} from '../../../../lib/utils'
interface TypedParagraphProps {
  children: React.ReactNode
  className?: string
}
const TypedParagraph: React.FC<TypedParagraphProps> = ({children, className}) => {
  return (
    <p
      className={cn(
        'text-gray-900 leading-relaxed tracking-wide',
        'font-mono text-sm md:text-base',
        'selection:bg-amber-200',
        className
      )}
      style={{
        fontFamily: "'Courier New', 'Courier', monospace",
        letterSpacing: '0.5px',
      }}>
      {children}
    </p>
  )
}
export default TypedParagraph

import React from 'react'
import {cn} from '../../../../lib/utils'
interface HandwrittenNoteProps {
  text: string
  className?: string
}
const HandwrittenNote: React.FC<HandwrittenNoteProps> = ({text, className}) => {
  return (
    <span
      className={cn(
        'inline-block text-blue-900 font-bold',
        'text-sm md:text-base',
        'transform transition-transform duration-200',
        'hover:scale-105',
        'selection:bg-blue-200',
        className
      )}
      style={{
        fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
        textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.1)',
      }}>
      {text}
    </span>
  )
}
export default HandwrittenNote

'use client'

import React from 'react'
import {useState, useRef, useCallback, useEffect} from 'react'
import {Separator} from '@/components/ui/separator'
import {toast} from 'sonner'
import {
  Database,
  ExternalLink,
  ImageIcon,
  Figma,
  MonitorIcon,
  Paperclip,
  SendIcon,
  XIcon,
  LoaderIcon,
  Sparkles,
  Command,
} from 'lucide-react'
import {motion, AnimatePresence} from 'framer-motion'
import {cn} from '@/lib/utils'

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string
  showRing?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, containerClassName, showRing = true, ...props}, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <div className={cn('relative', containerClassName)}>
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'transition-all duration-200 ease-in-out',
            'placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
            showRing
              ? 'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
              : '',
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showRing && isFocused && (
          <motion.span
            className='absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
          />
        )}

        {props.onChange && (
          <div
            className='absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full'
            style={{
              animation: 'none',
            }}
            id='textarea-ripple'
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
export {Textarea}

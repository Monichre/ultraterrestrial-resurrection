'use client'

import {Markdown, type MarkdownProps} from '@/features/ai/components/prompt-kit/markdown'
import {AnimatePresence, motion} from 'framer-motion'
import {memo, useId, useMemo} from 'react'
import {cn} from '@/utils'
const MotionMarkdown = motion.create(Markdown)

// Animation variants for the container
const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

// Animation variants for each markdown block
const blockVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Parse markdown content into blocks for animation
function parseContentIntoBlocks(content: string): string[] {
  // Split by line breaks to animate paragraph by paragraph
  return content.split('\n\n').filter((block) => block.trim() !== '')
}

export interface AnimatedMarkdownProps extends MarkdownProps {
  delay?: number
  staggerDelay?: number
  animateExit?: boolean
  customVariants?: {
    container?: typeof containerVariants
    block?: typeof blockVariants
  }
}

// A simple component that wraps a block of markdown content with animation
const AnimatedMarkdownBlock = memo(
  ({content, className}: {content: string; className?: string}) => {
    return (
      <MotionMarkdown variants={blockVariants} className={cn('my-3', className)}>
        {content}
      </MotionMarkdown>
    )
  }
)
AnimatedMarkdownBlock.displayName = 'AnimatedMarkdownBlock'

export const AnimatedMarkdown = memo(
  ({
    children,
    className,
    delay = 0,
    staggerDelay = 0.05,
    animateExit = false,
    customVariants,
    ...props
  }: AnimatedMarkdownProps) => {
    const blockId = useId()

    // Create custom variants if provided
    const finalContainerVariants = useMemo(() => {
      if (customVariants?.container) {
        return customVariants.container
      }

      // Adjust the stagger delay if custom value provided
      if (staggerDelay !== 0.05 || delay !== 0) {
        return {
          ...containerVariants,
          visible: {
            ...containerVariants.visible,
            transition: {
              ...containerVariants.visible.transition,
              staggerChildren: staggerDelay,
              delayChildren: delay,
            },
          },
        }
      }

      return containerVariants
    }, [customVariants, delay, staggerDelay])

    // Split content into blocks for animation
    const blocks = useMemo(() => parseContentIntoBlocks(children), [children])

    return (
      <AnimatePresence mode='wait'>
        {/* <motion.div
          key={children} // Remount on content change
          initial='hidden'
          animate='visible'
          exit={animateExit ? 'hidden' : undefined}
          variants={finalContainerVariants}
          className={cn(
            'prose prose-invert prose-indigo max-w-none',
            // Custom prose styles
            'prose-headings:text-indigo-100 prose-p:text-indigo-200',
            'prose-a:text-indigo-400 prose-a:hover:text-indigo-300',
            'prose-strong:text-indigo-100 prose-em:text-indigo-200',
            'prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
            'prose-pre:bg-gray-900 prose-pre:rounded-md',
            'prose-blockquote:border-indigo-500 prose-blockquote:text-indigo-300',
            'prose-ul:text-indigo-200 prose-ol:text-indigo-200',
            'prose-li:my-1 prose-hr:border-indigo-700',
            'prose-table:border-collapse prose-th:text-indigo-200 prose-td:p-2 prose-td:border-indigo-800',
            className
          )}> */}
        {blocks.map((block, index) => (
          <AnimatedMarkdownBlock key={`${blockId}-block-${index}`} content={block} />
        ))}
        {/* </motion.div> */}
      </AnimatePresence>
    )
  }
)

AnimatedMarkdown.displayName = 'AnimatedMarkdown'

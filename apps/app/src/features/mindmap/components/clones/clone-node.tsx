// components/CloneChildNode.tsx

import { cn } from '@/utils'
import { motion } from 'framer-motion'
import { forwardRef, type FC } from 'react'


// Assuming xyflow/react provides a useDraggable hook or similar

interface CloneChildNodeProps {
  cloneId: string
  className?: string
  children: React.ReactNode
}

/**
 * Component representing a cloned child node.
 * Handles UI rendering and reports positional changes.
 *
 * @param nodeId - The ID of the original child node.
 * @param syncPosition - Function to report positional changes.
 */
export const CloneChildNode: FC<CloneChildNodeProps> = forwardRef<HTMLDivElement, CloneChildNodeProps>( ( { className, cloneId, children }, ref ) => {




  return (
    <motion.div
      ref={ref}
      className={cn( 'clone', className )}
      id={cloneId}
    >
      {children}
    </motion.div>
  )
} )


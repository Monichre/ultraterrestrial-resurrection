import React from 'react'

// Minimal BubbleMenu compatibility wrapper for Storybook/runtime
// TipTap v3 no longer exports BubbleMenu from '@tiptap/react'.
// This wrapper renders children directly without floating behavior.
// It accepts the common props used in the codebase but ignores them.

export type BubbleMenuProps = React.PropsWithChildren<{
  editor?: any
  pluginKey?: string
  shouldShow?: any
  updateDelay?: number
  tippyOptions?: any
}>

export function BubbleMenu({ children }: BubbleMenuProps) {
  return <>{children}</>
}

export default BubbleMenu

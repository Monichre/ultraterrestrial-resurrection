"use client"

import { FloatingToolbar } from "./FloatingToolbar"

export interface MindMapSideMenuProps {
  onToolChange?: (tool: string | null) => void
}

export const MindMapSideMenu = ({
  onToolChange,
}: MindMapSideMenuProps = {}) => {
  return (
    <FloatingToolbar />
  )
}
"use client"

import {FloatingToolbar, FloatingToolbarProps} from './FloatingToolbar'

export interface MindMapSideMenuProps {
  panels?: FloatingToolbarProps['panels']
}

export const MindMapSideMenu = ({panels}: MindMapSideMenuProps = {}) => {
  return <FloatingToolbar panels={panels} />
}
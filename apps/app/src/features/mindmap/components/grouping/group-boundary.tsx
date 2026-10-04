'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  MoreHorizontal, 
  Zap, 
  FileText, 
  Minimize2, 
  Maximize2, 
  X,
  Brain,
  Link2
} from 'lucide-react'
import { type SpatialGroup } from '@/features/mindmap/hooks/use-spatial-grouping'
import { cn } from '@/lib/utils'

interface GroupBoundaryProps {
  group: SpatialGroup
  isSelected: boolean
  isDragged: boolean
  onSelect: () => void
  onToggleCollapse: () => void
  onDissolve: () => void
  onCreateResearchSession: () => void
  onAnalyzeGroup: () => void
  className?: string
  style?: React.CSSProperties
}

export function GroupBoundary({
  group,
  isSelected,
  isDragged,
  onSelect,
  onToggleCollapse,
  onDissolve,
  onCreateResearchSession,
  onAnalyzeGroup,
  className,
  style
}: GroupBoundaryProps) {
  const [showActions, setShowActions] = useState(false)
  
  // Get visual styling based on group properties
  const getGroupStyling = () => {
    const baseStyle = {
      borderColor: 'rgba(34, 197, 94, 0.4)', // green-500/40
      backgroundColor: 'rgba(34, 197, 94, 0.05)', // green-500/5
      labelColor: 'rgb(34, 197, 94)' // green-500
    }
    
    // Adjust styling based on dominant entity type
    switch (group.metadata.dominantType) {
      case 'personnel':
        return {
          borderColor: 'rgba(168, 85, 247, 0.4)', // purple-500/40
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          labelColor: 'rgb(168, 85, 247)'
        }
      case 'events':
        return {
          borderColor: 'rgba(59, 130, 246, 0.4)', // blue-500/40
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          labelColor: 'rgb(59, 130, 246)'
        }
      case 'documents':
        return {
          borderColor: 'rgba(34, 197, 94, 0.4)', // green-500/40
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          labelColor: 'rgb(34, 197, 94)'
        }
      case 'locations':
        return {
          borderColor: 'rgba(245, 158, 11, 0.4)', // amber-500/40
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          labelColor: 'rgb(245, 158, 11)'
        }
      default:
        return baseStyle
    }
  }
  
  const styling = getGroupStyling()
  const confidenceOpacity = Math.max(0.3, group.metadata.confidence)
  
  // Calculate label position (top-left of boundary)
  const labelX = group.boundary.x
  const labelY = group.boundary.y - 8
  
  return (
    <g className={cn('group-boundary', className)} style={style}>
      {/* Main boundary rectangle */}
      <motion.rect
        x={group.boundary.x}
        y={group.boundary.y}
        width={group.boundary.width}
        height={group.boundary.height}
        rx={12}
        ry={12}
        fill={styling.backgroundColor}
        stroke={styling.borderColor}
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={group.isPersistent ? '0' : '8,4'}
        opacity={confidenceOpacity}
        className="transition-all duration-200 cursor-pointer"
        onClick={onSelect}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: isDragged ? 1.02 : 1, 
          opacity: confidenceOpacity,
          strokeWidth: isSelected ? 3 : 2
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        whileHover={{ 
          strokeWidth: 3,
          opacity: Math.min(1, confidenceOpacity + 0.2)
        }}
      />
      
      {/* Group label */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="cursor-pointer"
        onClick={onSelect}
      >
        {/* Label background */}
        <rect
          x={labelX - 4}
          y={labelY - 16}
          width={120}
          height={24}
          rx={12}
          fill="rgba(15, 23, 42, 0.95)" // slate-900/95
          stroke={styling.borderColor}
          strokeWidth={1}
        />
        
        {/* Group icon */}
        <foreignObject
          x={labelX}
          y={labelY - 12}
          width={16}
          height={16}
        >
          <Users 
            className="w-4 h-4" 
            style={{ color: styling.labelColor }}
          />
        </foreignObject>
        
        {/* Group text */}
        <text
          x={labelX + 20}
          y={labelY - 2}
          fill={styling.labelColor}
          fontSize="12"
          fontWeight="500"
          className="select-none"
        >
          {group.nodes.length} {group.metadata.dominantType}
          {group.nodes.length !== 1 ? 's' : ''}
        </text>
        
        {/* Confidence indicator */}
        <circle
          cx={labelX + 110}
          cy={labelY - 4}
          r={3}
          fill={styling.labelColor}
          opacity={group.metadata.confidence}
        />
      </motion.g>
      
      {/* Persistence indicator */}
      {group.isPersistent && (
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="pointer-events-none"
        >
          <circle
            cx={group.boundary.x + group.boundary.width - 12}
            cy={group.boundary.y + 12}
            r={6}
            fill={styling.labelColor}
            opacity={0.8}
          />
          <foreignObject
            x={group.boundary.x + group.boundary.width - 16}
            y={group.boundary.y + 8}
            width={8}
            height={8}
          >
            <Link2 className="w-2 h-2 text-white" />
          </foreignObject>
        </motion.g>
      )}
      
      {/* Collapsed state indicator */}
      {group.isCollapsed && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none"
        >
          <rect
            x={group.center.x - 30}
            y={group.center.y - 15}
            width={60}
            height={30}
            rx={15}
            fill="rgba(15, 23, 42, 0.9)"
            stroke={styling.borderColor}
            strokeWidth={2}
          />
          <text
            x={group.center.x}
            y={group.center.y + 4}
            fill={styling.labelColor}
            fontSize="12"
            textAnchor="middle"
            className="select-none"
          >
            {group.nodes.length} items
          </text>
        </motion.g>
      )}
      
      {/* Action buttons (when selected) */}
      <AnimatePresence>
        {isSelected && !group.isCollapsed && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
          >
            {/* Actions background */}
            <rect
              x={group.boundary.x + group.boundary.width - 140}
              y={group.boundary.y + group.boundary.height + 8}
              width={140}
              height={32}
              rx={16}
              fill="rgba(15, 23, 42, 0.95)"
              stroke={styling.borderColor}
              strokeWidth={1}
            />
            
            {/* Action buttons */}
            <ActionButton
              x={group.boundary.x + group.boundary.width - 132}
              y={group.boundary.y + group.boundary.height + 16}
              icon={<Brain className="w-3 h-3" />}
              onClick={onAnalyzeGroup}
              tooltip="Analyze Group"
              color={styling.labelColor}
            />
            
            <ActionButton
              x={group.boundary.x + group.boundary.width - 108}
              y={group.boundary.y + group.boundary.height + 16}
              icon={<FileText className="w-3 h-3" />}
              onClick={onCreateResearchSession}
              tooltip="Research Session"
              color={styling.labelColor}
            />
            
            <ActionButton
              x={group.boundary.x + group.boundary.width - 84}
              y={group.boundary.y + group.boundary.height + 16}
              icon={group.isCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              onClick={onToggleCollapse}
              tooltip={group.isCollapsed ? "Expand" : "Collapse"}
              color={styling.labelColor}
            />
            
            <ActionButton
              x={group.boundary.x + group.boundary.width - 60}
              y={group.boundary.y + group.boundary.height + 16}
              icon={<MoreHorizontal className="w-3 h-3" />}
              onClick={() => setShowActions(!showActions)}
              tooltip="More Options"
              color={styling.labelColor}
            />
            
            <ActionButton
              x={group.boundary.x + group.boundary.width - 36}
              y={group.boundary.y + group.boundary.height + 16}
              icon={<X className="w-3 h-3" />}
              onClick={onDissolve}
              tooltip="Dissolve Group"
              color="rgb(239, 68, 68)" // red-500
            />
          </motion.g>
        )}
      </AnimatePresence>
      
      {/* Extended actions menu */}
      <AnimatePresence>
        {showActions && isSelected && (
          <motion.g
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <rect
              x={group.boundary.x + group.boundary.width - 120}
              y={group.boundary.y + group.boundary.height + 48}
              width={120}
              height={80}
              rx={8}
              fill="rgba(15, 23, 42, 0.98)"
              stroke={styling.borderColor}
              strokeWidth={1}
            />
            
            <text
              x={group.boundary.x + group.boundary.width - 60}
              y={group.boundary.y + group.boundary.height + 68}
              fill="white"
              fontSize="10"
              textAnchor="middle"
              className="select-none"
            >
              Export Group
            </text>
            
            <text
              x={group.boundary.x + group.boundary.width - 60}
              y={group.boundary.y + group.boundary.height + 84}
              fill="white"
              fontSize="10"
              textAnchor="middle"
              className="select-none"
            >
              Duplicate Group
            </text>
            
            <text
              x={group.boundary.x + group.boundary.width - 60}
              y={group.boundary.y + group.boundary.height + 100}
              fill="white"
              fontSize="10"
              textAnchor="middle"
              className="select-none"
            >
              Pin to Canvas
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  )
}

// Action button component
interface ActionButtonProps {
  x: number
  y: number
  icon: React.ReactNode
  onClick: () => void
  tooltip: string
  color: string
}

function ActionButton({ x, y, icon, onClick, tooltip, color }: ActionButtonProps) {
  return (
    <g className="cursor-pointer group" onClick={onClick}>
      <circle
        cx={x}
        cy={y}
        r={8}
        fill="rgba(255, 255, 255, 0.1)"
        stroke={color}
        strokeWidth={1}
        className="transition-all duration-200 group-hover:fill-white group-hover:fill-opacity-20"
      />
      <foreignObject
        x={x - 6}
        y={y - 6}
        width={12}
        height={12}
        className="pointer-events-none"
      >
        <div style={{ color }} className="flex items-center justify-center w-full h-full">
          {icon}
        </div>
      </foreignObject>
      
      {/* Tooltip */}
      <text
        x={x}
        y={y - 16}
        fill={color}
        fontSize="8"
        textAnchor="middle"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none"
      >
        {tooltip}
      </text>
    </g>
  )
}
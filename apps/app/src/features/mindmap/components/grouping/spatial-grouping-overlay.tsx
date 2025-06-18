'use client'

import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReactFlow } from '@xyflow/react'
import { GroupBoundary } from './group-boundary'
import { useSpatialGrouping } from '@/features/mindmap/hooks/use-spatial-grouping'
import { type SpatialGroup } from '@/features/mindmap/hooks/use-spatial-grouping'

interface SpatialGroupingOverlayProps {
  onCreateResearchSession?: (group: SpatialGroup) => void
  onAnalyzeGroup?: (group: SpatialGroup) => void
  onGroupAction?: (action: string, group: SpatialGroup) => void
  className?: string
}

export function SpatialGroupingOverlay({
  onCreateResearchSession,
  onAnalyzeGroup,
  onGroupAction,
  className
}: SpatialGroupingOverlayProps) {
  const { getViewport } = useReactFlow()
  const {
    spatialGroups,
    selectedGroupId,
    draggedGroupId,
    toggleGroupCollapse,
    dissolveGroup,
    selectGroup,
    setDraggedGroupId
  } = useSpatialGrouping()
  
  const viewport = getViewport()
  
  // Handle group actions
  const handleCreateResearchSession = useCallback((group: SpatialGroup) => {
    console.log('Creating research session for group:', group)
    onCreateResearchSession?.(group)
    onGroupAction?.('create-research-session', group)
  }, [onCreateResearchSession, onGroupAction])
  
  const handleAnalyzeGroup = useCallback((group: SpatialGroup) => {
    console.log('Analyzing group:', group)
    onAnalyzeGroup?.(group)
    onGroupAction?.('analyze', group)
  }, [onAnalyzeGroup, onGroupAction])
  
  const handleToggleCollapse = useCallback((group: SpatialGroup) => {
    toggleGroupCollapse(group.id)
    onGroupAction?.('toggle-collapse', group)
  }, [toggleGroupCollapse, onGroupAction])
  
  const handleDissolveGroup = useCallback((group: SpatialGroup) => {
    dissolveGroup(group.id)
    selectGroup(null) // Deselect if we're dissolving the selected group
    onGroupAction?.('dissolve', group)
  }, [dissolveGroup, selectGroup, onGroupAction])
  
  const handleSelectGroup = useCallback((group: SpatialGroup) => {
    const newSelectedId = selectedGroupId === group.id ? null : group.id
    selectGroup(newSelectedId)
    onGroupAction?.('select', group)
  }, [selectedGroupId, selectGroup, onGroupAction])
  
  // Transform screen coordinates to SVG coordinates
  const transformCoordinates = useCallback((x: number, y: number) => {
    return {
      x: (x - viewport.x) / viewport.zoom,
      y: (y - viewport.y) / viewport.zoom
    }
  }, [viewport])
  
  if (spatialGroups.length === 0) {
    return null
  }
  
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className || ''}`}
      style={{ zIndex: 1 }} // Above nodes but below controls
    >
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0'
        }}
      >
        <defs>
          {/* Gradient definitions for group styling */}
          <linearGradient id="group-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.05)" />
          </linearGradient>
          
          {/* Filter for drop shadow */}
          <filter id="group-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.3)" />
          </filter>
          
          {/* Pattern for non-persistent groups */}
          <pattern id="dash-pattern" patternUnits="userSpaceOnUse" width="12" height="12">
            <rect width="12" height="12" fill="transparent" />
            <rect width="6" height="12" fill="rgba(34, 197, 94, 0.2)" />
          </pattern>
        </defs>
        
        {/* Render all spatial groups */}
        <AnimatePresence mode="popLayout">
          {spatialGroups.map((group) => (
            <GroupBoundary
              key={group.id}
              group={group}
              isSelected={selectedGroupId === group.id}
              isDragged={draggedGroupId === group.id}
              onSelect={() => handleSelectGroup(group)}
              onToggleCollapse={() => handleToggleCollapse(group)}
              onDissolve={() => handleDissolveGroup(group)}
              onCreateResearchSession={() => handleCreateResearchSession(group)}
              onAnalyzeGroup={() => handleAnalyzeGroup(group)}
              style={{
                pointerEvents: 'auto', // Enable interactions on group boundaries
                filter: 'url(#group-shadow)'
              }}
            />
          ))}
        </AnimatePresence>
        
        {/* Connection lines between related groups */}
        {spatialGroups.length > 1 && (
          <g className="group-connections" opacity="0.3">
            {spatialGroups.map((group1, i) =>
              spatialGroups.slice(i + 1).map((group2, j) => {
                // Check if groups share similar entity types or have overlapping analysis
                const hasSharedTypes = Object.keys(group1.metadata.entityCounts).some(type =>
                  Object.keys(group2.metadata.entityCounts).includes(type)
                )
                
                if (!hasSharedTypes) return null
                
                return (
                  <motion.line
                    key={`connection-${group1.id}-${group2.id}`}
                    x1={group1.center.x}
                    y1={group1.center.y}
                    x2={group2.center.x}
                    y2={group2.center.y}
                    stroke="rgba(34, 197, 94, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="pointer-events-none"
                  />
                )
              })
            )}
          </g>
        )}
      </svg>
      
      {/* Group statistics overlay */}
      {spatialGroups.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2 pointer-events-auto"
        >
          <div className="flex items-center space-x-4 text-xs text-slate-300">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>{spatialGroups.length} groups</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>{spatialGroups.filter(g => g.isPersistent).length} persistent</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span>{spatialGroups.filter(g => g.isCollapsed).length} collapsed</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Selected group info panel */}
      <AnimatePresence>
        {selectedGroupId && (
          <SelectedGroupPanel
            group={spatialGroups.find(g => g.id === selectedGroupId)}
            onClose={() => selectGroup(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Selected group info panel component
interface SelectedGroupPanelProps {
  group?: SpatialGroup
  onClose: () => void
}

function SelectedGroupPanel({ group, onClose }: SelectedGroupPanelProps) {
  if (!group) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute top-4 right-4 w-72 bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-xl pointer-events-auto"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-green-400 font-semibold">Group Details</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-400">Type:</span>
            <span className="ml-2 text-white">{group.metadata.dominantType}</span>
          </div>
          
          <div>
            <span className="text-slate-400">Entities:</span>
            <span className="ml-2 text-white">{group.nodes.length}</span>
          </div>
          
          <div>
            <span className="text-slate-400">Confidence:</span>
            <span className="ml-2 text-white">{Math.round(group.metadata.confidence * 100)}%</span>
          </div>
          
          <div>
            <span className="text-slate-400">Status:</span>
            <span className="ml-2 text-white">
              {group.isPersistent ? 'Persistent' : 'Temporary'}
              {group.isCollapsed && ' • Collapsed'}
            </span>
          </div>
          
          <div>
            <span className="text-slate-400">Created:</span>
            <span className="ml-2 text-white">
              {group.createdAt.toLocaleTimeString()}
            </span>
          </div>
          
          {/* Entity breakdown */}
          <div>
            <span className="text-slate-400 block mb-1">Entity Types:</span>
            <div className="space-y-1">
              {Object.entries(group.metadata.entityCounts).map(([type, count]) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="text-slate-300 capitalize">{type}</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Node list */}
          <div>
            <span className="text-slate-400 block mb-1">Entities:</span>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {group.nodes.map((node) => (
                <div key={node.id} className="text-xs text-slate-300 truncate">
                  {node.data?.name || node.data?.label || node.id}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
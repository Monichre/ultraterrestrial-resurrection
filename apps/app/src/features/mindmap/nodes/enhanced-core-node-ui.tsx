'use client'

import {cn} from '@/utils'
import {motion, AnimatePresence} from 'framer-motion'
import type React from 'react'
import type {RefObject} from 'react'
import {Badge} from '@/components/ui/badge'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Clock, MapPin, Users, FileText, Star, Eye, Brain, Sparkles} from 'lucide-react'

// Enhanced color system for different entity types
export const ENTITY_COLORS = {
  events: {
    primary: '#3B82F6', // Blue
    secondary: '#1E40AF',
    accent: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  personnel: {
    primary: '#10B981', // Green
    secondary: '#047857',
    accent: '#34D399',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  organizations: {
    primary: '#8B5CF6', // Purple
    secondary: '#5B21B6',
    accent: '#A78BFA',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  testimonies: {
    primary: '#F59E0B', // Amber
    secondary: '#D97706',
    accent: '#FCD34D',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  documents: {
    primary: '#EF4444', // Red
    secondary: '#DC2626',
    accent: '#F87171',
    glow: 'rgba(239, 68, 68, 0.3)',
  },
  topics: {
    primary: '#06B6D4', // Cyan
    secondary: '#0891B2',
    accent: '#22D3EE',
    glow: 'rgba(6, 182, 212, 0.3)',
  },
  contextual: {
    primary: '#14B8A6', // Teal (for contextual nodes)
    secondary: '#0F766E',
    accent: '#2DD4BF',
    glow: 'rgba(20, 184, 166, 0.3)',
  },
} as const

type EntityType = keyof typeof ENTITY_COLORS

interface EnhancedNodeStatusProps {
  type: EntityType
  isContextual?: boolean
  connectionCount?: number
  credibilityScore?: number
}

export const EnhancedNodeStatus: React.FC<EnhancedNodeStatusProps> = ({
  type,
  isContextual,
  connectionCount = 0,
  credibilityScore,
}) => {
  const colors = isContextual ? ENTITY_COLORS.contextual : ENTITY_COLORS[type]

  return (
    <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-neutral-800'>
      {isContextual && (
        <motion.div initial={{scale: 0}} animate={{scale: 1}} className='flex items-center gap-1'>
          <Brain className='w-3 h-3' style={{color: colors.accent}} />
          <span className='text-xs font-medium text-white/80'>Contextual</span>
        </motion.div>
      )}

      {connectionCount > 0 && (
        <div className='flex items-center gap-1'>
          <Users className='w-3 h-3 text-white/60' />
          <span className='text-xs text-white/80'>{connectionCount}</span>
        </div>
      )}

      {credibilityScore && (
        <div className='flex items-center gap-1'>
          <Star className='w-3 h-3 text-yellow-400' />
          <span className='text-xs text-white/80'>{credibilityScore}/10</span>
        </div>
      )}
    </div>
  )
}

interface EnhancedNodeHeaderProps {
  title: string
  subtitle?: string
  entityType: EntityType
  date?: string
  location?: string
  avatar?: string
  isContextual?: boolean
}

export const EnhancedNodeHeader: React.FC<EnhancedNodeHeaderProps> = ({
  title,
  subtitle,
  entityType,
  date,
  location,
  avatar,
  isContextual,
}) => {
  const colors = isContextual ? ENTITY_COLORS.contextual : ENTITY_COLORS[entityType]

  return (
    <div className='relative p-4 pb-2'>
      {/* Gradient background */}
      <div
        className='absolute inset-0 rounded-t-2xl opacity-90'
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        }}
      />

      {/* Glow effect */}
      <div
        className='absolute inset-0 rounded-t-2xl opacity-50 blur-xl'
        style={{
          background: colors.glow,
          transform: 'scale(1.05)',
        }}
      />

      <div className='relative z-10'>
        <div className='flex items-start justify-between mb-2'>
          <div className='flex-1 min-w-0'>
            <h3
              className='font-bold text-white truncate mb-1'
              style={{fontSize: 'clamp(0.95rem, 0.9vw + 0.75rem, 1.25rem)'}}>
              {title}
            </h3>
            {subtitle && (
              <p
                className='text-white/80 truncate'
                style={{fontSize: 'clamp(0.75rem, 0.6vw + 0.55rem, 0.95rem)'}}>
                {subtitle}
              </p>
            )}
          </div>

          {avatar && (
            <Avatar className='ml-3 ring-2 ring-white/20'>
              <AvatarImage src={avatar} alt={title} />
              <AvatarFallback className='bg-white/10 text-white'>
                {title
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className='flex items-center gap-3 text-xs text-white/70'>
          {date && (
            <div className='flex items-center gap-1'>
              <Clock className='w-3 h-3' />
              <span>{date}</span>
            </div>
          )}
          {location && (
            <div className='flex items-center gap-1'>
              <MapPin className='w-3 h-3' />
              <span className='truncate max-w-[120px]'>{location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface EnhancedNodeContentProps {
  children: React.ReactNode
  className?: string
  scrollable?: boolean
}

export const EnhancedNodeContent: React.FC<EnhancedNodeContentProps> = ({
  children,
  className = '',
  scrollable = false,
}) => {
  return (
    <div
      className={cn(
        'px-4 py-3 bg-neutral-900/95 backdrop-blur-sm',
        scrollable && 'overflow-y-auto max-h-64',
        className
      )}>
      {children}
    </div>
  )
}

interface EnhancedNodeFooterProps {
  children: React.ReactNode
  entityType: EntityType
  isContextual?: boolean
}

export const EnhancedNodeFooter: React.FC<EnhancedNodeFooterProps> = ({
  children,
  entityType,
  isContextual,
}) => {
  const colors = isContextual ? ENTITY_COLORS.contextual : ENTITY_COLORS[entityType]

  return (
    <div className='p-3 pt-2 bg-neutral-900/90 rounded-b-2xl border-t border-neutral-800'>
      <div className='flex items-center justify-between'>
        {children}

        {/* Entity type indicator */}
        <Badge
          variant='outline'
          className='text-xs border-0 text-white/70'
          style={{
            backgroundColor: `${colors.primary}20`,
            color: colors.accent,
          }}>
          {entityType}
          {isContextual && <Sparkles className='w-3 h-3 ml-1' />}
        </Badge>
      </div>
    </div>
  )
}

interface EnhancedNodeContainerProps {
  children: React.ReactNode
  id: string
  className?: string
  ref?: RefObject<HTMLDivElement>
  entityType: EntityType
  isSelected?: boolean
  isContextual?: boolean
  isHovered?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const EnhancedNodeContainer: React.FC<EnhancedNodeContainerProps> = ({
  children,
  id,
  className,
  ref,
  entityType,
  isSelected = false,
  isContextual = false,
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  const colors = isContextual ? ENTITY_COLORS.contextual : ENTITY_COLORS[entityType]

  return (
    <motion.div
      ref={ref}
      id={id}
      className={cn(
        'relative w-80 rounded-2xl overflow-hidden',
        'border transition-all duration-300 border-neutral-800',
        'bg-neutral-900/80 backdrop-blur-sm',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.03)] hover:shadow-xl hover:border-neutral-700',
        'will-change-transform',
        isSelected && 'border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.15)]',
        className
      )}
      style={{
        borderColor: isSelected ? colors.primary : 'rgba(255, 255, 255, 0.1)',
        boxShadow:
          isSelected || isHovered
            ? `0 20px 40px ${colors.glow}, 0 0 0 1px ${colors.primary}40`
            : '0 10px 20px rgba(0, 0, 0, 0.3)',
      }}
      initial={{opacity: 0, scale: 0.9, y: 20}}
      animate={{opacity: 1, scale: 1, y: 0}}
      whileHover={{
        scale: 1.02,
        transition: {duration: 0.2},
      }}
      whileTap={{scale: 0.98}}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      layout>
      {/* Contextual indicator glow */}
      {isContextual && (
        <motion.div
          className='absolute -inset-1 rounded-2xl opacity-60 blur-sm'
          style={{
            background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
            zIndex: -1,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {children}

      {/* Connection point indicator */}
      <motion.div
        className='absolute -bottom-2 left-1/2 transform -translate-x-1/2'
        initial={{opacity: 0}}
        animate={{opacity: isHovered ? 1 : 0}}
        transition={{duration: 0.2}}>
        <div
          className='w-4 h-4 rounded-full border-2 border-white/20'
          style={{backgroundColor: colors.primary}}
        />
      </motion.div>
    </motion.div>
  )
}

// Quick action buttons for the footer
interface QuickActionsProps {
  onViewDetails?: () => void
  onAddToResearch?: () => void
  onAskAI?: () => void
  onConnect?: () => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onViewDetails,
  onAddToResearch,
  onAskAI,
  onConnect,
}) => {
  return (
    <div className='flex items-center gap-2'>
      {onViewDetails && (
        <motion.button
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          onClick={onViewDetails}
          className='p-1.5 rounded-full bg-neutral-800 hover:bg-white/10 transition-colors border border-neutral-700/50'>
          <Eye className='w-3 h-3 text-white/70' />
        </motion.button>
      )}

      {onAddToResearch && (
        <motion.button
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          onClick={onAddToResearch}
          className='p-1.5 rounded-full bg-neutral-800 hover:bg-white/10 transition-colors border border-neutral-700/50'>
          <FileText className='w-3 h-3 text-white/70' />
        </motion.button>
      )}

      {onAskAI && (
        <motion.button
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          onClick={onAskAI}
          className='p-1.5 rounded-full bg-neutral-800 hover:bg-white/10 transition-colors border border-neutral-700/50'>
          <Brain className='w-3 h-3 text-white/70' />
        </motion.button>
      )}

      {onConnect && (
        <motion.button
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          onClick={onConnect}
          className='p-1.5 rounded-full bg-neutral-800 hover:bg-white/10 transition-colors border border-neutral-700/50'>
          <Users className='w-3 h-3 text-white/70' />
        </motion.button>
      )}
    </div>
  )
}

// Data visualization components for rich UFO data
interface DataPointProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  className?: string
}

export const DataPoint: React.FC<DataPointProps> = ({label, value, icon, className = ''}) => {
  return (
    <div className={cn('flex items-center gap-2 py-1', className)}>
      {icon && <div className='text-white/60'>{icon}</div>}
      <div className='flex-1 min-w-0'>
        <div className='text-xs text-white/60 uppercase tracking-wide'>{label}</div>
        <div className='text-sm text-white font-medium truncate'>{value}</div>
      </div>
    </div>
  )
}

export const DataGrid: React.FC<{children: React.ReactNode}> = ({children}) => {
  return <div className='grid grid-cols-2 gap-3 mt-3'>{children}</div>
}

'use client'

import {
  Building2,
  FileText,
  ImageIcon,
  Newspaper,
  ScrollText,
  UserRound,
  Video,
} from 'lucide-react'
import type {CaseFileLayer, CaseFileLayerType} from './data'

interface TypeConfig {
  icon: typeof FileText
  accent: string
  label: string
  texture: 'plain' | 'photo' | 'newsprint' | 'film'
}

const TYPE_CONFIG: Record<CaseFileLayerType, TypeConfig> = {
  summary: {icon: FileText, accent: '#e5e5e5', label: 'Case Summary', texture: 'plain'},
  photo: {icon: ImageIcon, accent: '#38bdf8', label: 'Photograph', texture: 'photo'},
  clipping: {icon: Newspaper, accent: '#d4a373', label: 'Newspaper Clipping', texture: 'newsprint'},
  video: {icon: Video, accent: '#fb923c', label: 'Video Archive', texture: 'film'},
  personnel: {icon: UserRound, accent: '#a78bfa', label: 'Key Figure', texture: 'plain'},
  source: {icon: ScrollText, accent: '#34d399', label: 'Primary Source', texture: 'plain'},
  organization: {icon: Building2, accent: '#fb7185', label: 'Organization', texture: 'plain'},
}

interface LayerCardProps {
  layer: CaseFileLayer
  hovered: boolean
  onPointerEnter: () => void
  onPointerLeave: () => void
  onClick: () => void
}

export function LayerCard({layer, hovered, onPointerEnter, onPointerLeave, onClick}: LayerCardProps) {
  const config = TYPE_CONFIG[layer.type]
  const Icon = config.icon
  const isSummary = layer.type === 'summary'

  return (
    <button
      type='button'
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      className='pointer-events-auto block cursor-pointer border-0 bg-transparent p-0 text-left'
      style={{
        width: isSummary ? 300 : 220,
        transform: hovered ? 'scale(1.08) translateY(-4px)' : 'scale(1)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
      }}>
      <div
        className='relative overflow-hidden rounded-lg border bg-black/70 backdrop-blur-sm'
        style={{
          borderColor: hovered ? config.accent : 'rgba(64,64,64,0.6)',
          boxShadow: hovered
            ? `0 12px 32px -8px ${config.accent}66, 0 0 0 1px ${config.accent}33`
            : '0 8px 20px -10px rgba(0,0,0,0.8)',
        }}>
        {/* accent rail */}
        <div className='absolute inset-y-0 left-0 w-1' style={{backgroundColor: config.accent}} />

        {config.texture === 'photo' && (
          <div
            className='relative h-24 w-full border-b border-neutral-800'
            style={{
              background:
                'repeating-linear-gradient(135deg, #2a2a28 0px, #2a2a28 2px, #1a1a18 2px, #1a1a18 4px)',
            }}>
            <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
              <ImageIcon className='h-6 w-6 text-neutral-500' />
            </div>
          </div>
        )}

        {config.texture === 'newsprint' && (
          <div
            className='h-16 w-full border-b border-neutral-800 opacity-80'
            style={{
              backgroundColor: '#e8dfc8',
              backgroundImage:
                'radial-gradient(circle, rgba(0,0,0,0.18) 0.5px, transparent 0.5px)',
              backgroundSize: '3px 3px',
            }}
          />
        )}

        {config.texture === 'film' && (
          <div className='relative h-16 w-full border-b border-neutral-800 bg-neutral-900'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <Video className='h-5 w-5 text-neutral-600' />
            </div>
            <div className='absolute inset-x-0 top-0 flex h-2 justify-between px-1'>
              {Array.from({length: 8}).map((_, i) => (
                <span key={`film-top-${layer.id}-${i}`} className='h-1.5 w-1 bg-neutral-700' />
              ))}
            </div>
          </div>
        )}

        <div className='space-y-2 p-3'>
          <div className='flex items-center justify-between gap-2'>
            <span
              className='flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider'
              style={{color: config.accent}}>
              <Icon className='h-3 w-3' />
              {config.label}
            </span>
          </div>

          <h3 className='font-mono text-sm font-bold leading-tight text-neutral-100'>
            {layer.title}
          </h3>

          {layer.subtitle && (
            <p className='font-mono text-[10px] text-neutral-500'>{layer.subtitle}</p>
          )}

          <p
            className='text-xs leading-relaxed text-neutral-400'
            style={{
              display: '-webkit-box',
              WebkitLineClamp: isSummary ? 6 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
            {layer.body}
          </p>

          {layer.tag && (
            <p className='font-mono text-[9px] uppercase tracking-wide text-neutral-600'>
              {layer.tag}
            </p>
          )}

          {layer.meta && layer.meta.length > 0 && (
            <div className='space-y-0.5 border-t border-neutral-800 pt-2'>
              {layer.meta.map((m) => (
                <div key={m.label} className='flex justify-between gap-2 font-mono text-[9px]'>
                  <span className='text-neutral-600'>{m.label}</span>
                  <span className='text-neutral-400'>{m.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className='pointer-events-none absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #a3a3a3 1px, transparent 0)',
            backgroundSize: '14px',
          }}
        />
      </div>
    </button>
  )
}

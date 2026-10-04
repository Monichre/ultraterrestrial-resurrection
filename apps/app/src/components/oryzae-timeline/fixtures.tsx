import type {CSSProperties} from 'react'
import {ORYZAE_COLORS, type MemoryNode} from './types'

const monoLabel: CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 8,
  color: ORYZAE_COLORS.muted,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
}

export const SAMPLE_MEMORIES: MemoryNode[] = [
  {
    id: 1,
    side: 'left',
    date: '2025.01.14',
    dayLabel: null,
    card: {
      width: 280,
      bg: ORYZAE_COLORS.cardWarm,
      pad: '24px',
      baseRotate: -1.5,
      hoverRotate: -1,
      shadow: '0 4px 12px rgba(0,0,0,0.3)',
      body: (
        <>
          <div style={{...monoLabel, marginBottom: 8}}>08:42 — snippet</div>
          <div style={{height: 2, background: 'rgba(255,255,255,0.05)', marginBottom: 12}} />
          <p style={{fontSize: 13, lineHeight: 1.7, color: ORYZAE_COLORS.inkSoft}}>
            朝の光の中でコーヒーを淹れる時間、通り過ぎる風の冷たさを感じる瞬間——そこに、静かな豊かさがある。
          </p>
        </>
      ),
    },
  },
  {
    id: 2,
    side: 'right',
    date: null,
    dayLabel: 'Tuesday',
    card: {
      width: 200,
      bg: ORYZAE_COLORS.card,
      pad: '12px 12px 32px 12px',
      baseRotate: 2,
      hoverRotate: 4,
      shadow: '0 8px 20px -4px rgba(0,0,0,0.5)',
      body: (
        <>
          <div style={{...monoLabel, textAlign: 'center', marginBottom: 8}}>11:15 — photo</div>
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 8,
              background: '#1f1f1f',
            }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.5,
                background: 'linear-gradient(to bottom right, #d4a883, #e8d5c4, #c7bca5)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 96,
                height: 96,
                borderRadius: '50%',
                opacity: 0.6,
                background: '#ffecd1',
                filter: 'blur(24px)',
              }}
            />
          </div>
          <p
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: ORYZAE_COLORS.muted,
              fontStyle: 'italic',
              fontFamily: "'Noto Serif JP', serif",
            }}>
            Morning light
          </p>
        </>
      ),
    },
  },
  {
    id: 3,
    side: 'left',
    date: null,
    dayLabel: null,
    card: {
      width: 360,
      bg: ORYZAE_COLORS.card,
      pad: '32px',
      baseRotate: -0.5,
      hoverRotate: 0,
      shadow: '0 4px 12px rgba(0,0,0,0.3)',
      body: (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
              borderBottom: '1px solid #2c2c2c',
              paddingBottom: 8,
            }}>
            <span style={{...monoLabel, fontSize: 9}}>15:30 — entry</span>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: ORYZAE_COLORS.accentSoft,
              }}
            />
          </div>
          <p
            style={{
              color: ORYZAE_COLORS.ink,
              lineHeight: '28px',
              fontSize: 13,
              fontFamily: "'Noto Serif JP', serif",
            }}>
            吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。
          </p>
        </>
      ),
    },
  },
  {
    id: 4,
    side: 'right',
    date: null,
    dayLabel: null,
    card: {
      width: 240,
      bg: ORYZAE_COLORS.cardOlive,
      pad: '24px',
      baseRotate: 3,
      hoverRotate: 2,
      shadow: '0 4px 12px rgba(0,0,0,0.3)',
      body: (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}>
            <div style={{width: 6, height: 6, borderRadius: '50%', background: '#b8a86e'}} />
            <span
              style={{
                ...monoLabel,
                color: ORYZAE_COLORS.accent,
              }}>
              19:20 — insight
            </span>
          </div>
          <p style={{fontSize: 13, lineHeight: 1.7, color: ORYZAE_COLORS.ink}}>
            問いとは、答えを求めるためではなく、自分の内側を照らすための光かもしれない。
          </p>
        </>
      ),
    },
  },
  {
    id: 5,
    side: 'left',
    date: null,
    dayLabel: null,
    card: {
      width: 180,
      bg: ORYZAE_COLORS.card,
      pad: '10px 10px 24px 10px',
      baseRotate: -4,
      hoverRotate: -6,
      shadow: '0 8px 20px -4px rgba(0,0,0,0.5)',
      body: (
        <>
          <div
            style={{
              ...monoLabel,
              textAlign: 'center',
              color: ORYZAE_COLORS.faint,
              marginBottom: 6,
            }}>
            22:10 — snapshot
          </div>
          <div
            style={{
              width: '100%',
              aspectRatio: '4 / 5',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 8,
              background: '#1f1f1f',
            }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.4,
                background: 'linear-gradient(to top left, #7c9a92, #a3b8b2, #cbdad7)',
              }}
            />
          </div>
          <p
            style={{
              textAlign: 'center',
              fontSize: 10,
              color: ORYZAE_COLORS.muted,
              fontStyle: 'italic',
              fontFamily: "'Noto Serif JP', serif",
            }}>
            Rainy afternoon
          </p>
        </>
      ),
    },
  },
  {
    id: 6,
    side: 'right',
    date: null,
    dayLabel: '昨日',
    dimmed: true,
    card: {
      width: 220,
      bg: ORYZAE_COLORS.cardWarm,
      pad: '20px',
      baseRotate: 1,
      hoverRotate: -1,
      shadow: '0 4px 12px rgba(0,0,0,0.3)',
      body: (
        <p style={{fontSize: 12, lineHeight: 2, color: '#cfcfcf'}}>
          発酵は待つことを教えてくれる。焦らず、ただそこにいることの意味。
        </p>
      ),
    },
  },
]

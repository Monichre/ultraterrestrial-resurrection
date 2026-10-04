'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import type {
  CaseStackData,
  LayerBody,
  StackLayer,
} from './types'
import './record-stack.css'

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

function LayerBodyView({ body }: { body: LayerBody }) {
  switch (body.kind) {
    case 'event':
      return (
        <dl className='uts-facts'>
          {body.facts.map((f) => (
            <div key={f.term} style={{ display: 'contents' }}>
              <dt>{f.term}</dt>
              <dd>{f.detail}</dd>
            </div>
          ))}
        </dl>
      )
    case 'personnel':
      return (
        <table className='uts-witnesses'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Testimony</th>
            </tr>
          </thead>
          <tbody>
            {body.witnesses.map((w) => (
              <tr key={w.name}>
                <td className='nm'>{w.name}</td>
                <td>{w.role}</td>
                <td>
                  <span className='ut-badge' data-state={w.testimony}>
                    {w.testimony}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    case 'evidence':
      return (
        <ul className='uts-evidence'>
          {body.items.map((item) => (
            <li key={item.name}>
              <span className='nm'>{item.name}</span>
              <span className='ut-badge' data-state={item.state}>
                {item.state}
              </span>
              <span className='prov'>{item.provenance}</span>
            </li>
          ))}
        </ul>
      )
    case 'analysis':
      return (
        <div className='uts-analysis'>
          {body.hypotheses.map((h) => (
            <div className='hyp' key={h.label}>
              <span>{h.label}</span>
              <span className='ut-badge' data-state={h.state}>
                {h.state}
              </span>
            </div>
          ))}
          <div className='metric'>
            anomaly index <b>{body.anomalyIndex}</b>
          </div>
          <p className='falsify'>{body.falsifiability}</p>
        </div>
      )
  }
}

interface LayerNodeProps {
  layers: StackLayer[]
  depth: number
  selectedId: string
  onSelect: (id: string) => void
}

/** Recursive layer tree — nesting is what makes Z translates compound. */
function LayerNode({ layers, depth, selectedId, onSelect }: LayerNodeProps) {
  const [layer, ...rest] = layers
  const isAnalysis = layer.body.kind === 'analysis'
  return (
    <section className={`uts-layer${depth > 0 ? ' uts-layer--nested' : ''}`}>
      <div className='uts-mover' data-selected={selectedId === layer.id}>
        <div className='uts-shadow' aria-hidden='true'>
          <div />
        </div>
        <div
          className={`uts-content${isAnalysis ? ' uts-content--analysis' : ''}`}
        >
          <button
            type='button'
            className='uts-heading'
            onClick={() => onSelect(layer.id)}
            onPointerEnter={() => onSelect(layer.id)}
          >
            <span className='idx'>L:{String(depth + 1).padStart(2, '0')}</span>
            <span className='ttl'>{layer.label}</span>
            <span className='ut-badge' data-state={layer.state}>
              {layer.state}
            </span>
            <span className='links'>{layer.links.length} linked</span>
          </button>
          <div className='uts-body'>
            <LayerBodyView body={layer.body} />
          </div>
        </div>
      </div>
      {rest.length > 0 && (
        <LayerNode
          layers={rest}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )}
    </section>
  )
}

export interface RecordStackProps {
  data: CaseStackData
}

export function RecordStack({ data }: RecordStackProps) {
  const [exploded, setExploded] = useState(false)
  const [step, setStep] = useState(3.2)
  const [orbit, setOrbit] = useState({ x1: -20, y1: 35, x2: 30 })
  const [dragging, setDragging] = useState(false)
  const [selectedId, setSelectedId] = useState(data.layers[0]?.id ?? '')
  const drag = useRef<{ x: number; y: number; y1: number; x2: number } | null>(
    null,
  )

  const selected = useMemo(
    () => data.layers.find((l) => l.id === selectedId) ?? data.layers[0],
    [data.layers, selectedId],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!exploded) return
      const target = e.target as HTMLElement
      if (target.closest('.ut-stack-hud, .ut-stack-inspector, button, input'))
        return
      drag.current = {
        x: e.clientX,
        y: e.clientY,
        y1: orbit.y1,
        x2: orbit.x2,
      }
      setDragging(true)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [exploded, orbit],
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    setOrbit((o) => ({
      ...o,
      y1: clamp(drag.current!.y1 + dx * 0.25, -75, 105),
      x2: clamp(drag.current!.x2 - dy * 0.25, -20, 80),
    }))
  }, [])

  const onPointerUp = useCallback(() => {
    drag.current = null
    setDragging(false)
  }, [])

  return (
    <div
      className='ut-stack-scene'
      data-exploded={exploded}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className='ut-stack'
        data-exploded={exploded}
        data-dragging={dragging}
        style={
          {
            '--x1': orbit.x1,
            '--y1': orbit.y1,
            '--x2': orbit.x2,
            '--step': step,
          } as React.CSSProperties
        }
      >
        {/* case shell: outermost layer of the anatomy */}
        <section className='uts-layer'>
          <div className='uts-mover' data-selected={false}>
            <div className='uts-shadow' aria-hidden='true'>
              <div />
            </div>
            <div className='uts-content uts-content--case'>
              <div className='uts-case-head'>
                <span className='uts-fileref'>
                  <span>{data.fileRef} · L:{String(data.layers.length + 1).padStart(2, '0')}</span>
                  <span className='classif'>{data.classification}</span>
                </span>
                <span className='uts-case-title'>{data.title}</span>
              </div>
              <div className='uts-slot' aria-hidden='true' />
            </div>
          </div>
          <LayerNode
            layers={data.layers}
            depth={1}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
      </div>

      <div className='ut-stack-hud'>
        <button type='button' onClick={() => setExploded((v) => !v)}>
          {exploded ? '[ collapse ]' : '[ unpack record ]'}
        </button>
        <label>
          z-sep
          <input
            type='range'
            min={2}
            max={7}
            step={0.1}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
          />
        </label>
        <span className='hint'>
          {exploded ? 'drag to orbit · hover a layer to lift it' : data.subtitle}
        </span>
      </div>

      {selected && (
        <aside className='ut-stack-inspector'>
          <span className='insp-ref'>
            {data.fileRef} · {selected.id.toUpperCase()}
          </span>
          <div className='insp-title'>
            <span>{selected.label}</span>
            <span className='ut-badge' data-state={selected.state}>
              {selected.state}
            </span>
          </div>
          <p className='insp-summary'>{selected.summary}</p>
          <span className='insp-web'>record web · {selected.links.length} edges</span>
          <ul className='insp-links'>
            {selected.links.map((link) => (
              <li key={link.ref}>
                <span className='ref'>{link.ref}</span>
                <span className='lbl'>
                  {link.label}
                  <span className='ut-badge' data-state={link.state}>
                    {link.state}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  )
}

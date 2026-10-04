'use client'

export type CanvasPinProps = {
  left: number
  top: number
}

export function CanvasPin({ left, top }: CanvasPinProps) {
  return <span className="lrc-pin" style={{ left, top }} aria-hidden />
}

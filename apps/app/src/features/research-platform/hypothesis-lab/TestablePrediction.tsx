'use client'

export interface TestablePredictionProps {
  label: string
  text: string
}

export function TestablePrediction({ label, text }: TestablePredictionProps) {
  return (
    <div className="pred">
      <b>{label}</b>
      <p>{text}</p>
    </div>
  )
}

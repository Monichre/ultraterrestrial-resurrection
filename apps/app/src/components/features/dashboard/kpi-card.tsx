import './kpi-card.css'

type KPICardProps = {
  label: string
  value: string | number
  helperText?: string
}

export function KPICard({label, value, helperText}: KPICardProps) {
  return (
    <article className='assembling-kpi-card'>
      <p className='assembling-kpi-card__label'>{label}</p>
      <p className='assembling-kpi-card__value'>{value}</p>
      {helperText ? <p className='assembling-kpi-card__helper'>{helperText}</p> : null}
    </article>
  )
}

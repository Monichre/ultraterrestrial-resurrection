export function CalloutBadge({number, top = 0}: {number: number; top?: number}) {
  return (
    <span className='dp-callout' style={{top: `${top}px`}} aria-hidden='true'>
      {number}
    </span>
  )
}

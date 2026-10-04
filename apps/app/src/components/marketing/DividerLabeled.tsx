import './marketing.css'

export function DividerLabeled({label = 'AI'}: {label?: string}) {
  return (
    <div className='rule-labeled'>
      <span className='pill'>{label}</span>
    </div>
  )
}

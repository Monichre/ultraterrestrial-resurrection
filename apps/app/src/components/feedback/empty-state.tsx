import './empty-state.css'

type EmptyStateProps = {
  title?: string
  message: string
}

export function EmptyState({title, message}: EmptyStateProps) {
  return (
    <div className='assembling-empty-state' role='status'>
      {title ? <p className='assembling-empty-state__title'>{title}</p> : null}
      <p className='assembling-empty-state__message'>{message}</p>
    </div>
  )
}

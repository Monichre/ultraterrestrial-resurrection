import './spinner.css'

const DEFAULT_SPINNER_LABEL = 'Loading'

type SpinnerProps = {
  label?: string
}

export function Spinner({label = DEFAULT_SPINNER_LABEL}: SpinnerProps) {
  return (
    <span className='assembling-spinner' role='status' aria-label={label}>
      <span className='assembling-spinner__visual' aria-hidden />
    </span>
  )
}

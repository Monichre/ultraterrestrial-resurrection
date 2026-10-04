export const MaskingTape = ({position}: {position?: 'left' | 'right'}) => {
  return (
    <div
      className={`masking-tape ${position === 'left' ? 'masking-tape-top-left' : 'masking-tape-top-right'}`}
    />
  )
}

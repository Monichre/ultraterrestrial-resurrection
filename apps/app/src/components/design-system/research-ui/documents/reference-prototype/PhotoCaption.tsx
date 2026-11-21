interface PhotoCaptionProps {
  labelTop: string
  captionNote: string
  className?: string
}

export function PhotoCaption({ labelTop, captionNote, className = "" }: PhotoCaptionProps) {
  return (
    <figcaption className={`caption z-40 ${className}`}>
      <strong className="label">{labelTop}</strong>
      <p className="note scribble">{captionNote}</p>
    </figcaption>
  )
}

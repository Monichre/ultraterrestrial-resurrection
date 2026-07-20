import {cn} from '@/lib/utils'

export type PhotoCaptionProps = {
  labelTop: string
  captionNote: string
  className?: string
}

/**
 * Archival photo caption — bold plate label + handwritten note.
 * Default: polaroid footer under an image. Pass absolute positioning via className for overlays.
 */
export const PhotoCaption = ({labelTop, captionNote, className}: PhotoCaptionProps) => (
  <figcaption className={cn('mt-2 space-y-0.5 px-0.5', className)}>
    <strong className='block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-800'>
      {labelTop}
    </strong>
    <p
      className='text-[11px] leading-snug text-neutral-700'
      style={{fontFamily: 'Caveat, "Comic Sans MS", cursive'}}>
      {captionNote}
    </p>
  </figcaption>
)

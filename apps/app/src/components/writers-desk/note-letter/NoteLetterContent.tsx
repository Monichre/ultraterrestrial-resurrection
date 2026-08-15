import type { NoteParagraph, NoteSignature } from './types'

export interface NoteLetterContentProps {
  title: string
  paragraphs: NoteParagraph[]
  signature: NoteSignature
}

export function NoteLetterContent({
  title,
  paragraphs,
  signature,
}: NoteLetterContentProps) {
  return (
    <>
      <h2 className='text-lg font-semibold leading-7 tracking-tight text-ink-strong'>{title}</h2>

      <hr className='mb-5 mt-3 border-t border-divider-subtle' />

      <div>
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`text-[15px] leading-7 text-ink ${index > 0 ? 'mt-[18px]' : ''}`}
          >
            {paragraph.boldPrefix && (
              <strong className='font-semibold text-ink-strong'>{paragraph.boldPrefix}</strong>
            )}
            {paragraph.boldPrefix ? ` ${paragraph.text}` : paragraph.text}
          </p>
        ))}
      </div>

      <div className='mt-7 border-t border-divider-subtle pt-5'>
        <div className='text-[15px] font-semibold leading-6 text-ink-strong'>{signature.name}</div>
        <div className='mt-1 text-sm leading-5 text-ink-muted'>{signature.title}</div>
        {signature.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className='mt-4 h-7 w-auto select-none opacity-80'
            src={signature.imageUrl}
            alt={`${signature.name} signature`}
          />
        )}
      </div>
    </>
  )
}

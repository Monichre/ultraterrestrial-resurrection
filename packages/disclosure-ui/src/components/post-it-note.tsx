import { cn } from '../lib/cn'

import type { PostItNoteProps } from './types'

const COLORS: Record<NonNullable<PostItNoteProps['color']>, string> = {
  yellow: 'bg-[#FDE68A] text-[#1e3a5f]',
  green: 'bg-[#BBF7D0] text-[#14532d]',
  blue: 'bg-[#BFDBFE] text-[#1e3a8a]',
  pink: 'bg-[#FBCFE8] text-[#831843]',
}

export function PostItNote({
  content,
  color = 'yellow',
  rotation = -2,
  author,
  className,
  onClick,
}: PostItNoteProps) {
  const Comp = onClick ? 'button' : 'div'

  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'min-h-[88px] w-[140px] rounded-[2px] px-3 py-3 text-left shadow-[2px_3px_10px_rgba(0,0,0,0.28)]',
        'transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/80',
        COLORS[color],
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <p
        className="text-[15px] leading-snug"
        style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive" }}
      >
        {content}
      </p>
      {author ? (
        <p
          className="mt-2 text-[11px] opacity-70"
          style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive" }}
        >
          {author}
        </p>
      ) : null}
    </Comp>
  )
}

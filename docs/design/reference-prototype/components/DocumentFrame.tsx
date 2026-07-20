import type { DocumentFrameProps } from "@/types/document"

export function DocumentFrame({ children, className = "" }: DocumentFrameProps) {
  return (
    <div className={`relative mx-auto w-full max-w-4xl shadow-2xl document-texture h-auto ${className}`}>
      {/* Aged paper tint + grain overlays */}
      <div
        className="absolute inset-0 opacity-20 bg-gradient-to-br from-yellow-200 via-transparent to-amber-200 pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 opacity-10 noise-pattern pointer-events-none" aria-hidden="true" />
      {/* Center crease */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 opacity-30 -translate-x-px"
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

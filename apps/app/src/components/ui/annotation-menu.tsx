"use client"

interface AnnotationMenuProps {
  x: number
  y: number
  onClose: () => void
  onAnnotate: (type: string) => void
}

export function AnnotationMenu({ x, y, onClose, onAnnotate }: AnnotationMenuProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
      className="bg-black border border-neutral-800 rounded-md shadow-lg p-2 flex flex-col gap-1"
    >
      <button
        onClick={() => onAnnotate("highlight")}
        className="text-xs px-3 py-1 hover:bg-[#27F1FF]/20 rounded-sm text-left text-neutral-300 hover:text-[#27F1FF] transition-colors"
      >
        Highlight
      </button>
      <button
        onClick={() => onAnnotate("underline")}
        className="text-xs px-3 py-1 hover:bg-[#27F1FF]/20 rounded-sm text-left text-neutral-300 hover:text-[#27F1FF] transition-colors"
      >
        Underline
      </button>
      <button
        onClick={() => onAnnotate("circle")}
        className="text-xs px-3 py-1 hover:bg-[#27F1FF]/20 rounded-sm text-left text-neutral-300 hover:text-[#27F1FF] transition-colors"
      >
        Circle
      </button>
      <button 
        onClick={onClose} 
        className="text-xs px-3 py-1 hover:bg-red-900/20 rounded-sm text-left text-neutral-300 hover:text-red-400 transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}
"use client"

import { cn } from "@/lib/utils"

interface PanelWrapperProps {
  children: React.ReactNode
  className?: string
  texture?: "grid" | "fabric" | "paper" | "noise" | "none"
}

const TEXTURES = {
  grid: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inflicted-1xid7cGZMmE1zz4oQgcbm6qthjn6c4.png",
  fabric: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fabric-of-squares%20%281%29-bUyHVRroKXUYpYdro80DXnS8nXEoFq.png",
  paper: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/groovepaper-cGf9B6CYWVBbmbU0SAJSLgVlqcj0lg.png",
  noise: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grid-noise-qOe4Nv7RwGbF17SnzRZcy2ikmU7Bw5.png",
}

export function PanelWrapper({ children, className, texture = "fabric" }: PanelWrapperProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-neutral-800 shadow-2xl",
        className
      )}
    >
      {/* Base dark layer */}
      <div className="absolute inset-0 bg-neutral-900/98" />
      
      {/* Texture overlay */}
      {texture !== "none" && (
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url(${TEXTURES[texture]})`,
            backgroundRepeat: "repeat",
            backgroundSize: texture === "grid" ? "200px 200px" : "auto",
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

import type * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ActionChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
}

export function ActionChip({ icon, children, className, ...props }: ActionChipProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-10 rounded-full border border-[var(--ut-line)] bg-[var(--ut-surface)] px-4 gap-3 text-[var(--ut-ink-dim)] backdrop-blur-md transition-colors duration-150 hover:bg-[oklch(0.93_0.015_90/0.1)] hover:text-[var(--ut-paper)]",
        !children && "w-10 px-0",
        className,
      )}
      {...props}
    >
      {icon}
      {children && <span className="max-w-[233px] overflow-hidden text-ellipsis whitespace-nowrap">{children}</span>}
    </Button>
  )
}

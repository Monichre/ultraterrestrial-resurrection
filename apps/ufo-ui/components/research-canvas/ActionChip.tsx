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
        "h-10 text-[#8c8c8c] bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-4 gap-3 hover:bg-white/10 hover:text-white",
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

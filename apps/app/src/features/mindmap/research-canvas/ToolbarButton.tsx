import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button, type ButtonProps } from "@/components/ui/button"

interface ToolbarButtonProps extends ButtonProps {
  tooltip: string
  isActive?: boolean
}

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, tooltip, isActive, children, ...props }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              variant="ghost"
              className={cn(
                "shrink-0 text-center text-nowrap whitespace-nowrap justify-center items-center rounded-full size-10 p-0 transition-colors duration-150",
                isActive
                  ? "text-[oklch(0.18_0.008_85)] bg-[var(--ut-paper)] hover:bg-[var(--ut-paper)]"
                  : "text-[var(--ut-ink-faint)] hover:bg-[oklch(0.93_0.015_90/0.12)] hover:text-[var(--ut-paper)]",
                className,
              )}
              {...props}
            >
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="ut-mono border-[var(--ut-line-strong)] bg-[var(--ut-surface-2)] text-[10px] text-[var(--ut-ink-dim)]"
          >
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
)

ToolbarButton.displayName = "ToolbarButton"

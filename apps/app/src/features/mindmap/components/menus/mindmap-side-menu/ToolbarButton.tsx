import * as React from "react"
import { cn } from "@/utils/index"
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
                "shrink-0 text-center text-nowrap whitespace-nowrap justify-center items-center rounded-full size-10 p-0",
                isActive
                  ? "text-neutral-900 bg-white hover:bg-white"
                  : "text-neutral-400 hover:bg-white/20 hover:text-white",
                className,
              )}
              {...props}
            >
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-neutral-900 text-white border-neutral-700">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
)

ToolbarButton.displayName = "ToolbarButton"

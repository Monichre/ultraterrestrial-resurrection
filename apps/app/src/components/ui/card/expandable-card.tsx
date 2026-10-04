// ./src/components/ui/card/expandable-card.tsx

import { cn } from "@/utils"
import React, { useState } from 'react'

interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  defaultExpanded?: boolean
  children: React.ReactNode
}

const ExpandableCard = React.forwardRef<HTMLDivElement, ExpandableCardProps>(
  ( { title, defaultExpanded = false, children, className, ...props }, ref ) => {
    const [isExpanded, setIsExpanded] = useState( defaultExpanded )

    return (
      <div
        ref={ref}
        className={cn( "overflow-hidden rounded-lg border", className )}
        {...props}
      >
        <button
          type="button"
          onClick={() => setIsExpanded( !isExpanded )}
          className="flex w-full items-center justify-between px-4 py-2 font-medium transition-colors hover:bg-muted/50"
        >
          <span>{title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isExpanded ? "rotate-180" : ""
            )}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isExpanded ? "max-h-[1000px] p-4" : "max-h-0"
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)

ExpandableCard.displayName = "ExpandableCard"

export { ExpandableCard }

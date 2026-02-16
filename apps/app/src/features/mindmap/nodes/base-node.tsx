import React from "react";
import { cn } from "@/utils";

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm p-5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
      className,
      selected ? "border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.15)]" : "",
      "hover:ring-1",
    )}
    {...props}
  />
));
BaseNode.displayName = "BaseNode";

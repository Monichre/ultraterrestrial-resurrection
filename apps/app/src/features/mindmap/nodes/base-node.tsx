import React from "react";
import { cn } from "@/utils";

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border border-gray-200 bg-white p-5 text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className,
      selected ? "border-gray-500 shadow-lg dark:border-gray-400" : "",
      "hover:ring-1",
    )}
    {...props}
  />
));
BaseNode.displayName = "BaseNode";

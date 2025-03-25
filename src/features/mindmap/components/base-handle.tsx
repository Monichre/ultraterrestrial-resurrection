import { forwardRef } from "react";
import { Handle, HandleProps } from "@xyflow/react";

import { cn } from "@/utils";

export type BaseHandleProps = HandleProps;

export const BaseHandle = forwardRef<HTMLDivElement, BaseHandleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Handle
        ref={ref}
        {...props}
        className={cn(
          "h-[11px] w-[11px] rounded-full border border-gray-200 border-slate-300 bg-slate-100 transition dark:border-gray-100 dark:bg-gray-100 dark:border-gray-800 dark:dark:border-gray-800 dark:dark:bg-gray-800",
          className,
        )}
        {...props}
      >
        {children}
      </Handle>
    );
  },
);

BaseHandle.displayName = "BaseHandle";

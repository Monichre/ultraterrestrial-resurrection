// ./src/components/ui/card/grid-layout.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: number;
  minChildWidth?: number;
  className?: string;
  animate?: boolean;
}

const GridLayout = React.forwardRef<HTMLDivElement, GridLayoutProps>(
  ({ children, gap = 4, minChildWidth = 300, className, animate = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid auto-rows-[minmax(0,auto)]",
          className
        )}
        style={{
          gap: `${gap * 4}px`,
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minChildWidth}px), 1fr))`
        }}
        {...props}
      >
        {React.Children.map(children, (child, index) => 
          animate ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {child}
            </motion.div>
          ) : (
            child
          )
        )}
      </div>
    );
  }
);

GridLayout.displayName = "GridLayout";

export { GridLayout };
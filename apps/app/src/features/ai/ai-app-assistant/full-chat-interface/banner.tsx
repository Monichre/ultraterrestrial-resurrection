"use client";

import { RiCloseLine } from "@remixicon/react";
import { useState } from "react";

export function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="ps-3 pe-1.5 py-1 rounded-md bg-foreground text-background fixed bottom-8 right-8 z-9999 shadow-lg">
      <div className="flex items-center justify-between gap-0.5">
        <a
          href="https://crafted.is"
          target="_blank"
          className="block text-xs font-medium"
        >
          Made by Crafted
        </a>
        <button
          className="group focus-visible:border-ring focus-visible:ring-ring/50 flex size-7 items-center justify-center rounded transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none"
          onClick={() => setIsVisible(false)}
        >
          <RiCloseLine
            className="opacity-50 transition-opacity group-hover:opacity-80"
            size={18}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

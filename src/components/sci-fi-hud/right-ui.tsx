"use client"

import { Activity } from "lucide-react"
import { ChevronRightIcon } from "@radix-ui/react-icons"

interface RightUIProps {
  selectedTab: number
  setSelectedTab: (index: number) => void
}

export function RightUI({ selectedTab, setSelectedTab }: RightUIProps) {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col justify-between p-4">
      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 ${
              selectedTab === index ? "bg-cyan-500 text-black" : "text-cyan-500 hover:bg-cyan-500/20"
            }`}
          >
            <ChevronRightIcon className={`w-4 h-4 ${selectedTab === index ? "" : `opacity-${100 - index * 30}`}`} />
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <Activity className="w-4 h-4 text-cyan-500" />
      </div>
    </div>
  )
}


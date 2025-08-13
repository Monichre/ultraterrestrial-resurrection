"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SunMoon, Plus, Sparkles, MousePointerClick, X } from "lucide-react"
import { NodeDropdown } from "./NodeDropdown"
import { ModelDropdown } from "./ModelDropdown"
import { useReactFlow } from "@/contexts/ReactFlowContext"
import { Badge } from "@/components/ui/badge"

const iconClass = "w-4 h-4 text-[#adf0dd]"

const nodeTypeColors: { [key: string]: string } = {
  default: "#777",
  event: "#ff69b4",
  keyFigure: "#00ffff",
  organization: "#ffa500",
  caseFile: "#90ee90",
  artifact: "#add8e6",
  testimony: "#f0e68c",
  topic: "#e6e6fa",
}

export function DynamicToolbar() {
  const [clickedButton, setClickedButton] = useState<string | null>(null)
  const [isNodeDropdownOpen, setIsNodeDropdownOpen] = useState(false)
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const nodeDropdownRef = useRef<HTMLDivElement>(null)
  const modelDropdownRef = useRef<HTMLDivElement>(null)

  const { selectedNodes, clearSelectedNodes, deselectNode } = useReactFlow()

  const options = ["Topics", "Events", "Key Figures", "Testimonies", "Organizations", "Case Files", "Artifacts"]
  const [selectedOption, setSelectedOption] = useState("Model")

  const handleButtonClick = (buttonName: string) => {
    if (buttonName === "Plus") {
      setIsNodeDropdownOpen((prev) => !prev)
    } else if (buttonName === "Dropdown") {
      setIsModelDropdownOpen((prev) => !prev)
    } else {
      setClickedButton(buttonName)
      setTimeout(() => setClickedButton(null), 1000)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (nodeDropdownRef.current && !nodeDropdownRef.current.contains(event.target as Node)) {
        setIsNodeDropdownOpen(false)
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-neutral-950 bg-gradient-to-b from-black/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-lg h-fit relative">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-600 font-medium rounded-md text-xs">
        <AnimatePresence>
          {clickedButton && (
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div>{clickedButton} clicked</div>
              <div className="relative w-24 h-0.5 bg-slate-200 mt-1">
                <motion.div
                  className="absolute left-0 h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("Theme toggle")} className="h-10 w-10">
          <SunMoon className={iconClass} />
        </Button>
        <div className="h-px w-6 bg-zinc-200 dark:bg-zinc-800" />
        <div className="relative" ref={nodeDropdownRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleButtonClick("Plus")}
            className={cn("h-10 w-10", isNodeDropdownOpen && "bg-zinc-800")}
          >
            <Plus className={iconClass} />
            {selectedNodes.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#adf0dd] text-[10px] font-medium text-black">
                {selectedNodes.length}
              </span>
            )}
          </Button>
          <NodeDropdown isOpen={isNodeDropdownOpen} onClose={() => setIsNodeDropdownOpen(false)} />
        </div>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("Sparkles")} className="h-10 w-10">
          <Sparkles className={iconClass} />
        </Button>
        <div className="relative" ref={modelDropdownRef}>
          <Button
            variant="ghost"
            onClick={() => handleButtonClick("Dropdown")}
            className={cn("h-10 w-10 relative group", isModelDropdownOpen && "bg-zinc-800")}
          >
            <div className="relative flex items-center justify-center">
              <MousePointerClick className={iconClass} />
              <span className="absolute -bottom-5 text-[10px] font-medium text-zinc-400">{selectedOption}</span>
            </div>
          </Button>
          <ModelDropdown
            isOpen={isModelDropdownOpen}
            onClose={() => setIsModelDropdownOpen(false)}
            options={options}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
          />
        </div>
        <div className="h-px w-6 bg-zinc-900 text-zinc-100" />
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("User")} className="h-10 w-10 p-0">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
          >
            <path
              opacity=".05"
              d="M6.78296 13.376C8.73904 9.95284 8.73904 5.04719 6.78296 1.62405L7.21708 1.37598C9.261 4.95283 9.261 10.0472 7.21708 13.624L6.78296 13.376Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              opacity=".1"
              d="M7.28204 13.4775C9.23929 9.99523 9.23929 5.00475 7.28204 1.52248L7.71791 1.2775C9.76067 4.9119 9.76067 10.0881 7.71791 13.7225L7.28204 13.4775Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              opacity=".15"
              d="M7.82098 13.5064C9.72502 9.99523 9.72636 5.01411 7.82492 1.50084L8.26465 1.26285C10.2465 4.92466 10.2451 10.085 8.26052 13.7448L7.82098 13.5064Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              opacity=".2"
              d="M8.41284 13.429C10.1952 9.92842 10.1957 5.07537 8.41435 1.57402L8.85999 1.34729C10.7139 4.99113 10.7133 10.0128 8.85841 13.6559L8.41284 13.429Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              opacity=".25"
              d="M9.02441 13.2956C10.6567 9.8379 10.6586 5.17715 9.03005 1.71656L9.48245 1.50366C11.1745 5.09919 11.1726 9.91629 9.47657 13.5091L9.02441 13.2956Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              opacity=".3"
              d="M9.66809 13.0655C11.1097 9.69572 11.1107 5.3121 9.67088 1.94095L10.1307 1.74457C11.6241 5.24121 11.6231 9.76683 10.1278 13.2622L9.66809 13.0655Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              opacity=".35"
              d="M10.331 12.7456C11.5551 9.52073 11.5564 5.49103 10.3347 2.26444L10.8024 2.0874C12.0672 5.42815 12.0659 9.58394 10.7985 12.9231L10.331 12.7456Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              opacity=".4"
              d="M11.0155 12.2986C11.9938 9.29744 11.9948 5.71296 11.0184 2.71067L11.4939 2.55603C12.503 5.6589 12.502 9.35178 11.4909 12.4535L11.0155 12.2986Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              opacity=".45"
              d="M11.7214 11.668C12.4254 9.01303 12.4262 5.99691 11.7237 3.34116L12.2071 3.21329C12.9318 5.95292 12.931 9.05728 12.2047 11.7961L11.7214 11.668Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
            <path
              d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704Z"
              fill="#adf0dd"
              fillRule="evenodd"
              clipRule="evenodd"
              pathLength="1"
              strokeDashoffset="0px"
              strokeDasharray="1px 1px"
            ></path>
          </svg>
        </Button>
      </div>

      {/* Selected Nodes Display */}
      <AnimatePresence>
        {selectedNodes.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 pt-2 border-t border-zinc-800 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-zinc-400">Selected Nodes</h4>
              <button onClick={clearSelectedNodes} className="text-xs text-[#adf0dd] hover:underline">
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {selectedNodes.map((node) => (
                <Badge
                  key={node.id}
                  variant="outline"
                  className="bg-zinc-800 text-zinc-100 border-zinc-700 flex items-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: nodeTypeColors[node.type] }} />
                  <span className="text-xs truncate max-w-[100px]">{node.data.label}</span>
                  <button onClick={() => deselectNode(node.id)} className="ml-1 text-zinc-400 hover:text-zinc-100">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

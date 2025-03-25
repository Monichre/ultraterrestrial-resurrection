"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, Clock, Copy, Plus, Settings, Sparkles } from 'lucide-react'
import { useState } from "react"

interface Task {
  id: string
  content: string
  status: "pending" | "in_progress" | "done"
}

export function Oracle( { modelActions, activeModel, modelActionMap }: { modelActions: any, activeModel: string, modelActionMap: any } ) {
  const [isExpanded, setIsExpanded] = useState( false )
  const [goal] = useState( "Research Cliff High and web bots" )


  return (
    <div className="p-4 flex flex-col w-[500px]">
      <div className="flex-1" />

      <div className="relative">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden absolute bottom-full w-full mb-2"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-xl">
                <div className="p-4 space-y-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-zinc-400">Goal:</div>
                    <div className="p-3 bg-zinc-100/80 rounded-lg text-sm text-zinc-600">
                      {goal}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {tasks.map( ( task ) => (
                      <div
                        key={task.id}
                        className="group flex items-center gap-3 p-3 bg-zinc-100/50 rounded-lg text-sm"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 flex items-center justify-center">
                            {task.status === "in_progress" ? (
                              <Sparkles className="w-4 h-4 text-blue-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-zinc-300" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 text-zinc-600">{task.content}</div>
                        <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-4 h-4 text-zinc-400" />
                        </button>
                      </div>
                    ) )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-1">
                      <span>Review this recipe</span>
                    </div>
                    <button className="flex items-center gap-1 hover:text-zinc-600">
                      <span>Share to Community</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-50">
                      <Plus className="w-4 h-4 text-zinc-400" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-600">
                        Cancel
                      </button>
                      <button className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800">
                        Confirm & Run
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-zinc-900 text-white">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">Conduct an online search to gather...</div>
                    <div className="text-xs text-zinc-400">Oracle is using tools to complete sub-tasks.</div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-blue-400 animate-spin" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Oracle Mode toggle button */}
        <div className="mb-2">
          <button
            onClick={() => setIsExpanded( !isExpanded )}
            className="flex items-center gap-2 group"
          >
            <div className="cursor-pointer hover:shadow-sm hover:shadow-indigo-500/50 hover:ring-indigo-500/50 group/tab mb-1 relative flex w-fit items-center gap-3 rounded-xl bg-neutral-100 px-2 py-1 text-xs ring-1 ring-neutral-200 duration-200 dark:bg-neutral-800 dark:ring-neutral-700">
              <Settings className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Oracle Mode</span>
            </div>

          </button>
        </div>
        {/* bg-neutral-800  */}
        {/* Reference other node content - always visible */}
        <div className=" rounded-xl p-3 border border-transparent flex gap-2 items-center relative w-full p-2 px-2.5 duration-200 border border-white/80 border-neutral-700/80 text-neutral-500 bg-neutral-950 bg-gradient-to-b from-black/90">

          <div className=" flex items-center gap-2 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full  flex items-center justify-center">
              <span className="text-zinc-400">/</span>
            </div>
            <input
              type="text"
              className="bg-transparent text-zinc-200 text-sm focus:outline-none flex-1"
              placeholder="Type to reference..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
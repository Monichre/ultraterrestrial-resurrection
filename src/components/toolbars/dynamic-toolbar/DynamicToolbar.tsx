"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils"
import { ChevronLeftIcon, Cross2Icon, MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons"
import { AnimatePresence, motion } from "framer-motion"
import { MousePointerClick, Sparkles, SunMoon } from "lucide-react"
import { useState } from "react"

export function DynamicToolbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState( false )
  const [searchValue, setSearchValue] = useState( "" )
  const [isSearchFocused, setIsSearchFocused] = useState( true )
  const [clickedButton, setClickedButton] = useState<string | null>( null )

  const handleButtonClick = ( buttonName: string ) => {
    setClickedButton( buttonName )
    setTimeout( () => setClickedButton( null ), 1000 )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-lg w-fit relative dark:border-gray-800">
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
      <div className="flex items-center gap-2 h-10">
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick( "Theme toggle" )} className="h-10 w-10">
          <SunMoon className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick( "Plus" )} className="h-10 w-10">
          <PlusIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick( "Sparkles" )} className="h-10 w-10">
          <Sparkles className="w-4 h-4" />
        </Button>
        <div className="relative flex items-center">
          <AnimatePresence mode="wait">
            {isSearchExpanded ? (
              <motion.div
                key="expanded"
                initial={{ width: 40, opacity: 0.8 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{
                  width: { type: "spring", stiffness: 400, damping: 25, mass: 0.5 },
                  opacity: { duration: 0.2 },
                }}
                className="flex items-center gap-2 rounded-xl px-3 h-10 bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
              >
                <MagnifyingGlassIcon className={cn( "w-4 h-4", isSearchFocused && "text-[#0C8CE9] dark:text-blue-400" )} />
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="relative flex items-center"
                >
                  <Input
                    type="search"
                    value={searchValue}
                    placeholder="Try to close me"
                    className="w-[200px] h-7 px-0 bg-transparent border-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                    onChange={( e ) => setSearchValue( e.target.value )}
                    onFocus={() => setIsSearchFocused( true )}
                    onBlur={() => setIsSearchFocused( false )}
                  />
                  {isSearchFocused && searchValue.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchValue( "" )}
                      className="absolute right-0 h-7 w-7 p-0"
                    >
                      <Cross2Icon className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchExpanded( false )} className="h-7 w-7 p-0">
                  <ChevronLeftIcon className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                initial={{ width: "auto", opacity: 0.8 }}
                animate={{ width: 40, opacity: 1 }}
                exit={{ width: "auto", opacity: 0 }}
                transition={{
                  width: { type: "spring", stiffness: 400, damping: 25, mass: 0.5 },
                  opacity: { duration: 0.2 },
                }}
                onClick={() => setIsSearchExpanded( true )}
                className="h-10 w-10 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
              >
                <MagnifyingGlassIcon
                  className={cn(
                    "w-4 h-4",
                    isSearchFocused ? "text-zinc-900 dark:text-zinc-100" : "text-[#0C8CE9] dark:text-blue-400",
                  )}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <Button variant="ghost" onClick={() => handleButtonClick( "MousePointerClick" )} className="h-10 w-10 md:w-20">
          <div className="relative flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hidden md:block">Click!</span>
            <MousePointerClick className="w-4 h-4" />
          </div>
        </Button>
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick( "User" )} className="h-10 w-10 p-0">
          <Avatar className="w-6 h-6">
            <img
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
              alt="User"
              className="rounded-full min-w-[24px] min-h-[24px] w-6 h-6"
            />
          </Avatar>
        </Button>
      </div>
    </div>
  )
}


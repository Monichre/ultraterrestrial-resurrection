// import { Textarea } from "@/components/ui/Textarea"
// import { useAutoResizeTextarea, useClickOutside } from "@/hooks"
// import { cn } from "@/utils"
// import { Command } from "cmdk"
// import { AnimatePresence, motion } from "framer-motion"
// import { MessageSquare, Search, SendHorizontal, Wand2 } from "lucide-react"
// import { useCallback, useEffect, useRef, useState } from "react"

// const MIN_HEIGHT = 56

// const COMMANDS = [
//   {
//     id: "chat",
//     label: "Chat",
//     description: "Start a conversation",
//     icon: MessageSquare,
//     prefix: "/chat",
//   },
//   {
//     id: "generate",
//     label: "Generate",
//     description: "Generate code or content",
//     icon: Wand2,
//     prefix: "/generate",
//   },
//   {
//     id: "analyze",
//     label: "Analyze",
//     description: "Analyze code or text",
//     icon: Search,
//     prefix: "/analyze",
//   },
// ]

// interface AIInputProps {
//   onSubmit?: ( value: string, command?: string ) => void
//   disabled?: boolean
// }

// export function EnhancedAIInput( { onSubmit, disabled }: AIInputProps ) {
//   const [isOpen, setIsOpen] = useState( false )
//   const [activeCommand, setActiveCommand] = useState<string | null>( null )
//   const containerRef = useRef<HTMLDivElement>( null )
//   const [inputValue, setInputValue] = useState( "" )
//   const [isSubmitted, setIsSubmitted] = useState( false )
//   const [isAnimating, setIsAnimating] = useState( true )

//   const { textareaRef, adjustHeight } = useAutoResizeTextarea( {
//     minHeight: MIN_HEIGHT,
//     maxHeight: 200,
//   } )

//   useClickOutside( containerRef, () => {
//     if ( isOpen ) setIsOpen( false )
//   } )

//   useEffect( () => {
//     let timeoutId: NodeJS.Timeout

//     const runAnimation = () => {
//       if ( !isAnimating || !isSubmitted ) return

//       timeoutId = setTimeout( () => {
//         setIsSubmitted( false )
//         if ( isAnimating ) {
//           timeoutId = setTimeout( runAnimation, 1000 )
//         }
//       }, 3000 )
//     }

//     if ( isAnimating && isSubmitted ) {
//       runAnimation()
//     }

//     return () => clearTimeout( timeoutId )
//   }, [isAnimating, isSubmitted] )

//   const handleSubmit = () => {
//     if ( disabled || ( !inputValue.trim() && !activeCommand ) ) return

//     setIsSubmitted( true )
//     onSubmit?.( inputValue, activeCommand || undefined )
//     setInputValue( "" )
//     setActiveCommand( null )
//   }

//   const handleKeyDown = useCallback(
//     ( e: React.KeyboardEvent ) => {
//       if ( e.key === "Enter" && !e.shiftKey ) {
//         e.preventDefault()
//         handleSubmit()
//       }

//       if ( e.key === "Backspace" && inputValue === "" && activeCommand ) {
//         setActiveCommand( null )
//       }

//       if ( e.key === "/" && !activeCommand && !isOpen ) {
//         setIsOpen( true )
//       }
//     },
//     [activeCommand, inputValue, isOpen, disabled, onSubmit]
//   )

//   const handleCommandSelect = ( commandId: string ) => {
//     const command = COMMANDS.find( ( cmd ) => cmd.id === commandId )
//     if ( command ) {
//       setInputValue( "" )
//       setActiveCommand( commandId )
//       setIsOpen( false )
//       textareaRef.current?.focus()
//     }
//   }

//   return (
//     <div className="w-full py-4">
//       <div className="relative max-w-xl w-full mx-auto" ref={containerRef}>
//         <div className="relative rounded-lg bg-black/5 dark:bg-white/5">
//           <div className="flex items-start gap-2 px-3 min-h-[56px] py-2">
//             {activeCommand && (
//               <div className="flex items-center gap-2 text-sm bg-black/10 dark:bg-white/10 px-2 py-1 rounded-md mt-1">
//                 {( () => {
//                   const activeCmd = COMMANDS.find( ( cmd ) => cmd.id === activeCommand )
//                   if ( !activeCmd ) return null
//                   return (
//                     <span className="flex items-center gap-1.5 flex-shrink-0">
//                       <activeCmd.icon className="w-4 h-4 text-black/50 dark:text-white/50" />
//                       <span className="text-black/70 dark:text-white/70">
//                         {activeCmd.label}
//                       </span>
//                     </span>
//                   )
//                 } )()}
//               </div>
//             )}

//             <div className="flex-1 relative">
//               <Textarea
//                 ref={textareaRef}
//                 value={inputValue}
//                 onChange={( e ) => {
//                   setInputValue( e.target.value )
//                   adjustHeight()
//                 }}
//                 onKeyDown={handleKeyDown}
//                 onFocus={() => !activeCommand && inputValue === "/" && setIsOpen( true )}
//                 placeholder={activeCommand ? "Type your message..." : "Type / for commands..."}
//                 className="w-full bg-transparent border-none resize-none text-black dark:text-white placeholder:text-black/60 dark:placeholder:text-white/60 p-0 focus-visible:ring-0"
//                 disabled={disabled || isSubmitted}
//               />

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={disabled || isSubmitted}
//                 className={cn(
//                   "absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors",
//                   ( inputValue || activeCommand ) && !disabled
//                     ? "bg-sky-500/15 text-sky-500 hover:bg-sky-500/20"
//                     : "text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70"
//                 )}
//               >
//                 {isSubmitted ? (
//                   <div className="w-4 h-4 bg-sky-500 rounded-sm animate-spin"
//                     style={{ animationDuration: "3s" }} />
//                 ) : (
//                   <SendHorizontal className="w-4 h-4" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <AnimatePresence>
//           {isOpen && !activeCommand && (
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 8 }}
//               transition={{ duration: 0.15 }}
//               className="absolute w-full mt-2 rounded-lg bg-black/5 dark:bg-white/5 shadow-lg overflow-hidden"
//             >
//               <Command className="w-full">
//                 <Command.List className="py-2">
//                   {COMMANDS.map( ( command ) => (
//                     <Command.Item
//                       key={command.id}
//                       onSelect={() => handleCommandSelect( command.id )}
//                       className="px-3 py-2.5 flex items-center gap-3 text-sm hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer group"
//                     >
//                       <command.icon className="w-4 h-4 text-black/50 dark:text-white/50 group-hover:text-black/70 dark:group-hover:text-white/70" />
//                       <div className="flex flex-col">
//                         <span className="font-medium text-black/70 dark:text-white/70">
//                           {command.label}
//                         </span>
//                         <span className="text-xs text-black/50 dark:text-white/50">
//                           {command.description}
//                         </span>
//                       </div>
//                       <span className="ml-auto text-xs text-black/30 dark:text-white/30">
//                         {command.prefix}
//                       </span>
//                     </Command.Item>
//                   ) )}
//                 </Command.List>
//               </Command>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <p className="text-center h-4 text-xs text-black/70 dark:text-white/70 mt-2">
//         {isSubmitted ? "AI is thinking..." : "Ready to submit!"}
//       </p>
//     </div>
//   )
// }
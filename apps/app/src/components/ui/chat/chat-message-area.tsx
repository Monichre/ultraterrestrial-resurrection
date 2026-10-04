import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/chat/scroll-area"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { cn } from "@/utils"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import type { ReactNode } from "react"

type ScrollButtonAlignment = "left" | "center" | "right"

interface ScrollButtonProps {
	onClick: () => void
	alignment?: ScrollButtonAlignment
	className?: string
}

export function ScrollButton( {
	onClick,
	alignment = "right",
	className,
}: ScrollButtonProps ) {
	const alignmentClasses = {
		left: "left-4",
		center: "left-1/2 -translate-x-1/2",
		right: "right-4",
	}

	return (
		<Button
			variant="secondary"
			size="icon"
			className={cn(
				"absolute bottom-4 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800",
				alignmentClasses[alignment],
				className,
			)}
			onClick={onClick}
		>
			<ChevronDownIcon className="h-4 w-4" />
		</Button>
	)
}

interface ChatMessageAreaProps {
	children: ReactNode
	className?: string
	scrollButtonAlignment?: ScrollButtonAlignment
}

export function ChatMessageArea( {
	children,
	className,
	scrollButtonAlignment = "right",
}: ChatMessageAreaProps ) {
	const [containerRef, showScrollButton, scrollToBottom] =
		useScrollToBottom<HTMLDivElement>()

	return (
		<ScrollArea className="flex-1 relative">
			<div ref={containerRef}>
				<div className={cn( className, "min-h-0" )}>{children}</div>
			</div>
			{showScrollButton && (
				<ScrollButton
					onClick={scrollToBottom}
					alignment={scrollButtonAlignment}
					className="absolute bottom-4 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800"
				/>
			)}
		</ScrollArea>
	)
}

ChatMessageArea.displayName = "ChatMessageArea"

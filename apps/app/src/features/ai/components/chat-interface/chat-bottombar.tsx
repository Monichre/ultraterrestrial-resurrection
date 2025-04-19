"use  client";
import {
	FileImage,
	Mic,
	Paperclip,
	PlusCircle,
	SendHorizontal,
	ThumbsUp,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/features/mindmap/components/note/ui/Textarea";
import { cn } from "@/utils";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";

interface ChatBottombarProps {
	sendMessage: (newMessage: any) => void;
	isMobile: boolean;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export function ChatBottombar({ sendMessage, isMobile }: ChatBottombarProps) {
	// const { userId, sessionId, isLoaded }: any = useAuth()
	const user: any = useUser();
	const [message, setMessage] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(event.target.value);
	};

	const handleThumbsUp = () => {
		const newMessage: any = {
			name: user?.name,

			content: "👍",
		};
		sendMessage(newMessage);
		setMessage("");
	};

	const handleSend = () => {
		if (message.trim()) {
			const newMessage: any = {
				name: user?.name,

				content: message.trim(),
			};
			sendMessage(newMessage);
			setMessage("");

			if (inputRef.current) {
				inputRef.current.focus();
			}
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}

		if (event.key === "Enter" && event.shiftKey) {
			event.preventDefault();
			setMessage((prev) => prev + "\n");
		}
	};

	return (
		<div className="p-2 flex justify-between w-full items-center gap-2">
			<div className="flex">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className={cn(
								"h-9 w-9",
								"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
							)}
						>
							<PlusCircle size={20} className="text-muted-foreground" />
						</Button>
					</PopoverTrigger>
					<PopoverContent side="top" className="w-full p-2">
						{message.trim() || isMobile ? (
							<div className="flex gap-2">
								<Button
									variant="ghost"
									className={cn(
										"h-9 w-9",
										"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
									)}
								>
									<Mic size={20} className="text-muted-foreground" />
								</Button>
								{BottombarIcons.map((icon, index) => (
									<Button
										key={index}
										variant="ghost"
										className={cn(
											"h-9 w-9",
											"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
										)}
									>
										<icon.icon size={20} className="text-muted-foreground" />
									</Button>
								))}
							</div>
						) : (
							<Button
								variant="ghost"
								className={cn(
									"h-9 w-9",
									"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
								)}
							>
								<Mic size={20} className="text-muted-foreground" />
							</Button>
						)}
					</PopoverContent>
				</Popover>
				{!message.trim() && !isMobile && (
					<div className="flex">
						{BottombarIcons.map((icon, index) => (
							<Button
								key={index}
								variant="ghost"
								className={cn(
									"h-9 w-9",
									"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
								)}
							>
								<icon.icon size={20} className="text-muted-foreground" />
							</Button>
						))}
					</div>
				)}
			</div>

			<AnimatePresence initial={false}>
				<motion.div
					key="input"
					className="w-full relative"
					layout
					initial={{ opacity: 0, scale: 1 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 1 }}
					transition={{
						opacity: { duration: 0.05 },
						layout: {
							type: "spring",
							bounce: 0.15,
						},
					}}
				>
					<Textarea
						autoComplete="off"
						value={message}
						ref={inputRef}
						onKeyDown={handleKeyPress}
						onChange={handleInputChange}
						name="message"
						placeholder="Aa"
						className=" w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
					></Textarea>
				</motion.div>

				{message.trim() ? (
					<Button
						variant="ghost"
						className={cn(
							"h-9 w-9",
							"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0",
						)}
						onClick={handleSend}
					>
						<SendHorizontal size={20} className="text-muted-foreground" />
					</Button>
				) : (
					<Button
						variant="ghost"
						className={cn(
							"h-9 w-9",
							"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0",
						)}
						onClick={handleThumbsUp}
					>
						<ThumbsUp size={20} className="text-muted-foreground" />
					</Button>
				)}
			</AnimatePresence>
		</div>
	);
}

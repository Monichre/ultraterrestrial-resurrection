"use client";

// import type { AI, UIState } from '@/app/actions'
import { useAIState, useActions, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { type SetStateAction, useEffect, useRef, useState } from "react";

import { ArrowRight, Plus } from "lucide-react";

import type { AI } from "@/app/actions/assistant/actions";
import { Button } from "@/components/ui/button";
import { usePromptState } from "@/features/ai/components/hooks/usePromptState";
import { UserPromptMessage } from "@/features/ai/components/prompts/UserPromptMessage";
import { Textarea } from "@/features/mindmap/components/note/ui/Textarea";
import { generateId } from "ai";

interface ChatPanelProps {
	messages: any;
	query?: string;
}

export function PromptPanel({ messages, query }: ChatPanelProps) {
	const [input, setInput] = useState("");
	const [showEmptyScreen, setShowEmptyScreen] = useState(false);
	const [, setMessages] = useUIState<typeof AI>();
	const [aiMessage, setAIMessage] = useAIState<typeof AI>();
	const { loading } = usePromptState();
	const { submit } = useActions();
	const router = useRouter();
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const isFirstRender = useRef(true); // For development environment

	async function handleQuerySubmit(query: string, formData?: FormData) {
		setInput(query);

		// Add user message to UI state
		setMessages((currentMessages: any) => [
			...currentMessages,
			{
				id: generateId(),
				component: <UserPromptMessage message={query} />,
			},
		]);

		// Submit and get response message
		const data = formData || new FormData();
		if (!formData) {
			data.append("input", query);
		}
		const responseMessage = await submit(data);
		setMessages((currentMessages: any) => [
			...currentMessages,
			responseMessage,
		]);
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		await handleQuerySubmit(input, formData);
	};

	// if query is not empty, submit the query
	useEffect(() => {
		if (isFirstRender.current && query && query.trim().length > 0) {
			handleQuerySubmit(query);
			isFirstRender.current = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	useEffect(() => {
		const lastMessage = aiMessage.messages.slice(-1)[0];
		if (lastMessage?.type === "followup" || lastMessage?.type === "inquiry") {
			// setIsGenerating(false)
		}
	}, [aiMessage]);

	// Clear messages
	const handleClear = () => {
		// setIsGenerating(false)
		setMessages([]);
		setAIMessage({ messages: [], chatId: "" });
		setInput("");
		router.push("/");
	};

	useEffect(() => {
		// focus on input when the page loads
		inputRef.current?.focus();
	}, []);

	// If there are messages and the new button has not been pressed, display the new Button
	if (messages.length > 0) {
		return (
			<div className="fixed bottom-2 md:bottom-8 left-0 right-0 flex justify-center items-center mx-auto pointer-events-none">
				<Button
					type="button"
					variant={"secondary"}
					className="rounded-full bg-secondary/80 group transition-all hover:scale-105 pointer-events-auto"
					onClick={() => handleClear()}
				>
					<span className="text-sm mr-2 group-hover:block hidden animate-in fade-in duration-300">
						New
					</span>
					<Plus size={18} className="group-hover:rotate-90 transition-all" />
				</Button>
			</div>
		);
	}

	if (query && query.trim().length > 0) {
		return null;
	}

	return (
		<div
			className={
				"fixed bottom-8 left-0 right-0 top-10 mx-auto h-screen flex flex-col items-center justify-center"
			}
		>
			<form onSubmit={handleSubmit} className="max-w-2xl w-full px-6">
				<div className="relative flex items-center w-full">
					<Textarea
						ref={inputRef}
						name="input"
						rows={1}
						maxRows={5}
						tabIndex={0}
						placeholder="Ask a question..."
						spellCheck={false}
						value={input}
						className="resize-none w-full min-h-12 rounded-fill bg-muted border border-input pl-4 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'"
						// @ts-ignore
						onChange={(e: {
							target: { value: any[] | SetStateAction<string> };
						}) => {
							// @ts-ignore
							setInput(e.target.value);
							setShowEmptyScreen(e.target.value.length === 0);
						}}
						// @ts-ignore
						onKeyDown={(e: {
							key: string;
							shiftKey: any;
							nativeEvent: { isComposing: any };
							preventDefault: () => void;
							target: HTMLTextAreaElement;
						}) => {
							// Enter should submit the form
							if (
								e.key === "Enter" &&
								!e.shiftKey &&
								!e.nativeEvent.isComposing
							) {
								// Prevent the default action to avoid adding a new line
								if (input.trim().length === 0) {
									e.preventDefault();
									return;
								}
								e.preventDefault();
								const textarea = e.target as HTMLTextAreaElement;
								textarea.form?.requestSubmit();
							}
						}}
						onHeightChange={(height: number) => {
							// Ensure inputRef.current is defined
							if (!inputRef.current) return;

							// The initial height and left padding is 70px and 2rem
							const initialHeight = 70;
							// The initial border radius is 32px
							const initialBorder = 32;
							// The height is incremented by multiples of 20px
							const multiple = (height - initialHeight) / 20;

							// Decrease the border radius by 4px for each 20px height increase
							const newBorder = initialBorder - 4 * multiple;
							// The lowest border radius will be 8px
							inputRef.current.style.borderRadius =
								Math.max(8, newBorder) + "px";
						}}
						onFocus={() => setShowEmptyScreen(true)}
						onBlur={() => setShowEmptyScreen(false)}
					/>
					<Button
						type="submit"
						size={"icon"}
						variant={"ghost"}
						className="absolute right-2 top-1/2 transform -translate-y-1/2"
						disabled={input.length === 0}
					>
						<ArrowRight size={20} />
					</Button>
				</div>
			</form>
		</div>
	);
}

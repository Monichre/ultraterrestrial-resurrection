"use client";

import {
	CoreNodeBottom,
	CoreNodeContainer,
	CoreNodeContent,
	CoreNodeTop,
} from "@/features/mindmap/nodes/core-node-ui";

import { useUser } from "@clerk/nextjs";
import { Handle, Position } from "@xyflow/react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { wait } from "@/utils";

import { AnimatedBeam } from "@/components/animated";
import { AiStarIcon } from "@/components/icons";
import { AddNote } from "@/components/note/AddNote";
import { useMindMap } from "@/contexts/mindmap";
import { MemoizedMarkdown } from "@/features/ai";
import { WorldMap } from "@/features/data-viz/components/world-map/world-map";
import { AskAI } from "@/features/mindmap/components/ask-ai";
import { useGroupNode } from "@/features/mindmap/hooks/useGroupNode";
import { Anchor } from "@/features/mindmap/nodes/user-input-node/anchor";
import { useEntity } from "@/hooks";
import type { NodeProps } from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";

const EventRecordsContent = memo(({ data }: any) => {
	const { entities, type, input } = data;

	const dots =
		entities && entities.length > 0
			? entities.map((entity: any) => ({
					start: { lat: entity.data.latitude, lng: entity.data.longitude },
					end: { lat: entity.data.latitude, lng: entity.data.longitude },
				}))
			: [];

	return (
		<div className="w-full h-full">
			<WorldMap dots={dots} />
		</div>
	);
});

export const UserInputNode = memo((props: NodeProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
	const nodeRef = useRef<HTMLDivElement>(null);
	const [prompt, setPrompt] = useState(null);
	// @ts-ignore
	const { handles, node }: any = useGroupNode({ node: { ...props } });
	const [analysis, setAnalysis] = useState<any>(null);
	const updateAnalysis = useCallback((analysis: any) => {
		setAnalysis(analysis);
	}, []);

	const [showAskAI, setShowAskAI] = useState(false);
	const toggleShowAskAI = () => {
		setShowAskAI(!showAskAI);
	};
	const { saveNote, updateNote, userNote, findConnections } = useEntity({
		card: node,
	});
	const { deleteElements } = useMindMap();
	const handleDelete = () => {
		deleteElements([node.id]);
	};

	const { user } = useUser();
	const [showAnchor, setShowAnchor] = useState(false);

	useEffect(() => {
		wait(0.5).then(() => setShowAnchor(true));
	}, []);

	const askQuestion = ({ entities, input, type }: any) => {
		const names = entities.join(", ");
		console.log("🚀 ~ askQuestion ~ names:", names);
		return `Given the following ${type}s: ${names}, what are some related data points and related avenues worth exploring in regard to their story in its own right and their role in the state of disclosure as we know it??`;
	};

	return (
		<motion.div
			ref={containerRef}
			className="relative flex flex-col items-center align-center justify-center w-full"
		>
			<AnimatePresence>
				{showAnchor && (
					<>
						<motion.div className="mb-[35px] w-full flex justify-center">
							<Anchor className="" ref={anchorRef} />
						</motion.div>
						<AnimatedBeam
							className="w-full"
							containerRef={containerRef}
							fromRef={anchorRef}
							toRef={nodeRef}
							duration={3}
						/>
					</>
				)}
			</AnimatePresence>

			<CoreNodeContainer
				id={props.id}
				className="motion-opacity-in-0"
				ref={nodeRef}
			>
				<CoreNodeTop>
					<div className="flex justify-between w-content align-center items-center ml-auto">
						{/* <Button variant='outline' onClick={findConnections} className=' flex items-center px-4 py-2 font-semibold text-zinc-900 dark:text-white dark:bg-black  hover:border-indigo-800 mx-1'>
              <GroupIcon stroke={'#fff'} className='w-6 h-6 stroke-1' />
            </Button>
            <AddNote saveNote={saveNote} userNote={userNote} updateNote={updateNote} /> */}
						{/* <Button variant='outline' onClick={handleDelete} className=' flex items-center px-4 py-2 font-semibold text-zinc-900 dark:text-white bg-black  hover:border-indigo-800 mx-1'>
              <XIcon stroke={'#fff'} className='w-6 h-6 stroke-1' />
            </Button> */}
					</div>
				</CoreNodeTop>
				<CoreNodeContent className="min-h-[100xp] w-full">
					<div className="py-2">
						<p className="text-sm text-white font-source-sans">
							{props.data.input || ""}
						</p>
					</div>
					{props.data.type === "events" && (
						<EventRecordsContent data={props.data} />
					)}

					<AnimatePresence>
						{analysis && analysis.text && (
							<motion.div className="w-full" key="wrapper">
								<MemoizedMarkdown
									rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
									remarkPlugins={[remarkGfm]}
									className="prose-sm prose-neutral prose-a:text-accent-foreground/50 transition-all duration-300 will-change-transform line-clamp-3 hover:line-clamp-none"
									components={{
										// Map `h1` (`# heading`) to use `h2`s.
										h1: "h2",
										// Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
										pre: (props) => {
											return (
												// @ts-ignore
												<div {...props} />
											);
										},
										code: (props) => {
											return (
												// @ts-ignore
												<p {...props} />
											);
										},
										p: (props) => {
											return (
												// @ts-ignore
												<p
													{...props}
													className="transition-all duration-300 will-change-transform line-clamp-3 hover:line-clamp-none"
												/>
											);
										},
									}}
								>
									{analysis.text}
								</MemoizedMarkdown>
							</motion.div>
						)}
					</AnimatePresence>
				</CoreNodeContent>
				<CoreNodeBottom>
					<div className="flex items-center gap-1 rounded-full py-1 pl-2 pr-2.5  bg-neutral-800 text-neutral-400">
						<div className="size-5">
							<span
								className="relative flex shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200 pointer-events-none"
								data-state="closed"
								style={{
									borderColor: "rgba(255, 255, 255, 0.5)",
									transform: "translateX(0px)",
								}}
							>
								<AiStarIcon
									stroke={"#fff"}
									className="w-4 h-4 stroke-1"
									onClick={toggleShowAskAI}
								/>
								{showAskAI &&
									(node?.data?.entities?.length > 0 &&
									props.data.type &&
									props.data.input ? (
										<AskAI
											question={askQuestion({
												entities: node?.data?.entities?.map(
													({ data }: any) => data?.name,
												),
												input: props.data.input,
												type: props.data.type,
											})}
											table={props?.data?.type}
											updateAnalysis={updateAnalysis}
										/>
									) : null)}
							</span>
						</div>
						<span className="text-neutral-400"></span>
					</div>
					<span className="flex items-center gap-1">
						<AddNote
							saveNote={saveNote}
							userNote={userNote}
							updateNote={updateNote}
						/>
					</span>
				</CoreNodeBottom>
			</CoreNodeContainer>

			{handles && handles?.length
				? handles.map((id: string) => (
						<Handle
							key={id}
							type="source"
							position={Position.Bottom}
							id={id}
							isConnectable={true}
						/>
					))
				: null}
			<Handle type="source" position={Position.Bottom} isConnectable={true} />
		</motion.div>
	);
});
UserInputNode.displayName = "UserInputNode";

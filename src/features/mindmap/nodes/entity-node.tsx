/* eslint-disable react/display-name */
"use client";
import { memo, useEffect, useState } from "react";

import { Handle, Position } from "@xyflow/react";

import {
	PopoverCloseButton,
	PopoverContent,
	PopoverFooter,
	PopoverForm,
	PopoverRoot,
	PopoverSubmitButton,
	PopoverTextarea,
	PopoverTrigger,
} from "@/components/animated";
import { AiStarIcon, ConnectionsIcon } from "@/components/icons";
import { AddNote } from "@/components/note/AddNote";
import { Button } from "@/components/ui/button";
import { useMindMap } from "@/contexts/mindmap/mindmap-context";
import { renderEntity } from "@/features/mindmap/components/cards/render-entity-card";
import { TestimonyCoreNodeBottom } from "@/features/mindmap/components/cards/testimony-card";
import {
	CoreNodeBottom,
	CoreNodeContainer,
	CoreNodeContent,
	CoreNodeTop,
} from "@/features/mindmap/nodes/core-node-ui";
import { useEntity } from "@/hooks";
import { ICON_GREEN, cn } from "@/utils";
import { Lightbulb } from "lucide-react";

interface Photo {
	id: string;
	name: string;
	mediaType: string;
	enablePublicUrl: boolean;
	signedUrlTimeout: number;
	uploadUrlTimeout: number;
	size: number;
	version: number;
	url: string;
}

export const IconMenuWrapper = ({
	children,
}: { children: React.ReactNode }) => {
	return (
		<div
			className="flex items-center gap-1 rounded-full bg-neutral-200 py-1 pl-2 pr-2.5 text-neutral-700 text-neutral-400 border border-white/50"
			style={{
				borderColor: "rgba(255, 255, 255, 0.5)",
				transform: "translateX(0px)",
			}}
		>
			<div className="">
				<span
					className="relative flex align-middle items-center content-center justify-start shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer shadow duration-200 pointer-events-none"
					data-state="closed"
					// style={{
					//   borderColor: 'rgba(255, 255, 255, 0.5)',
					//   transform: 'translateX(0px)',
					// }}
				>
					{children}
				</span>
			</div>
			<span className="text-neutral-600 text-neutral-400"></span>
		</div>
	);
};

const EntityNode = memo((node: any) => {
	console.log("node: ", node);
	const { useUpdateNodeInternals, useNodesData, deleteElements } = useMindMap();
	const handleDelete = () => {
		deleteElements([node.id]);
	};

	const updateNodeInternals = useUpdateNodeInternals();
	const [handles, setHandles]: any = useState([]);
	console.log("handles: ", handles);
	const nodeData = useNodesData(node.id);
	const type = node.data.type;

	const component = renderEntity({
		type: node.data.type,
		data: {
			...node.data,
			id: node.id,
		},
	});
	const {
		entity,

		saveNote,
		updateNote,
		userNote,
		connectionListConnections,
		handleHoverEnter,
		findConnections,
	} = useEntity({
		card: {
			...node.data,
			id: node.id,
		},
	});

	useEffect(() => {
		updateNodeInternals(node.id);
		if (node?.data?.handles && node.data?.handles.length) {
			const { data } = node;
			updateNodeInternals(node.id);
			setHandles(data.handles);
		}

		// if (node?.data?.concise) {
		//   updateNodeInternals(node.id)
		// }
	}, [node, updateNodeInternals]);

	return (
		<>
			<PopoverRoot>
				<Handle type="target" position={Position.Top} />
				<CoreNodeContainer
					className={cn(
						"motion-opacity-in-0 min-w-[200px] w-content core-node-container overflow-visible",
					)}
					id={node.id}
				>
					<CoreNodeTop>
						<div className="flex justify-between w-content align-center items-center ml-auto">
							{/* <Button variant='outline' onClick={handleDelete} className=' flex items-center px-4 py-2 font-semibold text-zinc-900 text-white bg-black  hover:border-indigo-800 mx-1'>
                <XIcon stroke={'#fff'} className='w-6 h-6 stroke-1' />
              </Button>
 */}
						</div>
					</CoreNodeTop>
					<CoreNodeContent className="min-h-[100xp] max-w-[300px]">
						{component}

						{handles && handles?.length
							? handles.map((id: string, index: number) => (
									<Handle
										key={`${id}-${index}`}
										type="source"
										position={Position.Bottom}
										id={id}
										isConnectable={true}
									/>
								))
							: null}
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
					{/* <CoreNodeBottom>
						{node?.data?.type === "testimonies" ||
						node?.data?.type === "testimony" ? (
							<TestimonyCoreNodeBottom card={node.data}>
								<PopoverTrigger>
									<IconMenuWrapper>
										<Lightbulb
											className="text-white stroke-1 bg-none"
											size="16"
										/>
									</IconMenuWrapper>
								</PopoverTrigger>
							</TestimonyCoreNodeBottom>
						) : (
							<>
								<div
									className="flex items-center gap-1 rounded-full  py-1 pl-2 pr-2.5 text-neutral-700 text-neutral-400 border border-white/50"
									style={{
										borderColor: "rgba(255, 255, 255, 0.8)",
										transform: "translateX(0px)",
									}}
									onClick={findConnections}
								>
									<div className="size-5">
										<span
											className="relative flex align-middle items-center content-center justify-start shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer shadow duration-200 pointer-events-none"
											data-state="closed"
											// style={{
											//   borderColor: 'rgba(255, 255, 255, 0.5)',
											//   transform: 'translateX(0px)',
											// }}
										>
											<AiStarIcon
												stroke={ICON_GREEN}
												className="w-4 h-4 stroke-1"
											/>
										</span>
									</div>
									<span className="text-neutral-600 text-neutral-400"></span>
								</div>
								<AddNote
									saveNote={saveNote}
									userNote={userNote}
									updateNote={updateNote}
								/>
								<Button
									variant="outline"
									onClick={findConnections}
									className=" flex items-center px-4 py-2 font-semibold text-white dark:bg-black  hover:border-indigo-800 mx-1"
								>
									<ConnectionsIcon
										stroke={ICON_GREEN}
										className="w-6 h-6 stroke-1"
									/>
								</Button>
							</>
						)}
					</CoreNodeBottom> */}
					{/* <PopoverContent className="bg-black text-white border border-indigo-500/20">
						<PopoverForm onSubmit={saveNote}>
							
							<PopoverTextarea onChange={updateNote} />
							<PopoverFooter>
								<PopoverCloseButton />
								<PopoverSubmitButton />
							</PopoverFooter>
						</PopoverForm>
					</PopoverContent> */}
				</CoreNodeContainer>
			</PopoverRoot>
		</>
	);
});

EntityNode.displayName = "EntityNode";

export { EntityNode };

// {/* {( node?.data?.entities?.length > 0 && props.data.type && props.data.input ? ( */ }

// <AskAI question={askQuestion( { entities: node?.data?.entities?.map( ( { data }: any ) => data?.name ), input: props.data.input, type: props.data.type } )} table={props?.data?.type} updateAnalysis={updateAnalysis} >
//   <WaypointsIcon stroke={DOMAIN_MODEL_COLORS.personnel} className='w-4 h-4 stroke-1' />
// </AskAI>
//           ) : null )}

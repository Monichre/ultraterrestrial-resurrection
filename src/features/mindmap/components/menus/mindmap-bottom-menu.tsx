"use client";
import {
	ArtifactsIcon,
	EventsIcon,
	KeyFiguresIcon,
	OracleIcon,
	OrganizationsIcon,
	TestimoniesIcon,
	TopicsIcon,
} from "@/components/icons/entity-icons";
import { useMindMap } from "@/contexts/mindmap/mindmap-context";
import { initiateDatabaseTableQuery } from "@/features/mindmap/queries/search";
import { DOMAIN_MODEL_COLORS, ICON_GREEN } from "@/utils/constants";
import { useAssistant } from "@ai-sdk/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";

import { AddIcon, ThinTwinklyStar } from "@/components/icons";
import {
	OracleInput,
	ToggleButton,
} from "@/features/ai/components/ai-inputs/oracle-input";
import { LightningBoltIcon } from "@radix-ui/react-icons";

import { TextShimmer } from "@/components/animated/text-effect";
import { MagicWandIcon } from "@/components/icons";
import { searchXataConnections } from "@/features/mindmap/actions";
import { capitalize, cn } from "@/utils";
import { Brain, SearchIcon, XIcon } from "lucide-react";

// Move COMMANDS outside component
const COMMANDS = [
	{
		id: "chat",
		label: "Chat",
		description: "Start a conversation with our Disclosure Agent",
		icon: () => <LightningBoltIcon stroke={ICON_GREEN} />,
		prefix: "/chat",
	},
	{
		id: "Search",
		label: "Search",
		description:
			"Search existing records across our database, curated and validated web resources and our own AI knowledge base",
		icon: () => <SearchIcon stroke={ICON_GREEN} />,
		prefix: "/search",
	},
	{
		id: "Add",
		label: "Add",
		description: "Add a new item to the mind map",
		icon: () => <AddIcon stroke={ICON_GREEN} />,
		prefix: "/add",
	},
	{
		id: "Connect",
		label: "Connect",
		description: "Connect to a database",
		icon: () => <ThinTwinklyStar stroke={ICON_GREEN} />,
		prefix: "/connect",
	},
	{
		id: "analyze",
		label: "Analyze",
		description:
			"Analyze the existing records on your mind map and generate new insights",
		icon: () => <MagicWandIcon stroke={ICON_GREEN} />,
		prefix: "/analyze",
	},
] as const;

export const MindMapBottomMenu = () => {
	const {
		status: chatStatus,
		messages,
		input,
		setInput,
		submitMessage,
		handleInputChange,
		append,
	} = useAssistant({ api: "/api/disclosure/chat" });

	const {
		addNextEntitiesToMindMap,
		loadNodesFromTableQuery,
		addConnectionNodesFromSearch,
		addUserInputNode,
		addNodes,
		updateNodeData,
		addEdges,
		screenToFlowPosition,
		retrieveEntitiesFromStore,

		setEdges,
		setNodes,
		getNodes,
		addNode,

		getNode,
	} = useMindMap();

	const idCounter = useRef(0);
	const getNextId = useCallback(() => {
		idCounter.current += 1;
		return `userInputNode-${idCounter.current}`;
	}, []);

	const calculateCenterOfScreen = useCallback(() => {
		return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	}, []);

	/**
	 * Computes the positions for child nodes based on the parent's position.
	 * - Retrieves the parent's width and height from the DOM.
	 * - Calculates the total width needed for the children (using fixed node width and spacing).
	 * - Determines the starting x-coordinate so that the children are centered below the parent.
	 */
	const computeChildPositions = useCallback(
		(parentNode: any, numberOfChildren: number) => {
			console.log("🚀 ~ computeChildPositions ~ parentNode:", parentNode);

			// NOTE: We dont need to use the DOM position of the parent node as the chld nodes will be positioned relatively to the parent by default (bc of the parentId prop)

			const parentRect = document
				.querySelector(`[data-id="${parentNode.id}"]`)
				?.getBoundingClientRect();

			console.log("🚀 ~ computeChildPositions ~ parentRect:", parentRect);

			const parentWidth = parentRect?.width || 250;
			const parentHeight = parentRect?.height || 100;

			const entityWidth = 250; // Default width for each child node
			const entitySpacing = 100; // Space between child nodes
			const totalWidth =
				numberOfChildren * entityWidth + (numberOfChildren - 1) * entitySpacing;

			// Parent's center is its left position plus half its width
			const parentCenterX = parentWidth / 2;
			// Start so that the children (as a group) are centered below the parent's center
			const startX = 0 - totalWidth / 2;

			const verticalSpacing = 200; // Vertical offset from the bottom of the parent
			const childY = parentHeight + verticalSpacing;

			return { startX, childY, entityWidth, entitySpacing };
		},
		[],
	);

	const handleLoadingRecords = useCallback(
		async ({ data: { type } }: any) => {
			console.log("🚀 ~ MindMapBottomMenu ~ type:", type);

			const amount = 3;
			const center = screenToFlowPosition(calculateCenterOfScreen());

			// Retrieve the entities for this type
			const entities = await retrieveEntitiesFromStore(type);

			console.log("🚀 ~ MindMapBottomMenu ~ entities:", entities);

			const potentialUserNode: any = {
				id: getNextId(),
				// type: "userInputNode",
				type: "userInputNode",
				position: { ...center },
				data: {
					label: "Your Query",
					input: `Beginning your exploration by loading ${amount} ${type}. Fetching Data...`,
					entities,
					type: type,
				},
			};

			const nodes = getNodes();

			console.log("🚀 ~ MindMapBottomMenu ~ nodes:", nodes);

			const existingUserInputNodes = nodes?.length
				? nodes
						.filter(
							(node: any) =>
								node.type === "userInputNode" &&
								node.id !== potentialUserNode.id,
						)
						.sort((a: any, b: any) => {
							const aNum = Number.parseInt(a.id.split("-")[1], 10);
							const bNum = Number.parseInt(b.id.split("-")[1], 10);
							return aNum - bNum;
						})
				: [];

			// Use the last user input node as the parent (if it exists)
			const parentNode =
				existingUserInputNodes.length > 0
					? existingUserInputNodes[existingUserInputNodes.length - 1]
					: potentialUserNode;

			addNode(parentNode);

			// Compute positions for child nodes so they are centered under the parent
			const { startX, childY, entityWidth, entitySpacing } =
				computeChildPositions(parentNode, entities.length);

			// Map each entity to a new node with computed positions and a parentId
			const childNodes = entities.map((entity: any, index: number) => ({
				...entity,
				type: "entityNode",
				position: {
					x: startX + index * (entityWidth + entitySpacing),
					y: childY,
				},
				parentId: parentNode?.id,
			}));

			// Add the child nodes to the graph
			addNodes(childNodes);

			// Create edges that connect the parent node to each child node
			const newEdges = entities.map((entity: any) => ({
				id: `${parentNode?.id}-${entity.id}`,
				source: parentNode?.id,
				target: entity.id,
				type: "smoothstep",
			}));

			// Add the edges to the graph
			addEdges(newEdges);
		},
		[
			calculateCenterOfScreen,
			screenToFlowPosition,
			getNextId,
			addNode,
			getNodes,
			retrieveEntitiesFromStore,
			addNodes,
			addEdges,
			computeChildPositions,
		],
	);

	const runSearch = useCallback(
		async ({ type, searchTerm }: any) => {
			const userNode: any = {
				id: uuidv4(),
				type: "userInputNode",
				position: { x: 0, y: 0 },
				data: { label: "Your Query", input: searchTerm },
			};
			addNodes(userNode);

			const response: any = await initiateDatabaseTableQuery({
				table: type,
				keyword: searchTerm,
			});

			const {
				suggestedSearchResult: { record },
				relatedResults,
				totalCount,
			} = response;

			// For a single child node, position it directly below the userNode
			const userElem = document.getElementById(userNode.id);
			const userRect = userElem
				? userElem.getBoundingClientRect()
				: { width: 200, height: 100 };
			const userHeight = userRect.height || 100;
			const childY = userNode.position.y + userHeight + 100; // 100px vertical spacing

			const childNode: any = {
				id: record?.id,
				type: `${type}Node`,
				data: {
					type,
					...record,
				},
				position: {
					x: userNode.position.x, // For a single node, we align with the parent's x
					y: childY,
				},
				parentId: userNode.id,
			};
			const edgeId = `${userNode.id}-${childNode.id}`;
			const sourceHandle = `handle:${edgeId}`;

			const edge: any = {
				id: edgeId,
				source: userNode.id,
				target: childNode.id,
				sourceHandle: sourceHandle,
				animated: true,
				type: "sequential",
				label: `You searched for ${searchTerm} within ${type}`,
				style: {
					stroke: DOMAIN_MODEL_COLORS[type],
				},
			};
			updateNodeData(userNode.id, { handles: [sourceHandle] });

			addNodes(childNode);
			addEdges(edge);
		},
		[addNodes, addEdges, updateNodeData],
	);

	const modelSearchActions = [
		{
			icon: <EventsIcon stroke={ICON_GREEN} />,
			label: "Add Events",
			name: "Events",
			description: "Add historical events to the mind map",
			searchAction: async (searchTerm: string) => {
				await runSearch({ type: "events", searchTerm });
			},
		},
		{
			icon: <TopicsIcon stroke={ICON_GREEN} />,
			label: "Add Topics",
			name: "Topics",
			searchAction: async (searchTerm: string) => {
				await runSearch({ type: "topics", searchTerm });
			},
		},
		{
			icon: <KeyFiguresIcon stroke={ICON_GREEN} />,
			label: "Add KeyFigures",
			name: "personnel",
			searchAction: async (searchTerm: string) => {
				await runSearch({ type: "personnel", searchTerm });
			},
		},
		{
			icon: <TestimoniesIcon stroke={ICON_GREEN} />,
			label: "Add Testimonies",
			name: "Testimonies",
			searchAction: async (searchTerm: string) => {
				await runSearch({ type: "testimonies", searchTerm });
			},
		},
		{
			icon: <OrganizationsIcon stroke={ICON_GREEN} />,
			label: "Add Organizations",
			name: "Organizations",
			searchAction: async (searchTerm: string) => {
				await runSearch({ type: "organizations", searchTerm });
			},
		},
		{
			label: "Artifacts",
			name: "artifacts",
			icon: <ArtifactsIcon stroke={ICON_GREEN} />,
			searchAction: async (searchTerm: string) => {
				await runSearch({ type: "artifacts", searchTerm });
			},
		},
	];

	const addDataToMindMap = (model: string) => {
		handleLoadingRecords({ data: { type: model } });
	};

	const menuRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [activeCommand, setActiveCommand] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [inputValue, setInputValue] = useState("");
	const [state, setState] = useState<{
		selectedModel: string | null;
		isModelMenuOpen: boolean;
	}>({
		selectedModel: null,
		isModelMenuOpen: false,
	});
	const [searchResults, setSearchResults] = useState<any>(null);

	const [filteredCommands, setFilteredCommands] = useState(COMMANDS);

	useEffect(() => {
		if (inputValue.startsWith("/")) {
			const searchTerm = inputValue.slice(1).toLowerCase();
			setFilteredCommands(
				COMMANDS.filter(
					(cmd) =>
						cmd.prefix.toLowerCase().includes(searchTerm) ||
						cmd.label.toLowerCase().includes(searchTerm),
				),
			);
		} else {
			setFilteredCommands(COMMANDS);
		}
	}, [inputValue]);

	const updateState = useCallback(
		(updates: Partial<typeof state>) =>
			setState((prev) => ({ ...prev, ...updates })),
		[],
	);

	const toggleModelMenu = () => {
		updateState({ isModelMenuOpen: !state.isModelMenuOpen });
		// updateState( { isMenuOpen: true } )
	};

	const closeModelMenu = () => {
		updateState({ isModelMenuOpen: false });
	};

	const handleKeyDown = useCallback(
		async (e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();

				if (activeCommand === "chat") {
					append({ role: "user", content: inputValue });
					setInputValue("");
				}

				if (
					activeCommand === "search" &&
					inputValue &&
					inputValue.trim() !== "/"
				) {
					// loadNodesFromTableQuery(inputValue);
					const xataSearchResults = await searchXataConnections({
						query: inputValue,
						table: state?.selectedModel || null,
					});
					console.log(
						"🚀 ~ handleKeyDown ~ xataSearchResults:",
						xataSearchResults,
					);
					setSearchResults(xataSearchResults);
				}
			}

			if (e.key === "Backspace" && (inputValue === "" || inputValue === " ")) {
				setActiveCommand(null);
				setIsOpen(false);
			}
			if (e.key === "/") {
				setIsOpen(true);
			}
		},
		[activeCommand, inputValue, submitMessage, loadNodesFromTableQuery],
	);
	const removeActiveCommand = () => {
		setActiveCommand(null);
		setIsOpen(false);
	};
	const handleChange = useCallback(
		(e: any) => {
			setInputValue(e.target.value);
			if (activeCommand === "chat") {
				// setInput( value )
				handleInputChange(e);
			}
		},
		[activeCommand, handleInputChange],
	);

	const handleCommandSelect = (commandId: string) => {
		const command = COMMANDS.find((cmd) => cmd.id === commandId);
		if (command) {
			setActiveCommand(commandId);
			setInputValue("");
			setIsOpen(false);
			closeModelMenu();
		}
	};

	const handleLoadingModelData = () => {
		if (state.selectedModel) {
			addDataToMindMap(state.selectedModel);
		}
	};

	const isChatActive = activeCommand === "chat";

	return (
		<div className="flex justify-center w-full">
			<div className="p-4 flex flex-col w-[500px]">
				<div className="relative w-full h-auto overflow-hidden">
					{/* <div className="border-b border-black/10 dark:border-white/10"> */}
					<div className="flex flex-col justify-between items-center px-2 py-4 text-sm text-zinc-600 dark:text-zinc-400">
						<div className="relative w-full z-50" ref={menuRef}>
							<div className="flex w-full justify-between items-center content-center px-2">
								<div className="flex items-center gap-2">
									<motion.button
										onClick={toggleModelMenu}
										className="flex justify-start items-center gap-1"
									>
										<div className="cursor-pointer hover:shadow-sm hover:shadow-indigo-500/50 flex hover:ring-indigo-500/50 relative w-fit gap-3\1 rounded-xl align-center items-center content-center px-2 py-1 text-xs ring-1 ring-neutral-200 duration-200 ring-neutral-700 bg-neutral-950 bg-gradient-to-b from-black/90">
											{/* <AiStarIcon
													className="w-3 h-3 mr-2"
													stroke={ICON_GREEN}
												/> */}
											<OracleIcon
												className={cn(
													"w-3 h-3 mr-2",
													chatStatus === "in_progress" ? "animate-spin" : "",
												)}
												fill={ICON_GREEN}
											/>
											<TextShimmer as="span" className="inline-block mr-2">
												Oracle{" "}
												{state?.selectedModel &&
													`| ${capitalize(state?.selectedModel)}`}{" "}
											</TextShimmer>
										</div>
									</motion.button>

									{activeCommand && (
										<div
											className="cursor-pointer hover:shadow-sm hover:shadow-indigo-500/50 flex hover:ring-indigo-500/50 relative w-fit gap-3\1 rounded-xl align-center items-center content-center px-2 py-1 text-xs ring-1 ring-neutral-200 duration-200 ring-neutral-700 bg-neutral-950 bg-gradient-to-b from-black/90"
											onClick={removeActiveCommand}
										>
											<XIcon className="w-4 h-4 text-black/50 dark:text-white/50" />
											{/* <span className="text-black/70 dark:text-white/70"> */}
											<TextShimmer as="span" className="inline-block mr-2">
												{activeCommand}
											</TextShimmer>
										</div>
									)}
								</div>
								<ToggleButton
									icon={<Brain className="w-4 h-4" />}
									label="Memory"
								/>
							</div>

							<motion.div
								ref={menuRef}
								className="rounded-xl relative flex gap-2 items-center relative w-full duration-200 text-neutral-500 willChange gpu-transform text-neutral-500 bg-neutral-950 bg-gradient-to-b from-black/90"
								initial={{
									height: 0,
								}}
								animate={{
									height: state.isModelMenuOpen ? 250 : "0",
								}}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30,
									// duration: 0.2,
									staggerChildren: 0.1,
									delayChildren: 0.2,
								}}
							>
								<AnimatePresence>
									{state.isModelMenuOpen && (
										<motion.div
											key="model-menu"
											// className="h-full w-full"
											// className="absolute top-0 left-0 mt-1 w-64 bg-white dark:bg-zinc-800 rounded-md shadow-lg py-1 z-50 border border-black/10 dark:border-white/10"
											className="pb-0 flex flex-col h-full items-end rounded-xl justify-evenly absolute w-full text-neutral-500 bg-neutral-950 bg-gradient-to-b from-black/90"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											// exit={{ opacity: 0, y: 20 }}
										>
											{modelSearchActions.map((model, index) => (
												<motion.div
													className="w-full shrink-0 px-2"
													key={model.name}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													// exit={{ opacity: 0, y: 20 }}
												>
													<button
														type="button"
														key={model.name}
														className="w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 text-sm transition-colors dark:text-white"
														onClick={() =>
															updateState({
																selectedModel: model.name.toLowerCase(),
																isModelMenuOpen: false,
															})
														}
													>
														<div className="flex items-center justify-start gap-2 flex-1">
															{model.icon}
															<span className="capitalize">{model.name}</span>
														</div>
														<span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
															{model.label}
														</span>
													</button>
												</motion.div>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						</div>
					</div>
				</div>

				<form
					onSubmit={submitMessage}
					className={
						isChatActive ? " bg-neutral-950 bg-gradient-to-b from-black/90" : ""
					}
				>
					<OracleInput
						activeModel={state.selectedModel}
						activeCommand={activeCommand}
						inputValue={inputValue}
						setInputValue={handleChange}
						handleKeyDown={handleKeyDown}
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						loadModelData={handleLoadingModelData}
						isChatActive={activeCommand === "chat"}
						chatStatus={chatStatus}
						messages={messages}
					/>
				</form>

				<AnimatePresence>
					{isOpen && !activeCommand && (
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 8 }}
							transition={{ duration: 0.15 }}
							className="absolute bottom-0 left-0 w-full h-auto z-40 flex justify-center items-center"
						>
							<div className="rounded-lg shadow-lg w-[444px] h-[400px] mt-2 rounded-lg border border-neutral-700/30 text-neutral-500 bg-black bg-gradient-to-b from-black relative rounded-tl-lg rounded-tr-lg ">
								<Command className="w-full">
									<Command.List className="">
										{filteredCommands.map((command, index) => (
											<Command.Item
												key={command.id}
												onSelect={() => {
													handleCommandSelect(command.id);
													// setInputValue( `${command.prefix} ` )
												}}
												className="px-3 py-2.5 flex items-center gap-3 text-sm hover:bg-white/10 cursor-pointer group"
											>
												{command.icon()}
												<div className="flex flex-col">
													<span className="font-medium text-black/70 dark:text-white/70">
														{command.label}
													</span>
													<span className="text-xs text-black/50 dark:text-white/50">
														{command.description}
													</span>
												</div>
												<span className="ml-auto text-xs text-black/30 dark:text-white/30">
													{command.prefix}
												</span>
											</Command.Item>
										))}
									</Command.List>
								</Command>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

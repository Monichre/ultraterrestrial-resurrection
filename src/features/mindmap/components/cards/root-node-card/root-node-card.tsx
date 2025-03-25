import { NumberTicker } from "@/components/animated/number-ticker";
import { DotGridBackgroundBlack } from "@/components/backgrounds";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card/card";

import { capitalize, cn } from "@/utils";

import "@/components/ui/card/cards.css";
import { useNodesData } from "@xyflow/react";

import { useMindMap } from "@/contexts/mindmap";
import { memo, useCallback, useState } from "react";

import { InputWithVanishAnimation } from "@/features/mindmap/components/cards/root-node-card/InputWithVanishAnimation";
import { initiateDatabaseTableQuery } from "@/features/mindmap/queries/search";

const Description = memo(({ childCount, label }: any) => (
	<>
		There are <NumberTicker value={childCount} /> {capitalize(label)}
	</>
));
const LoadedStats = memo(({ length, childCount, label }: any) => (
	<>
		{/* @ts-ignore */}
		Loaded <NumberTicker value={length} /> of
		<NumberTicker value={childCount} /> {capitalize(label)}{" "}
	</>
));

export const RootNodeCard = memo(({ nodeData }: any) => {
	const {
		loadNodesFromTableQuery,
		conciseViewActive,
		renderRootNodeConciseLayout,

		toggleLocationVisualization,
		addNextEntitiesToMindMap,
	} = useMindMap();

	const nodeState: any = useNodesData(nodeData?.id);

	const type = nodeData?.data?.type;

	const [searchTerm, setSearchTerm]: any = useState("");

	const [searchResults, setSearchResults] = useState([]);
	const updateSearchTerm = (event: any) => {
		const { value } = event.target;

		setSearchTerm(value);
	};

	const runSearch = useCallback(async () => {
		const keyword = searchTerm;
		const table = type;

		const { results } = await initiateDatabaseTableQuery({ table, keyword });

		loadNodesFromTableQuery({
			type,
			searchResults: results,
			searchTerm: keyword.trim().replace(/ /g, ""),
		});
		setSearchTerm("");
	}, [searchTerm, type, loadNodesFromTableQuery]);
	const {
		data: { childCount, label },
		...rest
	} = nodeData;

	const nodeProps = {
		...rest,
	};

	const handleLoadingRecords = useCallback(async () => {
		await addNextEntitiesToMindMap(nodeData);
	}, [nodeData, addNextEntitiesToMindMap]);

	const interim = (label || type).toLowerCase();
	const title =
		interim === "personnel" ? "Subject Matter Experts" : capitalize(interim);

	return (
		<Card
			{...nodeProps}
			className={cn(
				"w-[280px]",
				"relative",
				"overflow-hidden",
				// '!bg-transparent'
				`root-node`,
				"bg-dot-white/[0.2]",
			)}
		>
			<div className="absolute top-0 flex w-full justify-center">
				<div className="left-0 h-[1px] animate-border-width rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-white to-[rgba(17,17,17,0)] transition-all duration-1000" />
			</div>
			<DotGridBackgroundBlack />
			<CardHeader
				className={`p-2 relative z-20 after:content-[''] after:absolute after:w-[20%] after:left-[8px] after:bottom-[-4px] after:h-[1px] after:bg-[#78efff]  `}
			>
				<div className="flex align-middle content-center items-center justify-between">
					<h3 className={`!font-monumentMono  tracking-wider uppercase`}>
						{title}
					</h3>
				</div>

				<CardDescription className="text-xs relative z-20">
					{nodeState?.data?.handles?.length ? (
						<LoadedStats
							length={nodeState?.data?.handles?.length}
							childCount={childCount}
							label={label}
						/>
					) : (
						<Description childCount={childCount} label={label} />
					)}
				</CardDescription>
			</CardHeader>

			<CardContent className="my-2">
				<InputWithVanishAnimation
					onSubmit={runSearch}
					type={type}
					placeholders={["Roswell", "USS Nimitz"]}
				/>
			</CardContent>

			{/* <RootNodeToolbar
        onChange={updateSearchTerm}
        onSubmit={runSearch}
        type={type}
        value={searchTerm}
      /> */}
			<CardFooter className="p-2 flex justify-center align-middle items-center mt-2">
				<ShinyButton
					onClick={handleLoadingRecords}
					className="load-records-button cursor-pointer"
				>
					Load {capitalize(label)}
				</ShinyButton>
			</CardFooter>
		</Card>
	);
});

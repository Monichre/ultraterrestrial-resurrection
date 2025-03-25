import { Suspense } from "react";

import { MindMap } from "@/features/mindmap";

import { Loading } from "@/components/loaders/loading";
import {
	type NetworkGraphPayload,
	getEntityNetworkGraphData,
} from "@/features/mindmap/queries/get-entity-network-graph-data";

import { MindMapCursor } from "@/components/cursors";
import { StateOfDisclosureProvider } from "@/contexts";
// import { useChatRuntime } from "@assistant-ui/react-ai-sdk"

export default async function Index() {
	const data: NetworkGraphPayload = await getEntityNetworkGraphData();

	console.log("🚀 ~ Index ~ data:", data);

	return (
		// <AssistantRuntimeProvider runtime={runtime}>
		<Suspense fallback={<Loading />}>
			<MindMapCursor type="gooey" />
			<StateOfDisclosureProvider stateOfDisclosure={data}>
				<MindMap />
			</StateOfDisclosureProvider>
		</Suspense>
		// </AssistantRuntimeProvider>
	);
}

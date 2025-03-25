import { D3DrawingBoard } from "@/features/3d/drawing-board";
import {
	type NetworkGraphPayload,
	getEntityNetworkGraphData,
} from "@/features/mindmap/queries/get-entity-network-graph-data";
import { Suspense } from "react";

export default async function Index() {
	const data: NetworkGraphPayload = await getEntityNetworkGraphData();

	return (
		<Suspense fallback={null}>
			<D3DrawingBoard allEntityGraphData={data.graphData} />
		</Suspense>
	);
}

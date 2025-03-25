import { EntityNetworkGraph3D } from "@/features/3d/entity-network-graph-3d";
import {
	type NetworkGraphPayload,
	getEntityNetworkGraphData,
} from "@/features/mindmap/queries/get-entity-network-graph-data";
import { Suspense } from "react";

export default async function Index() {
	const data: NetworkGraphPayload = await getEntityNetworkGraphData();
	console.log("data: ", data);

	// {/* <Graph models={models} /> */}

	return (
		<Suspense fallback={null}>
			<EntityNetworkGraph3D {...data} />
		</Suspense>
	);
}

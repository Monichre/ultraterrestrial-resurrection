import type { DatabaseSchema } from "@/db/xata/xata";
import type {
	ReactFlowData,
	ReactFlowNode,
	ReactFlowEdge,
} from "@/features/mindmap/actions/xata-to-xyflow";
import type { XataRecord } from "@xata.io/client";

interface RecordObject {
	answer: string;
	records: XataRecord["id"][];
}

interface AskXataResponse {
	answer: RecordObject["answer"];
	relatedRecords: {
		[key: string]: DatabaseSchema[keyof DatabaseSchema] | RecordObject;
	};
}

/**
 * Transforms the Xata query result into a schema and data format ready for ReactFlow
 */
export async function transformForReactflow(
	xataResult: AskXataResponse,
): Promise<ReactFlowData> {
	// Extract the related records from the Xata query result
	const { relatedRecords } = xataResult;
	const nodes: ReactFlowNode[] = [];
	const edges: ReactFlowEdge[] = [];

	// Create a central node as the starting point for our graph
	const centralNodeId = "central-node";
	nodes.push({
		id: centralNodeId,
		type: "centralNode",
		position: { x: 0, y: 0 },
		data: { label: "Query Results" },
	});

	// Create nodes for each record type and connect them to the central node
	let nodeXPosition = -300;

	// Process each table's records
	for (const [table, recordObj] of Object.entries(relatedRecords)) {
		if (recordObj?.record) {
			// Using optional chaining
			const record = recordObj.record;

			if (!record) continue;

			// Create a node for this record
			const nodeId = `${table}-${record.id || Math.random().toString(36).substring(2, 9)}`;
			nodes.push({
				id: nodeId,
				type: "recordNode",
				position: { x: nodeXPosition, y: 150 },
				data: {
					label: `${table}: ${record.name || record.title || record.id}`,
					table,
					record,
					answer: recordObj.answer,
				},
			});

			// Create an edge connecting to the central node
			edges.push({
				id: `edge-${nodeId}`,
				source: centralNodeId,
				target: nodeId,
				type: "smoothstep",
				animated: true,
				label: table,
			});

			// Adjust position for next node
			nodeXPosition += 300;
		}
	}

	return { nodes, edges };
}

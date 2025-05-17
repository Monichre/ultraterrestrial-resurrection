"use server";

import { convertDatabaseRecordToMindMapNode } from "./utils";

import {
	getAllArtifacts,
	getAllDocuments,
	getAllEvents,
	getAllEventsExpertsConnections,
	getAllEventsTopicsExpertsConnections,
	getAllOrganizations,
	getAllOrganizationsMembers,
	getAllPersonnel,
	getAllTestimonies,
	getAllTopics,
	getAllTopicsExpertsConnections,
	getAllTopicsTestimoniesConnections,
} from "@db/xata";
import { xata } from "./client";
// Type for the input parameters
type FetchNextMindmapRecordsParams = {
	table: string;
	size: number;
	offset: number;
	cursor?: string;
};

// Type for the return data structure
export type MindMapNode = {
	id: string;
	data: {
		label: string;
		[key: string]: unknown;
	};
	type: string;
};

export type FetchNextMindmapRecordsResult = {
	nodes: MindMapNode[];
	meta: {
		cursor?: string;
	};
};

/**
 * Server action to fetch paginated records from specified table and convert them to mindmap nodes
 */
export async function fetchNextMindmapRecords(
	params: FetchNextMindmapRecordsParams,
): Promise<FetchNextMindmapRecordsResult> {
	const { table, size, offset, cursor } = params;

	console.log("🚀 ~ offset:", offset);
	console.log("🚀 ~ size:", size);
	console.log("🚀 ~ table:", table);
	console.log("🚀 ~ cursor:", cursor);

	const xataTable = xata.db[table];

	console.log("🚀 ~ xataTable:", xataTable);

	try {
		// Get the dynamic table from xata client

		if (!xataTable) {
			throw new Error(`Table ${table} not found in Xata database`);
		}

		// Offset-based pagination (for initial load or specific positions)
		// Define the response type
		type XataResponse = {
			records: Array<{
				id: string;
				[key: string]: any;
				xata: {
					version: number;
					createdAt: string;
					updatedAt: string;
				};
			}>;
			meta: {
				page?: {
					cursor: string;
					more: boolean;
				};
			};
		};

		const {
			records,
			meta: {
				page: { more },
			},
		}: XataResponse = await xataTable.getPaginated({
			pagination: { size: size },
		});

		console.log("🚀 ~ response:", records);

		// Extract records and convert to serializable format
		const serializableRecords = records.map((record) =>
			record.toSerializable(),
		);

		// Convert to mind map nodes
		const nodes = serializableRecords.map(
			(record: Record<string, unknown>) => ({
				...convertDatabaseRecordToMindMapNode(record),
				type: "entityNode",
				data: {
					...convertDatabaseRecordToMindMapNode(record).data,
					type: table,
				},
			}),
		);

		console.log("🚀 ~ nodes ~ nodes:", nodes);

		return {
			nodes,
			meta: {
				more,
			},
		};
	} catch (error) {
		console.error(`Error fetching records from ${table}:`, error);
		throw error;
	}
}

const formatGraphNode = ({ record, type }: any) => {
	const { id, name, label, ...rest } = record;
	const title = name || label;

	const node: any = {
		id,
		label: title,
		data: {
			...rest,
			name: title,
			label: title,
			// color,
			type,
		},
	};
	return node;
};
const formatGraphEdge = ({ targetNode, sourceNode }: any) => {
	const edge = {
		source: sourceNode?.id,
		target: targetNode?.id,
		id: `${sourceNode.id}->${targetNode.id}`,
	};
	return edge;
};

export type NetworkGraphPayload = {
	records: {
		topics: Record<string, any>[];
		events: Record<string, any>[];
		personnel: Record<string, any>[];
		testimonies: Record<string, any>[];
		organizations: Record<string, any>[];
	};
	connections: {
		topicsExpertsConnections: Record<string, any>[];
		eventsExpertsConnections: Record<string, any>[];
		eventsTopicsExpertsConnections: Record<string, any>[];
		topicsTestimoniesConnections: Record<string, any>[];
		organizationsPersonnelConnections: Record<string, any>[];
	};
	graphData: {
		nodes: any[];
		links: any[];
	};
};

export const getEntityNetworkGraphData = async () => {
	try {
		const events = await getAllEvents();
		const topics = await getAllTopics();
		const testimonies = await getAllTestimonies();
		const organizations = await getAllOrganizations();
		const personnel = await getAllPersonnel();
		const topicsExpertsConnections = await getAllTopicsExpertsConnections();
		const eventsExpertsConnections = await getAllEventsExpertsConnections();
		const organizationsMembers = await getAllOrganizationsMembers();
		const eventsTopicsExpertsConnections =
			await getAllEventsTopicsExpertsConnections();
		const topicsTestimoniesConnections =
			await getAllTopicsTestimoniesConnections();
		const artifacts = await getAllArtifacts();
		const documents = await getAllDocuments();

		const records: any = {
			topics,
			events,
			personnel,
			testimonies,
			organizations,
			documents,
			artifacts,
		};

		const topicsNodes = records.topics.map((record: any) =>
			formatGraphNode({ record, type: "topics" }),
		);
		const eventsNodes = records.events.map((record: any) =>
			formatGraphNode({ record, type: "events" }),
		);
		const personnelNodes = records.personnel.map((record: any) =>
			formatGraphNode({ record, type: "personnel" }),
		);
		const testimoniesNodes = records.testimonies.map((record: any) =>
			formatGraphNode({ record, type: "testimonies" }),
		);

		const organizationsNodes = records.organizations.map((record: any) =>
			formatGraphNode({ record, type: "organizations" }),
		);

		const documentsNodes = records.documents.map((record: any) =>
			formatGraphNode({ record, type: "documents" }),
		);

		const artifactsNodes = records.artifacts.map((record: any) =>
			formatGraphNode({ record, type: "artifacts" }),
		);

		const nodes = [
			...topicsNodes,
			...eventsNodes,
			...personnelNodes,
			...testimoniesNodes,
			...organizationsNodes,
			...documentsNodes,
			...artifactsNodes,
		];

		const connections = {
			topicsExpertsConnections: topicsExpertsConnections,
			eventsExpertsConnections: eventsExpertsConnections,
			eventsTopicsExpertsConnections: eventsTopicsExpertsConnections,
			topicsTestimoniesConnections: topicsTestimoniesConnections,
			organizationsPersonnelConnections: organizationsMembers,
		};

		const links = [
			...connections.eventsExpertsConnections,
			...connections.topicsExpertsConnections,
			...connections.eventsTopicsExpertsConnections,
			...connections.topicsTestimoniesConnections,
			...connections.organizationsPersonnelConnections,
		]
			.map(({ id, ...rest }) => {
				const [sourceData, targetData] = Object.entries(rest);

				const [sourceType, sourceNode]: any = sourceData;

				const [targetType, targetNode]: any = targetData;

				// Check if source and target nodes exist because occassionally a join record can exist in either table while missing the record referenced by the foreign key
				const sourceNodeExists = sourceNode
					? nodes.find((node) => node.id === sourceNode.id)
					: null;
				const targetNodeExists = targetNode
					? nodes.find((node) => node.id === targetNode.id)
					: null;

				if (sourceNodeExists && targetNodeExists) {
					return formatGraphEdge({ id, sourceNode, targetNode });
				}
			})
			.filter((link) => {
				return link && link.source && link.target;
			});

		const payload: NetworkGraphPayload = {
			records,
			connections,
			graphData: {
				nodes,
				links,
			},
		};

		return payload;
	} catch (error) {
		// Return a minimal valid payload
		return {
			records: {
				topics: [],
				events: [],
				personnel: [],
				testimonies: [],
				organizations: [],
			},
			connections: {
				topicsExpertsConnections: [],
				eventsExpertsConnections: [],
				eventsTopicsExpertsConnections: [],
				topicsTestimoniesConnections: [],
				organizationsPersonnelConnections: [],
			},
			graphData: {
				nodes: [],
				links: [],
			},
		} as NetworkGraphPayload;
	}
};

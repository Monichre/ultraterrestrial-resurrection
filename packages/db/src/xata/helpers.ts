import {
	convertDatabaseRecordToMindMapNode,
	formatGraphNode,
	formatGraphEdge,
} from "./utils";

import { xata } from "./client";
import {
	getAllOrganizations,
	getAllPersonnel,
	getAllArtifacts,
	getAllDocuments,
} from "./models";
import { getAllEvents } from "./models/events";
import { getAllEventTopicSmes as getAllTopicsExpertsConnections } from "./models/event-topic-subject-matter-experts";
import { getAllEventSmes as getAllEventsExpertsConnections } from "./models/event-subject-matter-experts";
import { getAllOrganizationMembers as getAllOrganizationsMembers } from "./models/organization-members";
import { getAllEventTopicSmes as getAllEventsTopicsExpertsConnections } from "./models/event-topic-subject-matter-experts";
import { getAllTopicTestimonies as getAllTopicsTestimoniesConnections } from "./models/topics-testimonies";
import { getAllTestimonies } from "./models/testimonies";
import { getAllTopics } from "./models/topics";
import type {
	EventTopicSubjectMatterExpertsRecord,
	EventSubjectMatterExpertsRecord,
	OrganizationMembersRecord,
	TopicsTestimoniesRecord,
	EventsRecord,
	TopicsRecord,
	TestimoniesRecord,
	DatabaseSchema,
	OrganizationsRecord,
	PersonnelRecord,
	DocumentsRecord,
	ArtifactsRecord,
} from "./xata";

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
		more?: boolean;
	};
};

// Define interfaces for the join tables data
interface ConnectionResults<T> {
	records: T[];
	pagination: { hasNextPage: boolean; total?: number };
}

/**
 * Join tables data structure
 */
export type JoinTablesData = {
	topicsExpertsConnections: EventTopicSubjectMatterExpertsRecord[];
	eventsExpertsConnections: EventSubjectMatterExpertsRecord[];
	eventsTopicsExpertsConnections: EventTopicSubjectMatterExpertsRecord[];
	topicsTestimoniesConnections: TopicsTestimoniesRecord[];
	organizationsPersonnelConnections: OrganizationMembersRecord[];
};

/**
 * Fetches all join tables data in parallel from Xata database
 * @returns A promise that resolves to an object containing all join tables data
 */
export async function getAllJoinTables(): Promise<JoinTablesData> {
	try {
		const [
			topicsExpertsConnectionsResult,
			eventsExpertsConnectionsResult,
			organizationsMembersResult,
			eventsTopicsExpertsConnectionsResult,
			topicsTestimoniesConnectionsResult,
		] = await Promise.all([
			getAllTopicsExpertsConnections(),
			getAllEventsExpertsConnections(),
			getAllOrganizationsMembers(),
			getAllEventsTopicsExpertsConnections(),
			getAllTopicsTestimoniesConnections(),
		]);

		return {
			topicsExpertsConnections: topicsExpertsConnectionsResult.records,
			eventsExpertsConnections: eventsExpertsConnectionsResult.records,
			eventsTopicsExpertsConnections:
				eventsTopicsExpertsConnectionsResult.records,
			topicsTestimoniesConnections: topicsTestimoniesConnectionsResult.records,
			organizationsPersonnelConnections: organizationsMembersResult.records,
		};
	} catch (error) {
		console.error("Error fetching join tables:", error);
		// Return empty arrays if there's an error
		return {
			topicsExpertsConnections: [],
			eventsExpertsConnections: [],
			eventsTopicsExpertsConnections: [],
			topicsTestimoniesConnections: [],
			organizationsPersonnelConnections: [],
		};
	}
}

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

	// Type-safe way to access the table
	const xataTable = xata.db[table as keyof DatabaseSchema];

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
				[key: string]: unknown;
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

		const response: XataResponse = await xataTable.getPaginated({
			pagination: { size: size },
		});

		// Extract records and convert to serializable format
		const serializableRecords = response.records.map((record) =>
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
				cursor: response.meta.page?.cursor,
				more: response.meta.page?.more,
			},
		};
	} catch (error) {
		console.error(`Error fetching records from ${table}:`, error);
		throw error;
	}
}

// GraphNode represents a node in the entity network graph
export interface GraphNode {
	id: string;
	label: string;
	data: {
		name: string;
		label: string;
		type: string;
		[key: string]: unknown;
	};
}

// GraphEdge represents an edge in the entity network graph
export interface GraphEdge {
	source: string;
	target: string;
	id: string;
}

export type NetworkGraphPayload = {
	records: {
		topics: TopicsRecord[];
		events: EventsRecord[];
		personnel: PersonnelRecord[];
		testimonies: TestimoniesRecord[];
		organizations: OrganizationsRecord[];
		documents: DocumentsRecord[];
		artifacts: ArtifactsRecord[];
	};
	connections: {
		topicsExpertsConnections: ConnectionResults<EventTopicSubjectMatterExpertsRecord>;
		eventsExpertsConnections: ConnectionResults<EventSubjectMatterExpertsRecord>;
		eventsTopicsExpertsConnections: ConnectionResults<EventTopicSubjectMatterExpertsRecord>;
		topicsTestimoniesConnections: ConnectionResults<TopicsTestimoniesRecord>;
		organizationsPersonnelConnections: ConnectionResults<OrganizationMembersRecord>;
	};
	graphData: {
		nodes: GraphNode[];
		links: GraphEdge[];
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

		const records = {
			topics: topics.records,
			events: events.records,
			personnel: personnel.records,
			testimonies: testimonies.records,
			organizations: organizations.records,
			documents: documents.records,
			artifacts: artifacts.records,
		};

		const topicsNodes = records.topics.map((record) =>
			formatGraphNode({ record, type: "topics" }),
		);
		const eventsNodes = records.events.map((record) =>
			formatGraphNode({ record, type: "events" }),
		);
		const personnelNodes = records.personnel.map((record) =>
			formatGraphNode({ record, type: "personnel" }),
		);
		const testimoniesNodes = records.testimonies.map((record) =>
			formatGraphNode({ record, type: "testimonies" }),
		);

		const organizationsNodes = records.organizations.map((record) =>
			formatGraphNode({ record, type: "organizations" }),
		);

		const documentsNodes = records.documents.map((record) =>
			formatGraphNode({ record, type: "documents" }),
		);

		const artifactsNodes = records.artifacts.map((record) =>
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
			topicsExpertsConnections,
			eventsExpertsConnections,
			eventsTopicsExpertsConnections,
			topicsTestimoniesConnections,
			organizationsPersonnelConnections: organizationsMembers,
		};

		// Collect all link records in a flattened format
		const allLinkRecords = [
			...connections.eventsExpertsConnections.records,
			...connections.topicsExpertsConnections.records,
			...connections.eventsTopicsExpertsConnections.records,
			...connections.topicsTestimoniesConnections.records,
			...connections.organizationsPersonnelConnections.records,
		];

		const links = allLinkRecords
			.map(({ id, ...rest }) => {
				const entries = Object.entries(rest);
				if (entries.length < 2) return null;

				const [sourceTypeStr, sourceNodeRaw] = entries[0];
				const [targetTypeStr, targetNodeRaw] = entries[1];

				const sourceNode = sourceNodeRaw as unknown as { id: string };
				const targetNode = targetNodeRaw as unknown as { id: string };

				// Check if source and target nodes exist because occasionally a join record can exist
				// in either table while missing the record referenced by the foreign key
				const sourceNodeExists = sourceNode?.id
					? nodes.find((node) => node.id === sourceNode.id)
					: null;
				const targetNodeExists = targetNode?.id
					? nodes.find((node) => node.id === targetNode.id)
					: null;

				if (sourceNodeExists && targetNodeExists) {
					return formatGraphEdge({ id, sourceNode, targetNode });
				}
				return null;
			})
			.filter(
				(link): link is GraphEdge => !!link && !!link.source && !!link.target,
			);

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
				documents: [],
				artifacts: [],
			},
			connections: {
				topicsExpertsConnections: {
					records: [],
					pagination: { hasNextPage: false },
				},
				eventsExpertsConnections: {
					records: [],
					pagination: { hasNextPage: false },
				},
				eventsTopicsExpertsConnections: {
					records: [],
					pagination: { hasNextPage: false },
				},
				topicsTestimoniesConnections: {
					records: [],
					pagination: { hasNextPage: false },
				},
				organizationsPersonnelConnections: {
					records: [],
					pagination: { hasNextPage: false },
				},
			},
			graphData: {
				nodes: [],
				links: [],
			},
		} as NetworkGraphPayload;
	}
};

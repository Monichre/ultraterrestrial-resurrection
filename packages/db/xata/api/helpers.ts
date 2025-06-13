import { getAllEventTopicSmes as getAllTopicsExpertsConnections } from "../models/event-topic-subject-matter-experts";
import { getAllEventSmes as getAllEventsExpertsConnections } from "../models/event-subject-matter-experts";
import { getAllOrganizationMembers as getAllOrganizationsMembers } from "../models/organization-members";
import { getAllEventTopicSmes as getAllEventsTopicsExpertsConnections } from "../models/event-topic-subject-matter-experts";
import { getAllTopicTestimonies as getAllTopicsTestimoniesConnections } from "../models/topics-testimonies";
import { getAllTestimonies } from "../models/testimonies";
import { getAllTopics } from "../models/topics";
import type {
	EventTopicSubjectMatterExpertsRecord,
	EventSubjectMatterExpertsRecord,
	OrganizationMembersRecord,
	TopicsTestimoniesRecord,
} from "../xata";

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
export interface ConnectionResults<T> {
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

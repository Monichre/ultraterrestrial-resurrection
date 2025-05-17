import { xata } from "../client";
import type { EventSubjectMatterExpertsRecord } from "../xata";

export type EventSmeInput = {
	event: { id: string };
	"subject-matter-expert": { id: string };
};

export type EventSmeUpdateInput = Partial<EventSmeInput> & {
	id: string;
};

export async function getEventSmeById(
	id: string,
): Promise<EventSubjectMatterExpertsRecord | null> {
	return await xata.db.event_subject_matter_experts.read(id);
}

export async function getAllEventSmes(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: EventSubjectMatterExpertsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.event_subject_matter_experts.filter(filter || {});

	if (sort?.length) {
		for (const { column, direction } of sort) {
			query = query.sort(column, direction);
		}
	}

	const result = await query.getPaginated({
		pagination: { size, offset: (page - 1) * size },
	});

	return {
		records: result.records,
		pagination: {
			hasNextPage: result.hasNextPage,
			total: result.pagination?.total,
		},
	};
}

export async function getEventSmesByEventId(
	eventId: string,
): Promise<EventSubjectMatterExpertsRecord[]> {
	return await xata.db.event_subject_matter_experts
		.filter({ "event.id": eventId })
		.getAll();
}

export async function getEventSmesByExpertId(
	expertId: string,
): Promise<EventSubjectMatterExpertsRecord[]> {
	return await xata.db.event_subject_matter_experts
		.filter({ "subject-matter-expert.id": expertId })
		.getAll();
}

export async function createEventSme(
	data: EventSmeInput,
): Promise<EventSubjectMatterExpertsRecord> {
	return await xata.db.event_subject_matter_experts.create(data);
}

export async function updateEventSme({
	id,
	...data
}: EventSmeUpdateInput): Promise<EventSubjectMatterExpertsRecord | null> {
	return await xata.db.event_subject_matter_experts.update(id, data);
}

export async function deleteEventSme(id: string): Promise<void> {
	await xata.db.event_subject_matter_experts.delete(id);
}

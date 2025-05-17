import { xata } from "../client";
import type { EventTopicSubjectMatterExpertsRecord } from "../xata";

export type EventTopicSmeInput = {
	event: { id: string };
	topic: { id: string };
	"subject-matter-expert": { id: string };
};

export type EventTopicSmeUpdateInput = Partial<EventTopicSmeInput> & {
	id: string;
};

export async function getEventTopicSmeById(
	id: string,
): Promise<EventTopicSubjectMatterExpertsRecord | null> {
	return await xata.db.event_topic_subject_matter_experts.read(id);
}

export async function getAllEventTopicSmes(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: EventTopicSubjectMatterExpertsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.event_topic_subject_matter_experts.filter(filter || {});

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

export async function getEventTopicSmesByEventId(
	eventId: string,
): Promise<EventTopicSubjectMatterExpertsRecord[]> {
	return await xata.db.event_topic_subject_matter_experts
		.filter({ "event.id": eventId })
		.getAll();
}

export async function getEventTopicSmesByTopicId(
	topicId: string,
): Promise<EventTopicSubjectMatterExpertsRecord[]> {
	return await xata.db.event_topic_subject_matter_experts
		.filter({ "topic.id": topicId })
		.getAll();
}

export async function getEventTopicSmesByExpertId(
	expertId: string,
): Promise<EventTopicSubjectMatterExpertsRecord[]> {
	return await xata.db.event_topic_subject_matter_experts
		.filter({ "subject-matter-expert.id": expertId })
		.getAll();
}

export async function createEventTopicSme(
	data: EventTopicSmeInput,
): Promise<EventTopicSubjectMatterExpertsRecord> {
	return await xata.db.event_topic_subject_matter_experts.create(data);
}

export async function updateEventTopicSme({
	id,
	...data
}: EventTopicSmeUpdateInput): Promise<EventTopicSubjectMatterExpertsRecord | null> {
	return await xata.db.event_topic_subject_matter_experts.update(id, data);
}

export async function deleteEventTopicSme(id: string): Promise<void> {
	await xata.db.event_topic_subject_matter_experts.delete(id);
}

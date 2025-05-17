import { xata } from "../client";
import type { TopicSubjectMatterExpertsRecord } from "../xata";

export type TopicSmeInput = {
	topic: { id: string };
	"subject-matter-expert": { id: string };
};

export type TopicSmeUpdateInput = Partial<TopicSmeInput> & {
	id: string;
};

export async function getTopicSmeById(
	id: string,
): Promise<TopicSubjectMatterExpertsRecord | null> {
	return await xata.db.topic_subject_matter_experts.read(id);
}

export async function getAllTopicSmes(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: TopicSubjectMatterExpertsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.topic_subject_matter_experts.filter(filter || {});

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

export async function getTopicSmesByTopicId(
	topicId: string,
): Promise<TopicSubjectMatterExpertsRecord[]> {
	return await xata.db.topic_subject_matter_experts
		.filter({ "topic.id": topicId })
		.getAll();
}

export async function getTopicSmesByExpertId(
	expertId: string,
): Promise<TopicSubjectMatterExpertsRecord[]> {
	return await xata.db.topic_subject_matter_experts
		.filter({ "subject-matter-expert.id": expertId })
		.getAll();
}

export async function createTopicSme(
	data: TopicSmeInput,
): Promise<TopicSubjectMatterExpertsRecord> {
	return await xata.db.topic_subject_matter_experts.create(data);
}

export async function updateTopicSme({
	id,
	...data
}: TopicSmeUpdateInput): Promise<TopicSubjectMatterExpertsRecord | null> {
	return await xata.db.topic_subject_matter_experts.update(id, data);
}

export async function deleteTopicSme(id: string): Promise<void> {
	await xata.db.topic_subject_matter_experts.delete(id);
}

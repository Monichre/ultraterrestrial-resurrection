import { xata } from "../client";
import type { TopicsTestimoniesRecord } from "../xata";

export type TopicTestimonyInput = {
	topic: { id: string };
	testimony: { id: string };
};

export type TopicTestimonyUpdateInput = Partial<TopicTestimonyInput> & {
	id: string;
};

export async function getTopicTestimonyById(
	id: string,
): Promise<TopicsTestimoniesRecord | null> {
	return await xata.db["topics-testimonies"].read(id);
}

export async function getAllTopicTestimonies(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: TopicsTestimoniesRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db["topics-testimonies"].filter(filter || {});

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

export async function getTopicTestimoniesByTopicId(
	topicId: string,
): Promise<TopicsTestimoniesRecord[]> {
	return await xata.db["topics-testimonies"]
		.filter({ "topic.id": topicId })
		.getAll();
}

export async function getTopicTestimoniesByTestimonyId(
	testimonyId: string,
): Promise<TopicsTestimoniesRecord[]> {
	return await xata.db["topics-testimonies"]
		.filter({ "testimony.id": testimonyId })
		.getAll();
}

export async function createTopicTestimony(
	data: TopicTestimonyInput,
): Promise<TopicsTestimoniesRecord> {
	return await xata.db["topics-testimonies"].create(data);
}

export async function updateTopicTestimony({
	id,
	...data
}: TopicTestimonyUpdateInput): Promise<TopicsTestimoniesRecord | null> {
	return await xata.db["topics-testimonies"].update(id, data);
}

export async function deleteTopicTestimony(id: string): Promise<void> {
	await xata.db["topics-testimonies"].delete(id);
}

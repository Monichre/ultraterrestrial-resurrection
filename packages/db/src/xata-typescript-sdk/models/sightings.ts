import { xata } from "../client";
import type { SightingsRecord } from "../xata";

export type SightingInput = {
	date?: string;
	description?: string;
	location?: string;
	"witness-name"?: string;
	"witness-credibility"?: number;
	"object-shape"?: string;
	"object-size"?: string;
	"object-color"?: string;
	"object-movement"?: string;
	"object-sound"?: string;
	duration?: string;
	weather?: string;
	"time-of-day"?: string;
	"number-of-witnesses"?: number;
	"physical-evidence"?: string;
	photos?: any[];
	videos?: any[];
	verified?: boolean;
	"verification-notes"?: string;
	"government-acknowledgment"?: boolean;
	embedding?: number[];
	latitude?: number;
	longitude?: number;
};

export type SightingUpdateInput = Partial<SightingInput> & {
	id: string;
};

export async function getSightingById(
	id: string,
): Promise<SightingsRecord | null> {
	return await xata.db.sightings.read(id);
}

export async function getAllSightings(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: SightingsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.sightings.filter(filter || {});

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

export async function createSighting(
	data: SightingInput,
): Promise<SightingsRecord> {
	return await xata.db.sightings.create(data);
}

export async function updateSighting({
	id,
	...data
}: SightingUpdateInput): Promise<SightingsRecord | null> {
	return await xata.db.sightings.update(id, data);
}

export async function deleteSighting(id: string): Promise<void> {
	await xata.db.sightings.delete(id);
}

export async function searchSightings(
	query: string,
	limit = 10,
): Promise<SightingsRecord[]> {
	const results = await xata.search.all(query, {
		tables: [
			{
				table: "sightings",
				target: [
					"description",
					"location",
					"witness-name",
					"object-shape",
					"object-color",
					"object-movement",
				],
			},
		],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return results.records as SightingsRecord[];
}

export async function getSightingsByLocation(
	latitude: number,
	longitude: number,
	radiusKm: number = 50,
): Promise<SightingsRecord[]> {
	// This is a simplified implementation. In a real app, you'd use proper geospatial queries
	// For now, we'll filter by approximate lat/lng ranges
	const latRange = radiusKm / 111; // Rough conversion: 1 degree lat ≈ 111 km
	const lngRange = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

	return await xata.db.sightings
		.filter({
			latitude: { $ge: latitude - latRange, $le: latitude + latRange },
			longitude: { $ge: longitude - lngRange, $le: longitude + lngRange },
		})
		.getAll();
}

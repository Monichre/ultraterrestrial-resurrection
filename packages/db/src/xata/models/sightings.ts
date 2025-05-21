import { getXataClient, type SightingsRecord } from "../xata";

export type SightingInput = {
	date?: Date;
	description?: string;
	media_link?: string;
	city?: string;
	state?: string;
	country?: string;
	shape?: string;
	duration_seconds?: string;
	duration_hours_min?: string;
	comments?: string;
	date_posted?: Date;
	latitude?: number;
	longitude?: number;
	media?: string[];
};

export type SightingUpdateInput = Partial<SightingInput> & {
	id: string;
};

export async function getSightingById(
	id: string,
): Promise<SightingsRecord | null> {
	const xata = getXataClient();
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
	const xata = getXataClient();
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
	const xata = getXataClient();
	return await xata.db.sightings.create(data);
}

export async function updateSighting({
	id,
	...data
}: SightingUpdateInput): Promise<SightingsRecord | null> {
	const xata = getXataClient();
	return await xata.db.sightings.update(id, data);
}

export async function deleteSighting(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.sightings.delete(id);
}

export async function searchSightings(
	query: string,
	limit = 10,
): Promise<SightingsRecord[]> {
	const xata = getXataClient();
	const results = await xata.search.all(query, {
		tables: [
			{
				table: "sightings",
				target: [
					"description",
					"comments",
					"city",
					"state",
					"country",
					"shape",
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
	lat: number,
	lng: number,
	radiusKm: number,
): Promise<SightingsRecord[]> {
	const xata = getXataClient();

	// Convert radius from km to degrees (approximately)
	// 1 degree of latitude = ~111 km, 1 degree of longitude varies with latitude
	const latRadius = radiusKm / 111;
	const lngRadius = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

	const records = await xata.db.sightings
		.filter({
			latitude: { $ge: lat - latRadius, $le: lat + latRadius },
			longitude: { $ge: lng - lngRadius, $le: lng + lngRadius },
		})
		.getAll();

	// For more accurate radius filtering, we calculate actual distance
	return records.filter((record) => {
		if (record.latitude && record.longitude) {
			const distance = calculateDistance(
				lat,
				lng,
				record.latitude,
				record.longitude,
			);
			return distance <= radiusKm;
		}
		return false;
	});
}

// Haversine formula to calculate distance between two points
function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371; // Radius of the Earth in km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

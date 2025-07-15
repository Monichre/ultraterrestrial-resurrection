import { xata } from "../client";
import type { UsersRecord } from "../xata";

export type UserInput = {
	email: string;
	name?: string;
	avatar?: string;
	"clerk-id"?: string;
};

export type UserUpdateInput = Partial<UserInput> & {
	id: string;
};

export async function getUserById(id: string): Promise<UsersRecord | null> {
	return await xata.db.users.read(id);
}

export async function getUserByEmail(
	email: string,
): Promise<UsersRecord | null> {
	return await xata.db.users.filter({ email }).getFirst();
}

export async function getUserByClerkId(
	clerkId: string,
): Promise<UsersRecord | null> {
	return await xata.db.users.filter({ "clerk-id": clerkId }).getFirst();
}

export async function getAllUsers(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: UsersRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.users.filter(filter || {});

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

export async function createUser(data: UserInput): Promise<UsersRecord> {
	return await xata.db.users.create(data);
}

export async function updateUser({
	id,
	...data
}: UserUpdateInput): Promise<UsersRecord | null> {
	return await xata.db.users.update(id, data);
}

export async function deleteUser(id: string): Promise<void> {
	await xata.db.users.delete(id);
}

export async function searchUsers(
	query: string,
	limit = 10,
): Promise<UsersRecord[]> {
	const results = await xata.search.all(query, {
		tables: [{ table: "users", target: ["name", "email"] }],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return results.records as UsersRecord[];
}

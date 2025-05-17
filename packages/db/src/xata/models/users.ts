import { getXataClient, type UsersRecord } from "../xata";

export type UserInput = {
	email: string;
	name?: string;
	photo?: string;
	profile_image_url?: string;
	external_id?: string;
};

export type UserUpdateInput = Partial<Omit<UserInput, "email">> & {
	id: string;
};

export async function getUserById(id: string): Promise<UsersRecord | null> {
	const xata = getXataClient();
	return await xata.db.users.read(id);
}

export async function getUserByEmail(
	email: string,
): Promise<UsersRecord | null> {
	const xata = getXataClient();
	const users = await xata.db.users.filter({ email }).getAll();
	return users.length > 0 ? users[0] : null;
}

export async function getUserByExternalId(
	externalId: string,
): Promise<UsersRecord | null> {
	const xata = getXataClient();
	const users = await xata.db.users
		.filter({ external_id: externalId })
		.getAll();
	return users.length > 0 ? users[0] : null;
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
	const xata = getXataClient();
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
	const xata = getXataClient();
	return await xata.db.users.create(data);
}

export async function updateUser({
	id,
	...data
}: UserUpdateInput): Promise<UsersRecord | null> {
	const xata = getXataClient();
	return await xata.db.users.update(id, data);
}

export async function deleteUser(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.users.delete(id);
}

export async function findOrCreateUser(
	userData: UserInput,
): Promise<UsersRecord> {
	const xata = getXataClient();

	// Try to find by email first
	let user = await getUserByEmail(userData.email);

	// If no user found and external_id is provided, try to find by external_id
	if (!user && userData.external_id) {
		user = await getUserByExternalId(userData.external_id);
	}

	// If user exists, update their info
	if (user) {
		const updatedUser = await xata.db.users.update(user.id, {
			name: userData.name || user.name,
			photo: userData.photo || user.photo,
			profile_image_url: userData.profile_image_url || user.profile_image_url,
			external_id: userData.external_id || user.external_id,
		});
		return updatedUser!;
	}

	// Otherwise create a new user
	return await createUser(userData);
}

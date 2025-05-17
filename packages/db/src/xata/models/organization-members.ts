import { xata } from "../client";
import type { OrganizationMembersRecord } from "../xata";

export type OrganizationMemberInput = {
	member: { id: string };
	organization: { id: string };
};

export type OrganizationMemberUpdateInput = Partial<OrganizationMemberInput> & {
	id: string;
};

export async function getOrganizationMemberById(
	id: string,
): Promise<OrganizationMembersRecord | null> {
	return await xata.db["organization-members"].read(id);
}

export async function getAllOrganizationMembers(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: OrganizationMembersRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db["organization-members"].filter(filter || {});

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

export async function getOrganizationMembersByOrganizationId(
	organizationId: string,
): Promise<OrganizationMembersRecord[]> {
	return await xata.db["organization-members"]
		.filter({ "organization.id": organizationId })
		.getAll();
}

export async function getOrganizationMembersByMemberId(
	memberId: string,
): Promise<OrganizationMembersRecord[]> {
	return await xata.db["organization-members"]
		.filter({ "member.id": memberId })
		.getAll();
}

export async function createOrganizationMember(
	data: OrganizationMemberInput,
): Promise<OrganizationMembersRecord> {
	return await xata.db["organization-members"].create(data);
}

export async function updateOrganizationMember({
	id,
	...data
}: OrganizationMemberUpdateInput): Promise<OrganizationMembersRecord | null> {
	return await xata.db["organization-members"].update(id, data);
}

export async function deleteOrganizationMember(id: string): Promise<void> {
	await xata.db["organization-members"].delete(id);
}

import { xata } from "../client";
import type { OrganizationsRecord } from "../xata";

export type OrganizationInput = {
  name: string;
  specialization?: string;
  description?: string;
  photo?: string;
  image?: string;
  title: string;
  embedding?: number[];
};

export type OrganizationUpdateInput = Partial<OrganizationInput> & {
  id: string;
};

export async function getOrganizationById(
  id: string,
): Promise<OrganizationsRecord | null> {
  return await xata.db.organizations.read(id);
}

export async function getAllOrganizations(options?: {
  filter?: Record<string, any>;
  sort?: { column: string; direction: "asc" | "desc" }[];
  page?: number;
  size?: number;
}): Promise<{
  records: OrganizationsRecord[];
  pagination: { hasNextPage: boolean; total?: number };
}> {
  const { filter, sort, page = 1, size = 50 } = options || {};

  let query = xata.db.organizations.filter(filter || {});

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

export async function createOrganization(
  data: OrganizationInput,
): Promise<OrganizationsRecord> {
  return await xata.db.organizations.create(data);
}

export async function updateOrganization({
  id,
  ...data
}: OrganizationUpdateInput): Promise<OrganizationsRecord | null> {
  return await xata.db.organizations.update(id, data);
}

export async function deleteOrganization(id: string): Promise<void> {
  await xata.db.organizations.delete(id);
}

export async function searchOrganizations(
  query: string,
  limit = 10,
): Promise<OrganizationsRecord[]> {
  const results = await xata.search.all(query, {
    tables: [
      {
        table: "organizations",
        target: ["name", "description", "specialization"],
      },
    ],
    fuzziness: 1,
    prefix: "phrase",
    limit,
  });

  return results.records as OrganizationsRecord[];
}
import { xata } from "../client";
import type { PersonnelRecord } from "../xata";

export type PersonnelInput = {
  bio?: string;
  role?: string;
  photo?: string[];
  rank?: number;
  credibility?: number;
  popularity?: number;
  name: string;
  authority?: number;
  embedding?: number[];
};

export type PersonnelUpdateInput = Partial<PersonnelInput> & {
  id: string;
};

export async function getPersonnelById(
  id: string,
): Promise<PersonnelRecord | null> {
  return await xata.db.personnel.read(id);
}

export async function getAllPersonnel(options?: {
  filter?: Record<string, any>;
  sort?: { column: string; direction: "asc" | "desc" }[];
  page?: number;
  size?: number;
}): Promise<{
  records: PersonnelRecord[];
  pagination: { hasNextPage: boolean; total?: number };
}> {
  const { filter, sort, page = 1, size = 50 } = options || {};

  let query = xata.db.personnel.filter(filter || {});

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

export async function createPersonnel(
  data: PersonnelInput,
): Promise<PersonnelRecord> {
  return await xata.db.personnel.create(data);
}

export async function updatePersonnel({
  id,
  ...data
}: PersonnelUpdateInput): Promise<PersonnelRecord | null> {
  return await xata.db.personnel.update(id, data);
}

export async function deletePersonnel(id: string): Promise<void> {
  await xata.db.personnel.delete(id);
}

export async function searchPersonnel(
  query: string,
  limit = 10,
): Promise<PersonnelRecord[]> {
  const results = await xata.search.all(query, {
    tables: [{ table: "personnel", target: ["name", "bio", "role"] }],
    fuzziness: 1,
    prefix: "phrase",
    limit,
  });

  return results.records as PersonnelRecord[];
}
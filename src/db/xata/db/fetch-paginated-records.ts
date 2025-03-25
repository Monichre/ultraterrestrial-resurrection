import { xata } from "@/db/xata/client";

export const fetchPaginatedRecords = async ({
	table,
	size = 3,
}: { table: string; size: number }) => {
	const res = await xata.db[table].select("*").getPaginated({
		pagination: {
			size,
		},
	});
	return res?.records;
};

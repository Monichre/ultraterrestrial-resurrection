// export const summarizeRecordConnections = async ({
import { askXataWithAi, askXata } from "./ask";
import { searchXata } from "./search";
import {
	fetchRecords,
	xataToXYFlow,
	initiateStreamingQuery,
	transformStreamResponse,
} from "./xata-to-xyflow";
// 	id,
// 	table,
// 	columns,
// }: { id: string; table: string; columns: string[] }) => {
// 	const summary = await xata.db[table].summarize({
// 		columns: [
// 			"settings.*", // group by all columns in the `settings` object
// 			"username", // group by the username field
// 			"user.hobbies.name", // group by a linked column
// 		],
// 	});
// };

export const xataService = {
	askXataWithAi,
	askXata,
	searchXata,
	fetchRecords,
	xataToXYFlow,
	initiateStreamingQuery,
	transformStreamResponse,
};

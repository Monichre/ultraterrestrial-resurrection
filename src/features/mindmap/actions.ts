"use server";

import { askXataWithAi, xata } from "@/db/xata";

const tables = [
	{ table: "topics" },
	{ table: "personnel" },
	{ table: "events" },
	{ table: "organizations" },
	{ table: "sightings" },
	{ table: "event-subject-matter-experts" },
	{ table: "topic-subject-matter-experts" },
	{ table: "organization-members" },
	{ table: "testimonies" },
	{ table: "topics-testimonies" },
	{ table: "documents" },
	// { table: "locations" },
	{ table: "event-topic-subject-matter-experts" },
	// { table: "users" },
	// { table: "user-saved-events" },
	// { table: "user-saved-topics" },
	// { table: "user-saved-key-figure" },
	// { table: "user-saved-testimonies" },
	// { table: "user-saved-documents" },
	// { table: "user-theories" },
	// { table: "user-saved-organizations" },
	// { table: "user-saved-sightings" },
	{ table: "tags" },
	{ table: "theories" },
	{ table: "mindmaps" },
	{ table: "artifacts" },
	{ table: "case-files" },
];

export const askAIAction = async ({ question, prompt, table }: any) => {
	try {
		const dbResponse = await askXataWithAi({ question, table, prompt });
		console.log("dbResponse: ", dbResponse);
		const plainData = JSON.parse(JSON.stringify(dbResponse));
		console.log("plainData: ", plainData);
		// const assistantResponse = await askDisclosureAgentToFindRelatedRecords( { subject: question, type: table } )
		// !TODO: figure out how to process the response
		const response = {
			...plainData,
			// assistantResponse
		};
		console.log("response: ", response);
		return response;
	} catch (error) {
		console.error("Error in askAIAction:", error);
		throw error;
	}
};

// closeModelMenu;

export const searchXataConnections = async ({
	query,
	id = null,
	table = null,
}: any) => {
	// Generated with CL
	// const {
	// 	answer,
	// 	records: recordIds,
	// 	sessionId,
	// } = await xata.db.personnel.ask(
	// 	`Find all linked records to ${name} with xata id ${id}. Be sure to check joining tables and linked columns`,
	// 	{
	// 		headers: {
	// 			Accept: "text/event-stream",
	// 		},
	// 	},
	// );
	// console.log(
	// 	"🚀 ~ file: actions.ts:61 ~ searchAllConnections ~ sessionId:",
	// 	sessionId,
	// );

	// console.log(
	// 	"🚀 ~ file: actions.ts:68 ~ searchAllConnections ~ recordIds:",
	// 	recordIds,
	// );

	// console.log(
	// 	"🚀 ~ file: actions.ts:68 ~ searchAllConnections ~ answer:",
	// 	answer,
	// );

	// console.log(record);
	const response = await xata.search.all(query, {
		tables: table ? [{ table: `${table}` }] : tables,
		fuzziness: 0,
		prefix: "phrase",
	});

	console.log("🚀 ~ searchXataConnections ~ response:", response);

	return {
		enrichedResponse: {
			answer,
			recordIds,
			sessionId,
		},
		searchResults: records,
	};
};

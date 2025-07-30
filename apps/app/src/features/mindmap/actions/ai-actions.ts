"use server";

import OpenAI from "openai";
import { revalidatePath } from "next/cache";
import { askXataWithAi } from "@db/src/xata-typescript-sdk/api"

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY || "",
});

interface EnhanceLayoutParams {
	entities: any[];
	sourceNodeId: string;
	entityType: string;
}

/**
 * Server action to enhance layout using OpenAI
 */
export async function enhanceLayoutWithAI({
	entities,
	sourceNodeId,
	entityType,
}: EnhanceLayoutParams) {
	// If no OpenAI API key, return basic positions
	if (!process.env.OPENAI_API_KEY) {
		console.warn("No OpenAI API key found. Falling back to basic layout.");
		return {
			success: false,
			error: "OpenAI API key not configured",
		};
	}

	try {
		// Limit to 10 entities for API performance
		const entitiesToProcess = entities.slice(0, 10);

		// Use OpenAI to analyze entities and suggest optimal layout
		const completion = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content: `You are an AI assistant that helps organize data visualizations for mind maps. 
          Given a set of entities, suggest optimal positions for displaying them in a graph, 
          centered around (0,0). Also analyze relationships between entities and provide insights.`,
				},
				{
					role: "user",
					content: `I need to position these ${entityType} entities on a graph:
          ${JSON.stringify(entitiesToProcess, null, 2)}
          
          They connect to a source node with ID: ${sourceNodeId}
          
          Please analyze their attributes and return:
          1. Optimal x,y positions for each entity (keyed by entity.id)
          2. A summary of what you discovered
          3. Relationships between entities (by entity.id)
          4. Insights about patterns or significant findings
          
          Return a JSON object with:
          - positions: {entityId: {x: number, y: number}}
          - summary: string
          - relationships: {entityId: {type: string, strength: number, description: string}}
          - insights: [{text: string, type: string, importance: string}]
          `,
				},
			],
			response_format: { type: "json_object" },
		});

		// Get the suggested layout
		const result = JSON.parse(completion.choices[0].message.content || "{}");

		return {
			success: true,
			positions: result.positions || {},
			summary: result.summary || `Analysis of ${entityType} records`,
			relationships: result.relationships || {},
			insights: result.insights || [],
		};
	} catch (error) {
		console.error("Error generating layout suggestions:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export const askAIAction = async ({ question, rules, table }: AskParams) => {
	try {
		const dbResponse = await askXataWithAi({ question, table, rules });
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

import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { z } from "zod";
import {buildPrompt, NER_RESPONSE_STRUCTURE_FORMAT, PROMETHEUS_PROMPT, DAEDALUS_PROMPT} from "@/lib"



export async function POST(req: Request) {
  const { messages, framework = "prometheus", additionalInstructions } = await req.json();

  // Select the appropriate prompt based on the framework parameter
  const systemPrompt = framework.toLowerCase() === "daedalus" 
    ? DAEDALUS_PROMPT 
    : PROMETHEUS_PROMPT;

const structurePrompt = NER_RESPONSE_STRUCTURE_FORMAT
const fullPrompt = buildPrompt({systemPrompt, structurePrompt})
  const result = streamText({
    toolCallStreaming: true,
    prompt: fullPrompt,
    additionalInstructions,
    model: anthropic("claude-3-7-sonnet-latest"),
    messages,
    tools: {
      // Illuminate tool - for connecting patterns and relationships
      illuminate: {
        description: "Connect patterns, relationships, and hidden links between different pieces of information, entities, events, or concepts.",
        parameters: z.object({
          query: z
            .string()
            .describe("The query or context to connect the dots on."),
          entities: z
            .array(z.string())
            .optional()
            .describe("Specific entities to analyze connections between."),
          depth: z
            .number()
            .optional()
            .describe("How deep to go in the analysis (1-5, with 5 being the most detailed)."),
        }),
        execute: async ({
          query,
          entities = [],
          depth = 3,
        }: {
          query: string;
          entities?: string[];
          depth?: number;
        }) => {
          // Implementation logic for finding connections
          // This would typically involve:
          // 1. Analyzing the query and entities
          // 2. Searching for relationships in a knowledge base
          // 3. Identifying patterns and connections
          
          // Mock response for now
          const connectionTypes = ["temporal", "spatial", "causal", "conceptual", "organizational"];
          const randomConnection = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
          
          return {
            connections: [
              {
                type: randomConnection,
                strength: Math.floor(Math.random() * 100),
                description: `Found a ${randomConnection} connection between ${entities.length > 1 ? entities.join(" and ") : "elements in your query"}.`,
                evidence: `Based on pattern analysis of the provided information regarding: ${query}`,
              }
            ],
            analysisDepth: depth,
            entityCount: entities.length || "derived from context",
          };
        },
      },
      
      // Summarize tool - for creating concise summaries
      summarize: {
        description: "Create a structured summary of the provided text or conversation according to the knowledge framework.",
        parameters: z.object({
          text: z
            .string()
            .describe("The text to be summarized."),
          format: z
            .enum(["brief", "detailed", "technical", "layered"])
            .optional()
            .describe("The format of the summary."),
        }),
        execute: async ({
          text,
          format = "detailed",
        }: {
          text: string;
          format?: "brief" | "detailed" | "technical" | "layered";
        }) => {
          // Implementation for creating summaries based on the specified framework
          // This would typically involve:
          // 1. Analyzing the text
          // 2. Extracting key information
          // 3. Structuring according to the framework
          
          // Mock implementation
          const textLength = text.length;
          const wordCount = text.split(/\s+/).length;
          
          return {
            summary: `This is a structured ${format} summary of the provided text.`,
            keyEntities: ["Entity1", "Entity2", "Entity3"],
            keyRelationships: ["Relationship1", "Relationship2"],
            originalLength: textLength,
            wordCount: wordCount,
            compressionRatio: `${Math.floor((300 / wordCount) * 100)}%`,
          };
        },
      },
      
      // Contextualize tool - for providing additional context
      contextualize: {
        description: "Provide additional context or background for the given topic or text within the research framework.",
        parameters: z.object({
          topic: z
            .string()
            .describe("The topic or text to provide context for."),
          contextLevel: z
            .enum(["historical", "technical", "cultural", "comprehensive"])
            .optional()
            .describe("The type of context to provide."),
        }),
        execute: async ({
          topic,
          contextLevel = "comprehensive",
        }: {
          topic: string;
          contextLevel?: "historical" | "technical" | "cultural" | "comprehensive";
        }) => {
          // Implementation for providing context based on the framework
          // This would typically involve:
          // 1. Analyzing the topic
          // 2. Retrieving relevant background information
          // 3. Structuring it according to the framework
          
          // Mock implementation
          return {
            contextualInformation: `Here is ${contextLevel} context for: ${topic}`,
            relatedTopics: ["RelatedTopic1", "RelatedTopic2", "RelatedTopic3"],
            sourceTypes: ["academic", "documentary", "testimonial"],
            confidenceLevel: "medium",
          };
        },
      },

      // Client-side tool for user confirmation
      askForConfirmation: {
        description: "Ask the user for confirmation or additional information.",
        parameters: z.object({
          message: z.string().describe("The message to ask for confirmation."),
          options: z.array(z.string()).optional().describe("Optional list of choices to present to the user."),
          requiresInput: z.boolean().optional().describe("Whether the confirmation requires text input."),
        }),
      },
    },
  });

  return result.toDataStreamResponse();
}

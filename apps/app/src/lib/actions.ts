"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { parallelProcessingSchema } from "./schema";
import { checkRateLimit } from "./rate-limit";
import { headers } from "next/headers";

/**
 * Business Feature Analysis Server Action
 *
 * Implements concurrent feature analysis from business team perspectives:
 * - Marketing: Focus on user acquisition, positioning, and market appeal
 * - Product: Focus on user experience, feature value, and product strategy
 * - Technical: Focus on implementation complexity, architecture, and feasibility
 *
 * @param content - Feature description to analyze
 * @returns Object with success status, error message (if any), and data
 */
export async function parallelProcessing(content: string) {
  try {
    // Rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = `ai-agents-parallel-processing-${ip}`;
    const { success } = await checkRateLimit(identifier);

    if (!success) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
        data: null,
      };
    }

    const totalUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

    // Configure business team analysis tasks
    const tasks = [
      {
        name: "Marketing",
        prompt: `As a marketing team member, analyze this feature from a marketing perspective. Focus on:
- Target audience and user acquisition potential
- Market positioning and competitive advantages
- Marketing messaging and value proposition
- Go-to-market strategy and launch considerations
- User engagement and retention potential`,
        icon: "megaphone",
        color: "blue",
      },
      {
        name: "Product",
        prompt: `As a product manager, analyze this feature from a product perspective. Focus on:
- User experience and usability considerations
- Feature value and user benefit
- Product strategy alignment and roadmap fit
- User journey and workflow integration
- Success metrics and KPIs`,
        icon: "target",
        color: "green",
      },
      {
        name: "Technical",
        prompt: `As a technical lead, analyze this feature from a technical perspective. Focus on:
- Implementation complexity and technical feasibility
- Architecture and system design considerations
- Performance and scalability implications
- Security and compliance requirements
- Development timeline and resource needs`,
        icon: "code",
        color: "purple",
      },
    ];

    // Execute all analysis tasks concurrently
    const results = await Promise.all(
      tasks.map(async (task) => {
        const { text, usage } = await generateText({
          model: openai("gpt-4o-mini"),
          system: `You are performing the "${task.name}" task. Focus on providing clear, concise, and insightful analysis from this perspective.`,
          prompt: `${task.prompt}\n\n${content}`,
        });

        if (usage) {
          totalUsage.inputTokens += usage.inputTokens;
          totalUsage.outputTokens += usage.outputTokens;
          totalUsage.totalTokens += usage.totalTokens;
        }

        return {
          task: task.name,
          result: text,
          icon: task.icon,
          color: task.color,
        };
      }),
    );

    const result = {
      results,
      metadata: {
        inputLength: content.length,
        processedAt: new Date().toISOString(),
        workers: tasks.length,
        perspectives: ["marketing", "product", "technical"],
      },
      usage: totalUsage,
    };

    // Validate the result against the schema
    const validatedResult = parallelProcessingSchema.parse(result);

    return {
      success: true,
      error: null,
      data: validatedResult,
    };
  } catch (error) {
    console.error("Error in parallelProcessing action:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process content in parallel",
      data: null,
    };
  }
}

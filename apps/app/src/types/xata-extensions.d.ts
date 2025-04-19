export type { BaseClientOptions, XataRecord } from "@xata.io/client";

declare module "@xata.io/client" {
	interface SummarizeResultItem<T extends XataRecord, S, C extends string[]> {
		// Allow indexing by column name
		[key: string]: unknown;
	}

	interface SummarizeResult<T extends XataRecord, S, C extends string[]> {
		// Results from summaries
		summaries?: {
			[K in keyof S]?: Record<string, number> | number;
		};
		// Other properties that might be returned
		[key: string]: unknown;
	}

	interface Query<T extends XataRecord, U> {
		summarize<
			S extends Record<string, { count?: string }>,
			C extends string[] = [],
		>(options: {
			filter?: Record<string, unknown>;
			columns?: C;
			summaries?: S;
		}): Promise<SummarizeResult<T, S, C>>;
	}
}

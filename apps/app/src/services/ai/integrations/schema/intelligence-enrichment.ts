import { z } from "zod";

/**
 * Zod schema for the decision output of the intelligence enrichment workflow.
 * Only allows 'proceed' or 'inquire' as valid decisions.
 */
export const nextActionDecisionSchema = z.object({
  decision: z.enum(["proceed", "inquire"]),
}); 
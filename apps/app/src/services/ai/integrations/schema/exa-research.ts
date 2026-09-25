import { z } from "zod";

// Enrichment actions
const researchActions = z.enum([
  "fetchCrunchbase",
  "fetchFinancialReport",
  "fetchFounders",
  "fetchFunding",
  "fetchGithubUrl",
  "fetchPitchbook",
  "fetchTiktok",
  "fetchTracxn",
  "fetchWikipedia",
  "fetchYoutubeVideos",
  "youtubeVideoDetails",
  "findCompetitors",
  "findNews",
  "scrapeLinkedin",
  "scrapeRecentTweets",
  "scrapeTwitterProfile",
  "scrapeReddit",
  "scrapeWebsiteSubPages",
  "scrapeWebsiteUrl"
]);

// Base website research params
export const websiteResearchParamsSchema = z.object({
  websiteUrl: z
    .string()
    .url()
    .describe("The target website URL to research."),
});

// Competitor search params
export const competitorSearchParamsSchema = websiteResearchParamsSchema.extend({
  summaryText: z
    .string()
    .describe("Summary text describing the company to find competitors for."),
});

// Profile search params
export const profileSearchParamsSchema = z.object({
  profile: z
    .string()
    .describe("The profile name or username to search for."),
  websiteUrl: z
    .string()
    .url()
    .describe("The website URL associated with the profile."),
});

// YouTube video params
export const youtubeVideoParamsSchema = z.object({
  videoUrl: z
    .string()
    .url()
    .describe("The YouTube video URL to fetch details for."),
});

// Unified schema for Exa enrichment tool input
export const exaEnrichInputSchema = z
  .object({
    action: researchActions.describe(
      "The enrichment action to perform. Each action retrieves specific data about a company or profile."
    ),
    websiteParams: websiteResearchParamsSchema
      .optional()
      .describe("Parameters for website-based research actions."),
    competitorParams: competitorSearchParamsSchema
      .optional()
      .describe("Parameters for competitor search. Required when action is 'findCompetitors'."),
    profileParams: profileSearchParamsSchema
      .optional()
      .describe("Parameters for profile-based actions (LinkedIn, Twitter)."),
    youtubeParams: youtubeVideoParamsSchema
      .optional()
      .describe("Parameters for YouTube video details. Required when action is 'youtubeVideoDetails'."),
  })
  .refine(
    (data) => {
      // Website-based actions
      const websiteActions = [
        "fetchCrunchbase",
        "fetchFinancialReport",
        "fetchFounders",
        "fetchFunding",
        "fetchGithubUrl",
        "fetchPitchbook",
        "fetchTiktok",
        "fetchTracxn",
        "fetchWikipedia",
        "fetchYoutubeVideos",
        "findNews",
        "scrapeReddit",
        "scrapeWebsiteSubPages",
        "scrapeWebsiteUrl"
      ];
      
      // Profile-based actions
      const profileActions = [
        "scrapeLinkedin",
        "scrapeRecentTweets",
        "scrapeTwitterProfile"
      ];

      if (websiteActions.includes(data.action) && !data.websiteParams) {
        return false;
      }
      if (data.action === "findCompetitors" && !data.competitorParams) {
        return false;
      }
      if (profileActions.includes(data.action) && !data.profileParams) {
        return false;
      }
      if (data.action === "youtubeVideoDetails" && !data.youtubeParams) {
        return false;
      }
      return true;
    },
    {
      message: "The required parameters must be provided based on the chosen action.",
      path: ["action"],
    }
  );
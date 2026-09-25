import type { WebsiteResearchParams, CompetitorSearchParams, TwitterSearchParams } from "../types"

import type { z } from "zod";
import type { baseSearchOptionsSchema } from "../../agents/tools/schema/exa";
import { createExaService, ExaService } from "./exa"


type ExaSearchConfig = z.infer<typeof baseSearchOptionsSchema> & {
  text?: boolean;
  summary?: { query: string };
  livecrawl?: "always" | "never" | "fallback";
  subpages?: number;
  subpageTarget?: string[];
};


/* ------------------------------------------------------------------ *
 * Pure functional helpers – each curried with an Exa instance first  *
 * ------------------------------------------------------------------ */

const withDomain = (domains: string[]) =>
  ({ includeDomains: domains } as ExaSearchConfig);

const withoutDomain = (domains: string[]) =>
  ({ excludeDomains: domains } as ExaSearchConfig);

export const exaResearch = (exa: ExaService) => {
  // Fix for includeText parameter - Exa API expects 'include' not 'includeText'
  const normalizeConfig = (c?: ExaSearchConfig) => {
    if (!c || !(c as any).includeText) return c;
    const { includeText, ...rest } = c as any;
    return { ...rest, include: includeText };
  };

  /* shorthand wrappers that adapt to the new API */
  const S = (q: string, c?: ExaSearchConfig) => exa.search({ 
    query: q, 
    searchOptions: normalizeConfig(c)
  });
  const SC = (q: string, c?: ExaSearchConfig) => exa.searchAndContents({ 
    query: q, 
    searchOptions: normalizeConfig(c),
    contentOptions: {
      text: c?.text,
      summary: c?.summary,
      livecrawl: c?.livecrawl,
      subpages: c?.subpages,
      subpageTarget: c?.subpageTarget,
    }
  });
  const G = (urls: string[], c?: ExaSearchConfig) => exa.getContents({ 
    urls, 
    contentOptions: {
      text: c?.text,
      summary: c?.summary,
      livecrawl: c?.livecrawl,
    }
  });

  /* reusable generator for “${site} profile” type look-ups */
  /**
   * Generic profile search generator for a given domain and keyword.
   * Enhanced to support special cases for LinkedIn, Twitter, etc.
   * Accepts optional overrides for query and config.
   */
  /**
   * Generic profile search generator for a given domain and keyword.
   * Accepts a "profile" conditional argument to adjust query/config for special cases.
   */
  const profile =
    (
      domain: string,
      keyword: string,
      opts?: {
        queryOverride?: (params: WebsiteResearchParams & { profile?: string }) => string;
        configOverride?: (params: WebsiteResearchParams & { profile?: string }) => Partial<ExaSearchConfig>;
      }
    ) =>
    ({
      websiteUrl,
      profile,
    }: { websiteUrl: string; profile?: string }) => {
      // Allow query/config override to use profileType if needed
      let query = opts?.queryOverride
        ? opts.queryOverride({ websiteUrl, profile })
        : `${websiteUrl} ${keyword}:`;

      let config: ExaSearchConfig = {
        type: "keyword",
        numResults: 1,
        ...withDomain([domain]),
        includeText: [websiteUrl],
        ...(opts?.configOverride ? opts.configOverride({ websiteUrl, profile }) : {}),
      };

      // Special handling for LinkedIn and Twitter, using profileType if provided
      if (domain === "linkedin.com" && (!profile || profile === "company")) {
        config = {
          ...config,
          includeText: [
            websiteUrl,
            "linkedin.com/company",
            "linkedin.com/in",
            "linkedin.com/pub",
          ],
          numResults: 3,
        };
        query = profile 
          ? `${profile} founder LinkedIn profile:`
          : `${profile} official LinkedIn profile:`;
      }

      if (domain === "twitter.com" && (!profile || profile === "company")) {
        config = {
          ...config,
          includeText: [
            websiteUrl,
            "twitter.com/",
            "twitter.com/intent",
            "twitter.com/i",
          ],
          numResults: 3,
        };
        query = profile 
          ? `${profile} founder Twitter profile:`
          : `${profile} official Twitter profile:`;
      }

      return S(query, config);
    };

  /* ---------------- concrete exported queries ---------------- */
  const fetchCrunchbase = profile("crunchbase.com", "crunchbase page");
  const fetchFinancialReport = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} 10k financial report:`, {
      type: "keyword",
      category: "financial report",
      livecrawl: "always",
      text: true,
      includeText: [websiteUrl],
    });

  const fetchFounders = profile("linkedin.com", "founder's Linkedin page");
  const fetchFunding = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} Funding:`, {
      type: "keyword",
      numResults: 1,
      text: true,
      summary: {
        query:
          "Tell me all about the funding (and valuation if available) of this company. If none, reply “NO”.",
      },
      livecrawl: "always",
      includeText: [websiteUrl],
    });

  const fetchGithubUrl = profile("github.com", "Github");
  const fetchPitchbook = profile("pitchbook.com", "pitchbook profile");
  const fetchTiktok = profile("tiktok.com", "TikTok");
  const fetchTracxn = profile("tracxn.com", "tracxn profile");

  const fetchWikipedia = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} company wikipedia page:`, {
      ...withDomain(["wikipedia.org"]),
      type: "keyword",
      livecrawl: "always",
      text: true,
      numResults: 1,
      includeText: [websiteUrl],
    });

  const fetchYoutubeVideos = ({ websiteUrl }: WebsiteResearchParams) =>
    S(websiteUrl, {
      ...withDomain(["youtube.com"]),
      type: "keyword",
      numResults: 10,
      includeText: [websiteUrl],
    });

  const youtubeVideoDetails = ({ videoUrl }: { videoUrl: string }) =>
    SC(videoUrl, {
      ...withDomain(["youtube.com"]),
      type: "keyword",
      text: true,
      numResults: 1,
    });

  const scrapeWebsiteUrl = ({ websiteUrl }: WebsiteResearchParams) =>
    G([websiteUrl], {
      text: true,
      summary: {
        query:
          "Describe the company in few words (simple English, no name included).",
      },
    });

  const scrapeWebsiteSubPages = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(websiteUrl, {
      category: "company",
      type: "neural",
      text: true,
      numResults: 1,
      livecrawl: "always",
      subpages: 7,
      subpageTarget: ["about", "team", "products", "services", "pricing", "faq", "blog"],
      ...withDomain([websiteUrl]),
    });

  const findCompetitors = ({
    websiteUrl,
    summaryText,
  }: CompetitorSearchParams) =>
    SC(summaryText, {
      type: "neural",
      useAutoprompt: true,
      text: true,
      summary: {
        query:
          "Explain in one-two short lines what this company does (very simple English).",
      },
      livecrawl: "always",
      ...withoutDomain([websiteUrl]),
    });

  const findNews = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} Latest News:`, {
      category: "news",
      type: "keyword",
      text: true,
      livecrawl: "always",
      includeText: [websiteUrl],
      numResults: 10,
    });

  const scrapeLinkedin = ({ profile, websiteUrl }: {profile: string, websiteUrl: string}) =>
    SC(`${profile} Linkedin profile:`, {
      type: "keyword",
      text: true,
      numResults: 1,
      livecrawl: "always",
    });

  const scrapeTwitterProfile = ({ profile, websiteUrl }: {profile: string, websiteUrl: string}) =>
    S(`${profile} Twitter bio`, {
      type: "keyword",
      ...withDomain(["twitter.com"]),
      numResults: 1,
    });

  const scrapeRecentTweets = ({ profile, websiteUrl }: {profile: string, websiteUrl: string}) => {
    const now = new Date();
    const start = new Date(now.getTime() - 90 * 864e5).toISOString();
    const end = new Date(now.getTime() + 864e5).toISOString();
    return SC(`from:${profile}`, {
      type: "keyword",
      livecrawl: "always",
      ...withDomain(["twitter.com"]),
      category: "tweet",
      startPublishedDate: start,
      endPublishedDate: end,
      includeText: [profile],
    });
  };

  const scrapeReddit = ({ websiteUrl }: WebsiteResearchParams) =>
    S(websiteUrl, {
      ...withDomain(["reddit.com"]),
      type: "keyword",
      includeText: [websiteUrl],
    });



  return {
      fetchCrunchbase,
      fetchFinancialReport,
      fetchFounders,
      fetchFunding,
      fetchGithubUrl,
      fetchPitchbook,
      fetchTiktok,
      fetchTracxn,
      fetchWikipedia,
      fetchYoutubeVideos,
      youtubeVideoDetails,
      findCompetitors,
      findNews,
      scrapeLinkedin,
      scrapeRecentTweets,
      scrapeTwitterProfile,
      scrapeReddit,
      scrapeWebsiteSubPages,
      scrapeWebsiteUrl,
      // findSimilar,
      // findSimilarContent,
      // answer,
      // parallelProcess,
  };
};
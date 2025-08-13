// Research Service Types
export interface WebsiteResearchParams {
  websiteUrl: string;
}

export interface CompanySummaryParams extends WebsiteResearchParams {
  subpages: any;
  mainpage: any;
}

export interface CompanyMapParams extends WebsiteResearchParams {
  mainpage: any;
  companySummary?: any;
  competitors?: any;
  funding?: any;
  subpages?: any;
}

export interface CompetitorSearchParams extends WebsiteResearchParams {
  summaryText: string;
}

export interface TwitterSearchParams {
  username: string;
}

export interface YouTubeVideoDetails {
  title: string;
  viewCount: string;
  publishedAt: string;
  channelTitle: string;
}

// Company Summary Types
export interface CompanySummarySection {
  heading: string;
  text: string;
}

export interface CompanySummaryResult {
  sections: CompanySummarySection[];
}

// Company Map Types
export interface MindMapNode {
  title: string;
  description: string;
  children?: MindMapNode[];
}

export interface CompanyMindMap {
  companyName: string;
  rootNode: {
    title: string;
    children: Array<{
      title: string;
      description: string;
      children: Array<{
        title: string;
        description: string;
      }>;
    }>;
  };
}

// Research Result Types
export interface ResearchResult {
  url: string;
  title?: string;
  text?: string;
  summary?: string;
  score?: number;
  publishedDate?: string;
  author?: string;
}

export interface ResearchResponse {
  results: ResearchResult[];
}
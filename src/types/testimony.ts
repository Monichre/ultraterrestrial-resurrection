export interface TestimonyData {
  title: string;
  summary?: string;
  source?: string;
  context?: string;
  claims?: string[];
  personnel?: Array<{
    name: string;
    role?: string;
    bio?: string;
    authorityMetrics?: {
      rank?: number;
      credibility?: number;
    };
  }>;
  events?: Array<{
    title: string;
    location?: string;
    date?: string;
    description?: string;
  }>;
  organizations?: Array<{
    name: string;
    description?: string;
  }>;
}
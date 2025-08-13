import { openai } from "@ai-sdk/openai"
import { generateObject, generateText, tool } from "ai"
import { z } from "zod"

// Enhanced analysis result schema
const analysisResultSchema = z.object( {
  summary: z.string().describe( "Concise summary of the content (max 200 words)" ),
  keywords: z.array( z.string() ).max( 10 ).describe( "Relevant keywords extracted from the content" ),
  entities: z.object( {
    people: z.array( z.string() ).describe( "Names of people mentioned" ),
    organizations: z.array( z.string() ).describe( "Organizations mentioned" ),
    locations: z.array( z.string() ).describe( "Geographic locations mentioned" ),
    dates: z.array( z.string() ).describe( "Important dates mentioned" ),
    events: z.array( z.string() ).describe( "Significant events described" ),
    technologies: z.array( z.string() ).describe( "Technologies or technical terms mentioned" )
  } ),
  sentiment: z.object( {
    overall: z.enum( ["positive", "negative", "neutral"] ).describe( "Overall sentiment" ),
    confidence: z.number().min( 0 ).max( 1 ).describe( "Confidence score for sentiment analysis" )
  } ),
  topics: z.array( z.object( {
    name: z.string(),
    relevance: z.number().min( 0 ).max( 1 )
  } ) ).describe( "Main topics with relevance scores" ),
  credibility: z.object( {
    score: z.number().min( 0 ).max( 1 ).describe( "Credibility assessment score" ),
    factors: z.array( z.string() ).describe( "Factors affecting credibility" )
  } ),
  classification: z.object( {
    category: z.string().describe( "Primary content category" ),
    subcategory: z.string().describe( "More specific classification" ),
    confidence: z.number().min( 0 ).max( 1 )
  } )
} )

type AnalysisResult = z.infer<typeof analysisResultSchema>

// Tool definitions for enhanced analysis
const entityExtractionTool = tool( {
  description: "Extract named entities from text with high precision",
  parameters: z.object( {
    text: z.string().describe( "Text to analyze for entities" ),
    entityTypes: z.array( z.string() ).describe( "Types of entities to extract" )
  } ),
  execute: async ( { text, entityTypes } ) => {
    // This would integrate with a specialized NER service
    console.log( `[Tool] Extracting entities: ${entityTypes.join( ', ' )} from text` )

    const { object } = await generateObject( {
      model: openai( "o3-mini" ),
      schema: z.object( {
        entities: z.record( z.array( z.string() ) )
      } ),
      prompt: `Extract the following entity types from the text: ${entityTypes.join( ', ' )}
      
      Text: ${text.slice( 0, 2000 )}
      
      Return entities organized by type.`
    } )

    return object
  }
} )

const sentimentAnalysisTool = tool( {
  description: "Perform detailed sentiment analysis on text",
  parameters: z.object( {
    text: z.string().describe( "Text to analyze for sentiment" ),
    granularity: z.enum( ["sentence", "paragraph", "document"] ).default( "document" )
  } ),
  execute: async ( { text, granularity } ) => {
    console.log( `[Tool] Analyzing sentiment at ${granularity} level` )

    const { object } = await generateObject( {
      model: openai( "gpt-4o-mini" ),
      schema: z.object( {
        sentiment: z.enum( ["positive", "negative", "neutral"] ),
        confidence: z.number().min( 0 ).max( 1 ),
        emotions: z.array( z.string() ),
        reasoning: z.string()
      } ),
      prompt: `Analyze the sentiment of this text at the ${granularity} level:
      
      ${text.slice( 0, 3000 )}
      
      Provide sentiment classification, confidence score, detected emotions, and reasoning.`
    } )

    return object
  }
} )

const topicModelingTool = tool( {
  description: "Identify and score topics in the content",
  parameters: z.object( {
    text: z.string().describe( "Text to analyze for topics" ),
    numTopics: z.number().min( 1 ).max( 10 ).default( 5 )
  } ),
  execute: async ( { text, numTopics } ) => {
    console.log( `[Tool] Identifying ${numTopics} topics from text` )

    const { object } = await generateObject( {
      model: openai( "gpt-4o-mini" ),
      schema: z.object( {
        topics: z.array( z.object( {
          name: z.string(),
          keywords: z.array( z.string() ),
          relevance: z.number().min( 0 ).max( 1 ),
          description: z.string()
        } ) )
      } ),
      prompt: `Identify the top ${numTopics} topics in this text. For each topic, provide:
      - A clear name
      - 3-5 relevant keywords
      - Relevance score (0-1)
      - Brief description
      
      Text: ${text.slice( 0, 4000 )}`
    } )

    return object
  }
} )

const credibilityAssessmentTool = tool( {
  description: "Assess the credibility and reliability of content",
  parameters: z.object( {
    text: z.string().describe( "Text to assess for credibility" ),
    domain: z.string().optional().describe( "Domain context (e.g., 'scientific', 'news', 'opinion')" )
  } ),
  execute: async ( { text, domain } ) => {
    console.log( `[Tool] Assessing credibility for ${domain || 'general'} content` )

    const { object } = await generateObject( {
      model: openai( "gpt-4o-mini" ),
      schema: z.object( {
        credibilityScore: z.number().min( 0 ).max( 1 ),
        factors: z.array( z.object( {
          factor: z.string(),
          impact: z.enum( ["positive", "negative", "neutral"] ),
          description: z.string()
        } ) ),
        recommendations: z.array( z.string() )
      } ),
      prompt: `Assess the credibility of this ${domain || 'general'} content. Consider:
      - Source citations and references
      - Factual accuracy indicators
      - Bias and objectivity
      - Writing quality and professionalism
      - Logical consistency
      
      Text: ${text.slice( 0, 3000 )}
      
      Provide a credibility score (0-1) and detailed analysis.`
    } )

    return object
  }
} )

const contentClassificationTool = tool( {
  description: "Classify content into categories and subcategories",
  parameters: z.object( {
    text: z.string().describe( "Text to classify" ),
    taxonomyLevel: z.enum( ["broad", "specific", "detailed"] ).default( "specific" )
  } ),
  execute: async ( { text, taxonomyLevel } ) => {
    console.log( `[Tool] Classifying content at ${taxonomyLevel} level` )

    const { object } = await generateObject( {
      model: openai( "gpt-4o-mini" ),
      schema: z.object( {
        primaryCategory: z.string(),
        subcategory: z.string(),
        tags: z.array( z.string() ),
        confidence: z.number().min( 0 ).max( 1 ),
        alternativeCategories: z.array( z.object( {
          category: z.string(),
          confidence: z.number().min( 0 ).max( 1 )
        } ) )
      } ),
      prompt: `Classify this content using a ${taxonomyLevel} taxonomy. Consider categories like:
      - Academic/Research
      - News/Journalism
      - Opinion/Editorial
      - Technical Documentation
      - Creative Writing
      - Government/Official
      - Commercial/Marketing
      
      Text: ${text.slice( 0, 2000 )}
      
      Provide primary classification with confidence and alternatives.`
    } )

    return object
  }
} )

// Main analysis function with tool orchestration
async function analyzeContent( text: string, options?: {
  includeEntities?: boolean
  includeSentiment?: boolean
  includeTopics?: boolean
  includeCredibility?: boolean
  includeClassification?: boolean
  domain?: string
} ): Promise<AnalysisResult> {
  console.log( "[Analysis] Starting comprehensive content analysis..." )

  const {
    includeEntities = true,
    includeSentiment = true,
    includeTopics = true,
    includeCredibility = true,
    includeClassification = true,
    domain
  } = options || {}

  // Truncate text if too long
  const maxLength = 15000
  const truncatedText = text.length > maxLength ? text.slice( 0, maxLength ) + "..." : text
  console.log( `[Analysis] Text length: ${text.length}, truncated: ${truncatedText.length}` )

  try {
    // Generate basic analysis with structured output
    console.log( "[Analysis] Generating basic analysis..." )
    const { object: basicAnalysis } = await generateObject( {
      model: openai( "gpt-4o" ),
      schema: z.object( {
        summary: z.string(),
        keywords: z.array( z.string() ).max( 10 )
      } ),
      prompt: `Analyze this text and provide:
      1. A concise summary (max 200 words)
      2. Up to 10 most relevant keywords
      
      Text: ${truncatedText}`
    } )

    // Use tools for enhanced analysis
    const toolResults = await Promise.allSettled( [
      includeEntities ? entityExtractionTool.execute( {
        text: truncatedText,
        entityTypes: ["people", "organizations", "locations", "dates", "events", "technologies"]
      } ) : null,

      includeSentiment ? sentimentAnalysisTool.execute( {
        text: truncatedText,
        granularity: "document"
      } ) : null,

      includeTopics ? topicModelingTool.execute( {
        text: truncatedText,
        numTopics: 5
      } ) : null,

      includeCredibility ? credibilityAssessmentTool.execute( {
        text: truncatedText,
        domain
      } ) : null,

      includeClassification ? contentClassificationTool.execute( {
        text: truncatedText,
        taxonomyLevel: "specific"
      } ) : null
    ] )

    // Process tool results
    const [entitiesResult, sentimentResult, topicsResult, credibilityResult, classificationResult] = toolResults

    // Construct final analysis result
    const analysisResult: AnalysisResult = {
      summary: basicAnalysis.summary,
      keywords: basicAnalysis.keywords,
      entities: {
        people: [],
        organizations: [],
        locations: [],
        dates: [],
        events: [],
        technologies: []
      },
      sentiment: {
        overall: "neutral",
        confidence: 0.5
      },
      topics: [],
      credibility: {
        score: 0.5,
        factors: []
      },
      classification: {
        category: "General",
        subcategory: "Unclassified",
        confidence: 0.5
      }
    }

    // Merge tool results
    if ( entitiesResult.status === 'fulfilled' && entitiesResult.value ) {
      const entities = entitiesResult.value.entities
      analysisResult.entities = {
        people: entities.people || [],
        organizations: entities.organizations || [],
        locations: entities.locations || [],
        dates: entities.dates || [],
        events: entities.events || [],
        technologies: entities.technologies || []
      }
    }

    if ( sentimentResult.status === 'fulfilled' && sentimentResult.value ) {
      analysisResult.sentiment = {
        overall: sentimentResult.value.sentiment,
        confidence: sentimentResult.value.confidence
      }
    }

    if ( topicsResult.status === 'fulfilled' && topicsResult.value ) {
      analysisResult.topics = topicsResult.value.topics.map( topic => ( {
        name: topic.name,
        relevance: topic.relevance
      } ) )
    }

    if ( credibilityResult.status === 'fulfilled' && credibilityResult.value ) {
      analysisResult.credibility = {
        score: credibilityResult.value.credibilityScore,
        factors: credibilityResult.value.factors.map( f => f.description )
      }
    }

    if ( classificationResult.status === 'fulfilled' && classificationResult.value ) {
      analysisResult.classification = {
        category: classificationResult.value.primaryCategory,
        subcategory: classificationResult.value.subcategory,
        confidence: classificationResult.value.confidence
      }
    }

    console.log( "[Analysis] Successfully completed comprehensive analysis" )
    return analysisResult

  } catch ( error ) {
    console.error( "[Analysis] Failed to generate analysis:", error )
    throw new Error( `Failed to generate analysis: ${error instanceof Error ? error.message : 'Unknown error'}` )
  }
}

// Export enhanced analysis function and tools
export {
  analyzeContent,
  entityExtractionTool,
  sentimentAnalysisTool,
  topicModelingTool,
  credibilityAssessmentTool,
  contentClassificationTool,
  type AnalysisResult
}

// Usage example function
export async function analyzeDocumentContent(
  text: string,
  analysisType: 'basic' | 'comprehensive' | 'research' = 'comprehensive'
): Promise<AnalysisResult> {
  const analysisOptions = {
    basic: {
      includeEntities: true,
      includeSentiment: false,
      includeTopics: false,
      includeCredibility: false,
      includeClassification: true
    },
    comprehensive: {
      includeEntities: true,
      includeSentiment: true,
      includeTopics: true,
      includeCredibility: true,
      includeClassification: true
    },
    research: {
      includeEntities: true,
      includeSentiment: false,
      includeTopics: true,
      includeCredibility: true,
      includeClassification: true,
      domain: 'academic'
    }
  }

  return analyzeContent( text, analysisOptions[analysisType] )
}

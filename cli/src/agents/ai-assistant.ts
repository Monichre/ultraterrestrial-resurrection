import axios from 'axios';
import chalk from 'chalk';
import { aiConfig } from '../config';
import { DataTypeConfig } from '../config';

/**
 * Analysis options
 */
export interface AnalysisOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  retries?: number;
}

/**
 * Analysis result interface
 */
export interface AnalysisResult {
  suggestions: string[];
  summary?: string;
  rawResponse?: any;
}

/**
 * AI Assistant error class
 */
export class AIAssistantError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'AIAssistantError';
  }
}

/**
 * AI Assistant class for data enhancement and analysis
 */
class AIAssistant {
  private apiKey: string;
  private model: string;
  private endpoint: string;
  private maxTokens: number;

  constructor() {
    this.apiKey = aiConfig.apiKey;
    this.model = aiConfig.model;
    this.endpoint = aiConfig.endpoint;
    this.maxTokens = aiConfig.maxTokens;
    
    if (!this.apiKey) {
      console.warn(chalk.yellow('⚠️  Warning: AI API key is not set. AI-assisted features will not work.'));
    }
  }
  }

  /**
   * Analyze content to get suggestions and improvements
   * @param content The content to analyze
   * @param dataType The type of data being analyzed
   * @param options Analysis options
   * @returns Analysis result
   */
  async analyzeContent(
    content: string,
    dataType: keyof DataTypeConfig,
    options: AnalysisOptions = {}
  ): Promise<AnalysisResult> {
    if (!this.apiKey) {
      throw new AIAssistantError('AI API key is not set. Please set the OPENAI_API_KEY environment variable.');
    }
    
    try {
      // Generate a simple prompt
      const prompt = `You are an expert data analyst specializing in UFO and paranormal research data. 
                      I need you to analyze the following ${dataType} data and provide suggestions for improvement:
                      
                      ${content}
                      
                      Please provide:
                      1. A brief summary of the content
                      2. Suggestions for improvement
                      
                      Format your response as:
                      SUMMARY: [your summary here]
                      
                      SUGGESTIONS:
                      - [suggestion 1]
                      - [suggestion 2]
                      ...`;
      
      // Setup API request parameters
      const requestOptions = {
        model: options.model || this.model,
        messages: [
          { role: 'system', content: 'You are an expert data analyzer assisting with data processing and enhancement.' },
          { role: 'user', content: prompt },
     }

  /**
   * Generate a summary of content
   * @param content The content to summarize
   * @param dataType The type of data
   * @param options Analysis options
   * @returns A summary of the content
   */
  async generateSummary(
    content: string,
    dataType: keyof DataTypeConfig,
    options: AnalysisOptions = {}
  ): Promise<string> {
    try {
      const result = await this.analyzeContent(content, dataType, options);
      return result.summary || '';
    } catch (error) {
      throw new AIAssistantError(
        `Failed to generate summary: ${(error as Error).message}`,
        error as Error
      );
    }
  }
   */
  private generatePrompt(
    content: string,
    dataType: keyof DataTypeConfig,
    analysisType: AnalysisType
  ): string {
    // Base prompt for all analysis types
    let prompt = `You are an expert data analyst specializing in UFO and paranormal research data. I need you to analyze the following ${dataType} data:\n\n${content}\n\n`;
    
    // Add specific instructions based on analysis type
    switch (analysisType) {
      case AnalysisType.QUALITY:
        prompt += `Please evaluate the quality of this data by examining completeness, accuracy, and consistency. 
                  Provide a quality score from 0-100, list all issues found, and recommend improvements. 
                  Format your response as a JSON object with the following structure:
                  {
                    "score": <number>,
                    "issues": ["issue1", "issue2", ...],
                    "recommendations": ["recommendation1", "recommendation2", ...]
                  }`;
        break;
      
      case AnalysisType.ENTITY_EXTRACTION:
        prompt += `Extract all entities from this content, including people, organizations, locations, events, and artifacts.
                  For each entity, provide its type, name, and a confidence score (0-1).
                  Format your response as a JSON array with the following structure:
                  [
                    {
                      "type": "person|organization|location|event|artifact",
                      "name": "<entity name>",
                      "confidence": <number between 0-1>,
                      "details": {<any additional information>}
                    },
                    ...
                  ]`;
        break;
      
      case AnalysisType.ENHANCEMENT:
        prompt += `Analyze this ${dataType} data and suggest enhancements to improve its quality, completeness, and consistency.
                  If appropriate, provide an enhanced version of the content.
                  Format your response as a JSON object with the following structure:
                  {
                    "suggestions": ["suggestion1", "suggestion2", ...],
                    "enhancements": {
                      <relevant enhancement fields based on data type>
                    }
                  }`;
        break;
      
      case AnalysisType.SUMMARY:
        prompt += `Generate a concise summary of this ${dataType} data, highlighting key points and insights.
                  Keep the summary to 3-5 sentences.
                  Format your response as a plain text summary.`;
        break;
      
      case AnalysisType.SCHEMA_VALIDATION:
        prompt += `Validate whether this data conforms to the expected schema for ${dataType}.
                  Identify any missing required fields or inconsistencies.
                  Format your response as a JSON object with the following structure:
                  {
                    "isValid": <boolean>,
                    "missingFields": ["field1", "field2", ...],
                    "inconsistencies": ["inconsistency1", "inconsistency2", ...]
                  }`;
        break;
      
      case AnalysisType.GENERAL:
      default:
        prompt += `Provide general analysis and insights about this data.
                  Suggest possible improvements or enhancements.
                  Format your response as a JSON object with the following structure:
                  {
                    "suggestions": ["suggestion1", "suggestion2", ...],
                    "insights": ["insight1", "insight2", ...]
                  }`;
    }
    
    // Add data type specific instructions
    if (dataType === 'testimonies') {
      prompt += `\n\nFor testimonies, pay special attention to credibility indicators, 
                consistency of claims, and connections to other known events or testimonies.`;
    } else if (dataType === 'events') {
      prompt += `\n\nFor events, focus on temporal and spatial accuracy,
                consistency with known testimonies, and the quality of source citations.`;
    } else if (dataType === 'personnel') {
      prompt += `\n\nFor personnel data, pay attention to biographical accuracy,
                credential verification, and consistency of information.`;
    }
    
    return prompt;
  }

  /**
   * Make an API request to the AI service
   * @param requestOptions The request options
   * @param retries Number of retries for failed requests
   * @returns The API response
   */
  private async makeRequest(requestOptions: any, retries: number = 2): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(
          this.endpoint,
          requestOptions,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
          }
        );
        
        return response.data;
      } catch (error) {
        lastError = error as Error;
        
        // Check if we should retry
        if (attempt < retries) {
          const delay = 1000 * Math.pow(2, attempt); // Exponential backoff
          console.log(chalk.yellow(`Retrying AI request after ${delay}ms (attempt ${attempt + 1}/${retries})...`));
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new AIAssistantError('Failed to make AI API request');
  }

  /**
   * Parse the API response based on analysis type
   * @param response The API response
   * @param analysisType The type of analysis performed
   * @returns The parsed analysis result
   */
  private parseResponse(response: any, analysisType: AnalysisType): AnalysisResult {
    try {
      // Extract content from response
      const content = response.choices?.[0]?.message?.content || '';
      
      // Initialize result
      const result: AnalysisResult = {
        suggestions: [],
        rawResponse: response,
      };
      
      // Try to parse JSON if not a summary
      if (analysisType !== AnalysisType.SUMMARY) {
        try {
          // Extract JSON object from content (in case there's explanatory text around it)
          const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            
            // Populate result based on analysis type
            switch (analysisType) {
              case AnalysisType.QUALITY:
                result.quality = {
                  score: parsedData.score || 0,
                  issues: parsedData.issues || [],
                  recommendations:

        options
      );
      
      return analysis.quality || {
        score: 0,
        issues: ['Failed to evaluate quality'],
        recommendations: [],
      };
    } catch (error) {
      throw new AIAssistantError(
        `Failed to evaluate quality for ${dataType}: ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Generate a summary of content
   * @param content The content to summarize
   * @param dataType The type of data being summarized
   * @param options Analysis options
   * @returns Summary text
   */
  async generateSummary(
    content: string,
    dataType: keyof DataTypeConfig,
    options: AnalysisOptions = {}
  ): Promise<string> {
    try {
      const analysis = await this.analyzeContent(
        content,
        dataType,
        AnalysisType.SUMMARY,
        options
      );
      
      return analysis.summary || '';
    } catch (error) {
      throw new AIAssistantError(
        `Failed to generate summary for ${dataType}: ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Generate a prompt based on analysis type and data type
   * @param content The content to analyze
   * @param dataType The type of data being analyzed
   * @param analysisType The type of analysis to perform
   * @returns The generated prompt
   */
  private generatePrompt(
    content: string,
    dataType: keyof DataTypeConfig,
    analysisType: AnalysisType
  ): string {
    // Base prompt for all analysis types
    let prompt = `You are an expert data analyst specializing in UFO and paranormal research data. I need you to analyze the following ${dataType} data:\n\n${content}\n\n`;
    
    // Add specific instructions based on analysis type
    switch (analysisType) {
      case AnalysisType.QUALITY:
        prompt += `Please evaluate the quality of this data by examining completeness, accuracy, and consistency. 
                  Provide a quality score from 0-100, list all issues found, and recommend improvements. 
                  Format your response as a JSON object with the following structure:
                  {
                    "score": <number>,
                    "issues": ["issue1", "issue2", ...],
                    "recommendations": ["recommendation1", "recommendation2", ...]
                  }`;
        break;
      
      case AnalysisType.ENTITY_EXTRACTION:
        prompt += `Extract all entities from this content, including people, organizations, locations, events, and artifacts.
                  For each entity, provide its type, name, and a confidence score (0-1).
                  Format your response as a JSON array with the following structure:
                  [
                    {
                      "type": "person|organization|location|event|artifact",
                      "name": "<entity name>",
                      "confidence": <number between 0-1>,
                      "details": {<any additional information>}
                    },
                    ...
                  ]`;
        break;
      
      case AnalysisType.ENHANCEMENT:
        prompt += `Analyze this ${dataType} data and suggest enhancements to improve its quality, completeness, and consistency.
                  If appropriate, provide an enhanced version of the content.
                  Format your response as a JSON object with the following structure:
                  {
                    "suggestions": ["suggestion1", "suggestion2", ...],
                    "enhancements": {
                      <relevant enhancement fields based on data type>
                    }
                  }`;
        break;
      
      case AnalysisType.SUMMARY:
        prompt += `Generate a concise summary of this ${dataType} data, highlighting key points and insights.
                  Keep the summary to 3-5 sentences.
                  Format your response as a plain text summary.`;
        break;
      
      case AnalysisType.SCHEMA_VALIDATION:
        prompt += `Validate whether this data conforms to the expected schema for ${dataType}.
                  Identify any missing required fields or inconsistencies.
                  Format your response as a JSON object with the following structure:
                  {
                    "isValid": <boolean>,
                    "missingFields": ["field1", "field2", ...],
                    "inconsistencies": ["inconsistency1", "inconsistency2", ...]
                  }`;
        break;
      
      case AnalysisType.GENERAL:
      default:
        prompt += `Provide general analysis and insights about this data.
                  Suggest possible improvements or enhancements.
                  Format your response as a JSON object with the following structure:
                  {
                    "suggestions": ["suggestion1", "suggestion2", ...],
                    "insights": ["insight1", "insight2", ...]
                  }`;
    }
    
    // Add data type specific instructions
    if (dataType === 'testimonies') {
      prompt += `\n\nFor testimonies, pay special attention to credibility indicators, 
                consistency of claims, and connections to other known events or testimonies.`;
    } else if (dataType === 'events') {
      prompt += `\n\nFor events, focus on temporal and spatial accuracy,
                consistency with known testimonies, and the quality of source citations.`;
    } else if (dataType === 'personnel') {
      prompt += `\n\nFor personnel data, pay attention to biographical accuracy,
                credential verification, and consistency of information.`;
    }
    
    return prompt;
  }

  /**
   * Make an API request to the AI service
   * @param requestOptions The request options
   * @param retries Number of retries for failed requests
   * @returns The API response
   */
  private async makeRequest(requestOptions: any, retries: number = 2): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(
          this.endpoint,
          requestOptions,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
          }
        );
        
        return response.data;
      } catch (error) {
        lastError = error as Error;
        
        // Check if we should retry
        if (attempt < retries) {
          const delay = 1000 * Math.pow(2, attempt); // Exponential backoff
          console.log(chalk.yellow(`Retrying AI request after ${delay}ms (attempt ${attempt + 1}/${retries})...`));
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new AIAssistantError('Failed to make AI API request');
  }

  /**
   * Parse the API response based on analysis type
   * @param response The API response
   * @param analysisType The type of analysis performed
   * @returns The parsed analysis result
   */
  private parseResponse(response: any, analysisType: AnalysisType): AnalysisResult {
    try {
      // Extract content from response
      const content = response.choices?.[0]?.message?.content || '';
      
      // Initialize result
      const result: AnalysisResult = {
        suggestions: [],
        rawResponse: response,
      };
      
      // Try to parse JSON if not a summary
      if (analysisType !== AnalysisType.SUMMARY) {
        try {
          // Extract JSON object from content (in case there's explanatory text around it)
          const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            
            // Populate result based on analysis type
            switch (analysisType) {
              case AnalysisType.QUALITY:
                result.quality = {
                  score: parsedData.score || 0,
                  issues: parsedData.issues || [],
                  recommendations: parsedData.recommendations || [],
                };
                break;
              
              


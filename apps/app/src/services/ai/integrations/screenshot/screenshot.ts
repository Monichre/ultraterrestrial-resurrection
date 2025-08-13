/**
 * Screenshot Service for screenshothis.com API
 * Provides functionality to capture website screenshots with various configuration options
 */

// Environment configuration
export const SCREENSHOT_API_KEY = process.env.SCREENSHOT_API_KEY || "ss_live_IjCCeqIQxSDjOaPknILJcbKkCvYPhopnSqcVfZBUBGfHyFfdFekVAqDMpTLNYPkP"
const SCREENSHOT_API_BASE_URL = process.env.SCREENSHOT_API_BASE_URL || 'https://api.screenshothis.com/v1/screenshots/take';
const DEFAULT_TIMEOUT = parseInt(process.env.SCREENSHOT_DEFAULT_TIMEOUT || '30000', 10);
const MAX_RETRIES = parseInt(process.env.SCREENSHOT_MAX_RETRIES || '3', 10);

// Type definitions
export interface ScreenshotConfig {
  url: string;
  blockAds?: boolean;
  blockCookieBanners?: boolean;
  blockTrackers?: boolean;
  prefersColorScheme?: 'light' | 'dark';
  format?: 'png' | 'jpeg' | 'webp';
  fullPage?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
  delay?: number;
  timeout?: number;
}

export interface ScreenshotResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    url: string;
    timestamp: number;
    format: string;
    size?: number;
  };
}

export interface ScreenshotError {
  code: string;
  message: string;
  details?: any;
}

// Default configuration
const DEFAULT_CONFIG: Partial<ScreenshotConfig> = {
  blockAds: true,
  blockCookieBanners: true,
  blockTrackers: true,
  prefersColorScheme: 'light',
  format: 'png',
  fullPage: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  delay: 0,
  timeout: DEFAULT_TIMEOUT,
};

/**
 * Validates if a URL is properly formatted
 */
function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Ensures URL has a protocol, defaults to https
 */
function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Normalizes URL for API consumption (URLSearchParams will handle encoding)
 */
function encodeTargetUrl(url: string): string {
  const normalizedUrl = normalizeUrl(url);
  return normalizedUrl;
}

/**
 * Builds the complete API URL with all parameters
 */
function buildApiUrl(config: ScreenshotConfig): string {
  if (!SCREENSHOT_API_KEY) {
    throw new Error('SCREENSHOT_API_KEY environment variable is required');
  }

  const params = new URLSearchParams({
    api_key: SCREENSHOT_API_KEY,
    url: encodeTargetUrl(config.url),
  });

  // Add optional parameters
  if (config.blockAds !== undefined) {
    params.append('block_ads', config.blockAds.toString());
  }
  if (config.blockCookieBanners !== undefined) {
    params.append('block_cookie_banners', config.blockCookieBanners.toString());
  }
  if (config.blockTrackers !== undefined) {
    params.append('block_trackers', config.blockTrackers.toString());
  }
  if (config.prefersColorScheme) {
    params.append('prefers_color_scheme', config.prefersColorScheme);
  }
  if (config.format) {
    params.append('format', config.format);
  }
  if (config.fullPage !== undefined) {
    params.append('full_page', config.fullPage.toString());
  }
  if (config.viewportWidth) {
    params.append('viewport_width', config.viewportWidth.toString());
  }
  if (config.viewportHeight) {
    params.append('viewport_height', config.viewportHeight.toString());
  }
  if (config.delay) {
    params.append('delay', config.delay.toString());
  }

  return `${SCREENSHOT_API_BASE_URL}?${params.toString()}`;
}

/**
 * Handles and categorizes errors from the screenshot API
 */
function handleScreenshotError(error: any): ScreenshotError {
  if (error.name === 'AbortError') {
    return {
      code: 'TIMEOUT',
      message: 'Screenshot request timed out',
      details: error,
    };
  }

  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      details: error,
    };
  }

  if (error.status) {
    switch (error.status) {
      case 401:
        return {
          code: 'UNAUTHORIZED',
          message: 'Invalid API key',
          details: error,
        };
      case 429:
        return {
          code: 'RATE_LIMITED',
          message: 'API rate limit exceeded',
          details: error,
        };
      case 400:
        return {
          code: 'BAD_REQUEST',
          message: 'Invalid request parameters',
          details: error,
        };
      default:
        return {
          code: 'API_ERROR',
          message: `API returned status ${error.status}`,
          details: error,
        };
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unknown error occurred',
    details: error,
  };
}

/**
 * Merges user configuration with defaults
 */
function mergeConfig(userConfig: ScreenshotConfig): ScreenshotConfig {
  return { ...DEFAULT_CONFIG, ...userConfig } as ScreenshotConfig;
}

/**
 * Takes a screenshot of the specified URL
 * @param config Screenshot configuration
 * @returns Promise resolving to screenshot response
 */
export async function takeScreenshot(config: ScreenshotConfig): Promise<ScreenshotResponse> {
  try {
    // Validate input
    if (!config.url) {
      return {
        success: false,
        error: 'URL is required',
      };
    }

    if (!validateUrl(normalizeUrl(config.url))) {
      return {
        success: false,
        error: 'Invalid URL format',
      };
    }

    if (!SCREENSHOT_API_KEY) {
      return {
        success: false,
        error: 'Screenshot API key is not configured',
      };
    }

    // Merge with defaults
    const finalConfig = mergeConfig(config);

    // Build API URL
    const apiUrl = buildApiUrl(finalConfig);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout!);

    try {
      // Make API request
      const response = await fetch(apiUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text().catch(() => 'Unknown error');
        throw {
          status: response.status,
          message: errorData,
        };
      }

      // For screenshothis.com, the response IS the image
      // Check if response is an image
      const contentType = response.headers.get('content-type') || '';
      if (contentType.startsWith('image/')) {
        // Create a blob URL for the image
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        return {
          success: true,
          imageUrl,
          metadata: {
            url: finalConfig.url,
            timestamp: Date.now(),
            format: finalConfig.format || 'png',
            size: blob.size,
          },
        };
      }

      // If not an image, try to parse as JSON for error response
      const textResponse = await response.text();
      try {
        const jsonResponse = JSON.parse(textResponse);
        if (jsonResponse.error) {
          return {
            success: false,
            error: jsonResponse.error,
          };
        }
      } catch {
        // Not JSON, treat as error
        return {
          success: false,
          error: 'Unexpected response format',
        };
      }

      return {
        success: false,
        error: 'No image data received',
      };
    } catch (error) {
      clearTimeout(timeoutId);
      const screenshotError = handleScreenshotError(error);
      return {
        success: false,
        error: screenshotError.message,
      };
    }
  } catch (error) {
    const screenshotError = handleScreenshotError(error);
    return {
      success: false,
      error: screenshotError.message,
    };
  }
}

/**
 * Takes screenshots of multiple URLs with parallel processing
 * @param configs Array of screenshot configurations
 * @param concurrency Maximum number of concurrent requests
 * @returns Promise resolving to array of screenshot responses
 */
export async function takeMultipleScreenshots(
  configs: ScreenshotConfig[],
  concurrency = 3
): Promise<ScreenshotResponse[]> {
  const results: ScreenshotResponse[] = [];
  
  // Process in chunks to respect rate limits
  for (let i = 0; i < configs.length; i += concurrency) {
    const chunk = configs.slice(i, i + concurrency);
    const chunkPromises = chunk.map(config => takeScreenshot(config));
    const chunkResults = await Promise.allSettled(chunkPromises);
    
    // Process results
    const chunkResponses = chunkResults.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason?.message || 'Screenshot failed',
        };
      }
    });
    
    results.push(...chunkResponses);
    
    // Add delay between chunks to respect rate limits
    if (i + concurrency < configs.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Takes a screenshot with retry logic for failed attempts
 * @param config Screenshot configuration
 * @param maxRetries Maximum number of retry attempts
 * @returns Promise resolving to screenshot response
 */
export async function takeScreenshotWithRetry(
  config: ScreenshotConfig,
  maxRetries = MAX_RETRIES
): Promise<ScreenshotResponse> {
  let lastError: string = '';
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await takeScreenshot(config);
    
    if (result.success) {
      return result;
    }
    
    lastError = result.error || 'Unknown error';
    
    // Don't retry on certain errors
    if (lastError.includes('Invalid URL') || 
        lastError.includes('API key') ||
        lastError.includes('Invalid request')) {
      break;
    }
    
    // Wait before retry with exponential backoff
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return {
    success: false,
    error: `Failed after ${maxRetries + 1} attempts: ${lastError}`,
  };
}

/**
 * Generates a cache key for screenshot configuration
 * @param config Screenshot configuration
 * @returns Cache key string
 */
export function getCacheKey(config: ScreenshotConfig): string {
  const finalConfig = mergeConfig(config);
  const keyData = {
    url: finalConfig.url,
    blockAds: finalConfig.blockAds,
    blockCookieBanners: finalConfig.blockCookieBanners,
    blockTrackers: finalConfig.blockTrackers,
    prefersColorScheme: finalConfig.prefersColorScheme,
    format: finalConfig.format,
    fullPage: finalConfig.fullPage,
    viewportWidth: finalConfig.viewportWidth,
    viewportHeight: finalConfig.viewportHeight,
  };
  
  return Buffer.from(JSON.stringify(keyData)).toString('base64');
}

// Export types and defaults for external use
export { DEFAULT_CONFIG };
export type { ScreenshotConfig, ScreenshotResponse, ScreenshotError };
/**
 * Screenshot Service Usage Examples
 * Demonstrates practical integration patterns for the Intentified platform
 */

import { 
  takeScreenshot, 
  takeMultipleScreenshots, 
  takeScreenshotWithRetry,
  getCacheKey,
  type ScreenshotConfig,
  type ScreenshotResponse 
} from './screenshot';

// Example: Basic competitor analysis screenshot
export async function captureCompetitorScreenshot(websiteUrl: string): Promise<ScreenshotResponse> {
  return await takeScreenshot({
    url: websiteUrl,
    fullPage: true,
    format: 'webp',
    blockAds: true,
    blockCookieBanners: true,
    blockTrackers: true,
    prefersColorScheme: 'light',
    viewportWidth: 1920,
    viewportHeight: 1080
  });
}

// Example: Batch competitor analysis
export async function captureCompetitorPortfolio(competitors: Array<{ name: string; website: string }>): Promise<Array<{
  competitor: string;
  website: string;
  screenshot: ScreenshotResponse;
}>> {
  const configs: ScreenshotConfig[] = competitors.map(comp => ({
    url: comp.website,
    fullPage: true,
    format: 'webp',
    blockAds: true,
    blockCookieBanners: true,
    prefersColorScheme: 'light'
  }));

  const results = await takeMultipleScreenshots(configs, 2); // Process 2 at a time

  return competitors.map((comp, index) => ({
    competitor: comp.name,
    website: comp.website,
    screenshot: results[index]
  }));
}

// Example: Website preview for onboarding flow
export async function generateWebsitePreview(
  url: string, 
  options: {
    darkMode?: boolean;
    mobile?: boolean;
  } = {}
): Promise<ScreenshotResponse> {
  const config: ScreenshotConfig = {
    url,
    fullPage: false, // Just viewport for preview
    format: 'webp',
    blockAds: true,
    blockCookieBanners: true,
    prefersColorScheme: options.darkMode ? 'dark' : 'light',
    viewportWidth: options.mobile ? 375 : 1920,
    viewportHeight: options.mobile ? 667 : 1080,
    delay: 1000 // Give page time to load
  };

  return await takeScreenshotWithRetry(config, 2);
}

// Example: Integration with Supabase storage
export async function captureAndStoreScreenshot(
  url: string, 
  storageKey: string,
  supabaseClient: any // Import from your Supabase client
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  try {
    const screenshot = await takeScreenshot({
      url,
      fullPage: true,
      format: 'webp'
    });

    if (!screenshot.success) {
      return { 
        success: false, 
        error: screenshot.error 
      };
    }

    // Convert blob URL to actual blob
    const response = await fetch(screenshot.imageUrl!);
    const blob = await response.blob();

    // Upload to Supabase storage
    const { data, error } = await supabaseClient.storage
      .from('screenshots')
      .upload(storageKey, blob, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabaseClient.storage
      .from('screenshots')
      .getPublicUrl(storageKey);

    return { 
      success: true, 
      publicUrl: publicUrlData?.publicUrl 
    };

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Example: Cached screenshot service
export class CachedScreenshotService {
  private cache = new Map<string, ScreenshotResponse>();
  private readonly cacheTTL = 3600000; // 1 hour in milliseconds

  async getScreenshot(config: ScreenshotConfig): Promise<ScreenshotResponse> {
    const cacheKey = getCacheKey(config);
    const cached = this.cache.get(cacheKey);

    // Check if cached result is still valid
    if (cached && cached.metadata) {
      const age = Date.now() - cached.metadata.timestamp;
      if (age < this.cacheTTL) {
        return cached;
      }
    }

    // Take new screenshot
    const result = await takeScreenshot(config);
    
    // Cache successful results
    if (result.success) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Example: Integration with enrichment pipeline
export async function enrichCompanyWithScreenshot(company: {
  name: string;
  website: string;
  id: string;
}): Promise<{
  company: typeof company;
  screenshot?: {
    url: string;
    metadata: any;
  };
  error?: string;
}> {
  try {
    const screenshot = await takeScreenshotWithRetry({
      url: company.website,
      fullPage: true,
      format: 'webp',
      blockAds: true,
      blockCookieBanners: true
    }, 3);

    if (!screenshot.success) {
      return {
        company,
        error: screenshot.error
      };
    }

    return {
      company,
      screenshot: {
        url: screenshot.imageUrl!,
        metadata: screenshot.metadata
      }
    };

  } catch (error) {
    return {
      company,
      error: error instanceof Error ? error.message : 'Screenshot failed'
    };
  }
}

// Example: AI form flow integration
export async function handleWebsiteAnalysis(websiteUrl: string): Promise<{
  screenshot?: ScreenshotResponse;
  insights?: {
    hasContactForm: boolean;
    hasLiveChat: boolean;
    estimatedLoadTime: number;
  };
  error?: string;
}> {
  try {
    // Capture screenshot for visual analysis
    const screenshot = await takeScreenshot({
      url: websiteUrl,
      fullPage: true,
      format: 'png', // PNG for better OCR/analysis
      blockAds: true,
      blockCookieBanners: true,
      delay: 2000 // Wait for dynamic content
    });

    if (!screenshot.success) {
      return { error: screenshot.error };
    }

    // TODO: Integrate with AI analysis service
    // This could analyze the screenshot for UI elements, forms, etc.
    const insights = {
      hasContactForm: false, // Placeholder
      hasLiveChat: false,    // Placeholder
      estimatedLoadTime: screenshot.metadata?.timestamp ? 
        Date.now() - screenshot.metadata.timestamp : 0
    };

    return {
      screenshot,
      insights
    };

  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Analysis failed'
    };
  }
}

// Example: Progressive screenshot capture with fallbacks
export async function captureWebsiteWithFallbacks(url: string): Promise<ScreenshotResponse> {
  // Try high-quality first
  let result = await takeScreenshot({
    url,
    fullPage: true,
    format: 'webp',
    viewportWidth: 1920,
    viewportHeight: 1080,
    timeout: 15000
  });

  if (result.success) {
    return result;
  }

  // Fallback to faster, lower quality
  result = await takeScreenshot({
    url,
    fullPage: false, // Just viewport
    format: 'jpeg',
    viewportWidth: 1280,
    viewportHeight: 720,
    timeout: 10000
  });

  if (result.success) {
    return result;
  }

  // Last resort: minimal settings
  return await takeScreenshot({
    url,
    fullPage: false,
    format: 'jpeg',
    viewportWidth: 800,
    viewportHeight: 600,
    timeout: 5000,
    blockAds: false,
    blockCookieBanners: false,
    blockTrackers: false
  });
}

// Example: Rate-limited batch processing for large datasets
export async function processLargeCompetitorList(
  competitors: Array<{ name: string; website: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<Array<{ name: string; website: string; screenshot: ScreenshotResponse }>> {
  const results: Array<{ name: string; website: string; screenshot: ScreenshotResponse }> = [];
  const batchSize = 5;
  const delayBetweenBatches = 2000; // 2 seconds

  for (let i = 0; i < competitors.length; i += batchSize) {
    const batch = competitors.slice(i, i + batchSize);
    
    const batchConfigs = batch.map(comp => ({
      url: comp.website,
      fullPage: true,
      format: 'webp' as const,
      blockAds: true,
      timeout: 20000
    }));

    const batchResults = await takeMultipleScreenshots(batchConfigs, 3);
    
    batch.forEach((comp, index) => {
      results.push({
        name: comp.name,
        website: comp.website,
        screenshot: batchResults[index]
      });
    });

    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + batchSize, competitors.length), competitors.length);
    }

    // Delay before next batch (except for last batch)
    if (i + batchSize < competitors.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
}

// Export the cached service instance for reuse
export const cachedScreenshotService = new CachedScreenshotService(); 
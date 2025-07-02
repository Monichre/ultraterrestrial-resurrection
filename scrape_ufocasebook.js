#!/usr/bin/env node

import { fireCrawl } from './packages/services/firecrawl/firecrawl.client.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function scrapeUFOCasebook() {
  const url = 'https://www.ufocasebook.com/casefiles.html';
  
  console.log(`🚀 Scraping ${url}...`);
  
  try {
    const scrapeOptions = {
      formats: ['markdown', 'content'],
      onlyMainContent: true,
      waitFor: 3000, // Wait 3 seconds for page to load
      removeBase64Images: true, // Remove base64 images to keep file size manageable
    };

    const response = await fireCrawl.scrapeUrl(url, scrapeOptions);
    
    if (!response.success) {
      throw new Error(`Scraping failed: ${response.error || 'Unknown error'}`);
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `ufocasebook-casefiles-${timestamp}.md`;
    const filepath = join(process.cwd(), filename);

    // Prepare markdown content with metadata
    const metadata = `---
title: UFO Casebook - Case Files
url: ${url}
scraped_at: ${new Date().toISOString()}
scraper: Firecrawl
---

# UFO Casebook - Case Files

Source: [${url}](${url})
Scraped: ${new Date().toLocaleString()}

---

`;

    const markdownContent = response.data?.markdown || response.data?.content || 'No content available';
    const fullContent = metadata + markdownContent;

    // Write to file
    writeFileSync(filepath, fullContent, 'utf8');
    
    console.log(`✅ Successfully scraped and saved to: ${filename}`);
    console.log(`📄 Content length: ${markdownContent.length} characters`);
    console.log(`📁 Full path: ${filepath}`);
    
    return {
      success: true,
      filename,
      filepath,
      contentLength: markdownContent.length
    };

  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    
    // Log more details if available
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw error;
  }
}

// Run the scraper
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeUFOCasebook()
    .then(result => {
      console.log('\n🎉 Scraping completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Scraping failed:', error.message);
      process.exit(1);
    });
}

export { scrapeUFOCasebook }; 
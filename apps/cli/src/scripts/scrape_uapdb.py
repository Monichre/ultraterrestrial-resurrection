#!/usr/bin/env python3
"""
Scraper script to extract data from UAP Database URLs and download all media
using the firecrawl library.
"""

import os
import json
import time
import requests
from pathlib import Path
from typing import List, Dict, Any, Optional
import urllib.parse

try:
    from firecrawl import FirecrawlApp
except ImportError:
    print("The 'firecrawl-py' package is not installed.")
    print("Please install it using: pip install firecrawl-py")
    exit(1)

# Configuration
API_KEY = os.environ.get("FIRECRAWL_API_KEY")
if not API_KEY:
    print("ERROR: FIRECRAWL_API_KEY environment variable not set.")
    print("Please set your Firecrawl API key using:")
    print("export FIRECRAWL_API_KEY='your_api_key'")
    exit(1)

# Output directories
DATA_DIR = Path("data/uapdb_scrape")
MEDIA_DIR = DATA_DIR / "media"
JSON_DIR = DATA_DIR / "json"

# Create output directories if they don't exist
os.makedirs(MEDIA_DIR, exist_ok=True)
os.makedirs(JSON_DIR, exist_ok=True)

# Initialize Firecrawl
app = FirecrawlApp(api_key=API_KEY)

# List of URLs to scrape
with open('uapdb_urls.txt', 'r') as f:
    URLS = [line.strip() for line in f if line.strip()]

def sanitize_filename(url: str) -> str:
    """Convert URL to a safe filename."""
    parsed = urllib.parse.urlparse(url)
    path = parsed.path.rstrip('/').replace('/', '_')
    query = parsed.query.replace('=', '_').replace('&', '_') if parsed.query else ""
    filename = f"{path}_{query}" if query else path
    if not filename:
        filename = "index"
    # Extract the postid if available
    if "postid=" in url:
        postid = url.split("postid=")[1].split("&")[0]
        filename = f"uapdb_post_{postid}"
    else:
        filename = f"uapdb_{filename}"
    return filename

def download_media(media_urls: List[Dict[str, str]], base_filename: str) -> List[str]:
    """Download all media files from the provided URLs."""
    downloaded_files = []
    
    for i, media_item in enumerate(media_urls, 1):
        media_url = media_item.get('url')
        if not media_url:
            continue
            
        # Determine file extension
        url_path = urllib.parse.urlparse(media_url).path
        extension = os.path.splitext(url_path)[1]
        if not extension:
            extension = '.jpg'  # Default to jpg if no extension
            
        # Create filename
        media_filename = f"{base_filename}_media_{i}{extension}"
        media_path = MEDIA_DIR / media_filename
        
        try:
            print(f"Downloading media: {media_url}")
            response = requests.get(media_url, stream=True)
            response.raise_for_status()
            
            with open(media_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
                    
            downloaded_files.append(str(media_path))
            print(f"Successfully downloaded: {media_path}")
        except Exception as e:
            print(f"Error downloading {media_url}: {e}")
    
    return downloaded_files

def scrape_url(url: str) -> Dict[str, Any]:
    """Scrape a URL using Firecrawl and download associated media."""
    print(f"\nScraping URL: {url}")
    
    # Create a base filename from the URL
    base_filename = sanitize_filename(url)
    
    # Parameters for Firecrawl
    params = {
        "formats": ["html", "markdown", "media"],  # Include media extraction
        "includeMedia": True,  # Ensure media is included
        "mediaOptions": {
            "downloadImages": True,
            "downloadVideos": True,
            "downloadAudio": True
        }
    }
    
    try:
        # Scrape the URL
        start_time = time.time()
        scrape_result = app.scrape_url(url, params=params)
        end_time = time.time()
        
        # Extract and download media if available
        media_urls = scrape_result.get('media', [])
        downloaded_files = download_media(media_urls, base_filename)
        
        # Add downloaded media paths to the result
        scrape_result['downloaded_media'] = downloaded_files
        
        # Save the JSON data
        json_filename = f"{base_filename}.json"
        json_path = JSON_DIR / json_filename
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(scrape_result, f, indent=2, ensure_ascii=False)
        
        print(f"Data saved to: {json_path}")
        print(f"Scraping completed in {end_time - start_time:.2f} seconds")
        
        return scrape_result
    
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        
        # Save error information
        error_data = {
            "url": url,
            "error": str(e),
            "timestamp": time.time()
        }
        
        error_filename = f"{base_filename}_error.json"
        error_path = JSON_DIR / error_filename
        
        with open(error_path, 'w', encoding='utf-8') as f:
            json.dump(error_data, f, indent=2)
        
        print(f"Error information saved to: {error_path}")
        return {"error": str(e), "url": url}

def main():
    """Main function to process all URLs."""
    # Save the list of URLs to a file
    with open('uapdb_urls.txt', 'w') as f:
        for url in URLS:
            f.write(f"{url}\n")
    
    print(f"Starting scraping of {len(URLS)} UAP Database URLs")
    print(f"Data will be saved to: {DATA_DIR}")
    
    results = []
    for i, url in enumerate(URLS, 1):
        print(f"\nProcessing URL {i}/{len(URLS)}")
        result = scrape_url(url)
        results.append(result)
        
        # Add a delay between requests to avoid overwhelming the API
        if i < len(URLS):
            print("Waiting for 3 seconds before the next request...")
            time.sleep(3)
    
    # Save summary report
    summary = {
        "total_urls": len(URLS),
        "successful_scrapes": sum(1 for r in results if "error" not in r),
        "failed_scrapes": sum(1 for r in results if "error" in r),
        "timestamp": time.time()
    }
    
    with open(DATA_DIR / "scraping_summary.json", 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("\nScraping completed!")
    print(f"Successfully scraped: {summary['successful_scrapes']} URLs")
    print(f"Failed to scrape: {summary['failed_scrapes']} URLs")
    print(f"Results saved to: {DATA_DIR}")

if __name__ == "__main__":
    main()

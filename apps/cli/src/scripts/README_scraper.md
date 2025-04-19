# UAP Database Scraper

This script scrapes data from the UAP Database website and downloads all associated media using the Firecrawl library.

## Prerequisites

- Python 3.7+
- firecrawl-py package
- requests package

## Setup

1. Install required packages:
   ```
   pip install firecrawl-py requests
   ```

2. Set your Firecrawl API key as an environment variable:
   ```
   export FIRECRAWL_API_KEY='your_api_key'
   ```
   
   Note: You'll need a valid Firecrawl API key. You can sign up for one at [firecrawl.dev](https://firecrawl.dev).

3. Ensure the script has execution permissions:
   ```
   chmod +x scrape_uapdb.py
   ```

## Usage

The script is already set up with a list of UAP Database URLs to scrape. To run it:

```
python scrape_uapdb.py
```

## Output

The script will create the following directory structure:

```
data/
└── uapdb_scrape/
    ├── json/         # JSON data extracted from each page
    ├── media/        # Downloaded media files
    └── scraping_summary.json  # Summary of the scraping results
```

For each URL, the script will:
1. Scrape the web page content
2. Extract and download all media (images, videos, etc.)
3. Save the page content and metadata as JSON
4. Record downloaded media paths

## Troubleshooting

If you encounter errors:

1. Verify your Firecrawl API key is set correctly
2. Check your internet connection
3. Ensure you have proper permissions to write to the data directory
4. Check the JSON error files in the output directory for specific error details

## Rate Limiting

The script includes a 3-second delay between requests to avoid overwhelming the API. You can adjust this delay in the script if needed.

## Customization

You can modify the script to:
- Change the output directory
- Adjust scraping parameters
- Filter specific types of media
- Add more URLs to scrape by modifying `uapdb_urls.txt`

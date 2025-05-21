#!/bin/bash

# Script to download PDFs and media files from URLs using Firecrawl Extract API
# Original functionality maintained plus added support for multiple URLs and Firecrawl integration
# Version: 1.0.0
# Last Updated: 2025-04-15
# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed. Please install curl to use this script.${NC}"
    exit 1
fi

# Temporary files array
TEMP_FILES=()

# Function to clean up temporary files
cleanup() {
    echo -e "\n${YELLOW}Cleaning up...${NC}"
    for temp_file in "${TEMP_FILES[@]}"; do
        [[ -f "$temp_file" ]] && rm "$temp_file"
    done
    echo -e "${RED}Script interrupted. Exiting...${NC}"
    exit 1
}

# Set up trap to handle interruptions
trap cleanup SIGINT SIGTERM

# Function to extract and sanitize domain name from URL
sanitize_domain_name() {
    local url="$1"
    local domain
    
    # Remove protocol (http:// or https://)
    domain=$(echo "$url" | sed -E 's|^https?://||i')
    
    # Keep only the domain part (before the first slash)
    domain=$(echo "$domain" | cut -d'/' -f1)
    
    # Remove port numbers if present (after colon)
    domain=$(echo "$domain" | cut -d':' -f1)
    
    # Remove subdomains if needed (keeping just the main domain)
    # This is optional - comment out if you want to keep the full domain
    # domain=$(echo "$domain" | sed -E 's/^www\.//i' | grep -o '[^.]*\.[^.]*$')
    
    # Replace dots and other special characters with underscores
    domain=$(echo "$domain" | tr -c '[:alnum:]' '_')
    
    # Remove any trailing underscores
    domain=$(echo "$domain" | sed 's/_*$//')
    
    # Check if the domain is empty after all sanitization, use a default
    if [ -z "$domain" ]; then
        domain="unknown_domain"
    fi
    
    echo "$domain"
}

# Firecrawl API Key - replace with your actual key
API_KEY="fc-e271f58f93fe4b3fa4885b3234dfa8fb"

# Media file extensions to download
MEDIA_EXTENSIONS=("pdf" "jpg" "jpeg" "png" "gif" "mp4" "mp3" "wav" "doc" "docx" "xls" "xlsx" "ppt" "pptx")

# Function to display usage information
show_usage() {
    echo -e "${BLUE}Usage:${NC}"
    echo -e "  $0 [options] <url|urls...>"
    echo -e ""
    echo -e "${BLUE}Options:${NC}"
    echo -e "  -h, --help                 Show this help message"
    echo -e "  -d, --directory <dir>      Specify download directory (default: auto-generated based on domain)"
    echo -e "  -f, --file <filename>      Read URLs from a file, one URL per line"
    echo -e "  -m, --media-only           Download only media files (no Firecrawl extraction)"
    echo -e "  -e, --extract-only         Only perform Firecrawl extraction (no file downloads)"
    echo -e ""
    echo -e "${BLUE}Examples:${NC}"
    echo -e "  $0 https://example.com"
    echo -e "  $0 -d ~/Downloads/files https://example.com"
    echo -e "  $0 https://example1.com https://example2.com"
    echo -e "  $0 -f urls.txt"
    echo -e ""
    echo -e "If no arguments are provided, the script defaults to downloading PDFs from uap.gg/sources/documents"
}

# Parse command line arguments
URLS=()
URL_FILE=""
CUSTOM_DIR=""
MEDIA_ONLY=false
EXTRACT_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -d|--directory)
            CUSTOM_DIR="$2"
            shift 2
            ;;
        -f|--file)
            URL_FILE="$2"
            shift 2
            ;;
        -m|--media-only)
            MEDIA_ONLY=true
            shift
            ;;
        -e|--extract-only)
            EXTRACT_ONLY=true
            shift
            ;;
        -*)
            echo -e "${RED}Error: Unknown option $1${NC}"
            show_usage
            exit 1
            ;;
        *)
            URLS+=("$1")
            shift
            ;;
    esac
done

# If URL file is provided, read URLs from the file
if [[ -n "$URL_FILE" ]]; then
    if [[ ! -f "$URL_FILE" ]]; then
        echo -e "${RED}Error: URL file '$URL_FILE' not found${NC}"
        exit 1
    fi
    
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip empty lines and comments
        if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
            URLS+=("$line")
        fi
    done < "$URL_FILE"
fi

# Default to uap.gg if no URLs are provided
if [[ ${#URLS[@]} -eq 0 ]]; then
    URLS=("https://uap.gg/sources/documents")
    
    # Default download directory for uap.gg
    if [[ -z "$CUSTOM_DIR" ]]; then
        DOWNLOAD_DIR="$HOME/Desktop/uap_documents"
    else
        DOWNLOAD_DIR="$CUSTOM_DIR"
    fi
    
    echo -e "${YELLOW}No URLs provided, using default: ${NC}${URLS[0]}"
else
    # Set download directory based on first URL if not specified
    if [[ -z "$CUSTOM_DIR" ]]; then
        # Create a directory name based on the domain of the first URL
        DOMAIN=$(sanitize_domain_name "${URLS[0]}")
        DOWNLOAD_DIR="$HOME/Desktop/${DOMAIN}_downloads"
    else
        DOWNLOAD_DIR="$CUSTOM_DIR"
    fi
fi

# Validate the download directory path
if [[ "$DOWNLOAD_DIR" == *"/https:"* || "$DOWNLOAD_DIR" == *"/http:"* ]]; then
    echo -e "${RED}Error: Malformed directory path detected: $DOWNLOAD_DIR${NC}"
    echo -e "${YELLOW}Fixing directory path...${NC}"
    
    # Fix the path by removing protocol remnants
    DOWNLOAD_DIR=$(echo "$DOWNLOAD_DIR" | sed -E 's|/https?:|/|g')
    echo -e "${GREEN}Using directory: $DOWNLOAD_DIR${NC}"
fi

# Create directory if it doesn't exist
mkdir -p "$DOWNLOAD_DIR"
echo -e "${GREEN}Files will be downloaded to:${NC} $DOWNLOAD_DIR"

# Create subdirectories for different types of content
mkdir -p "$DOWNLOAD_DIR/media"
mkdir -p "$DOWNLOAD_DIR/extracted"

# Function to download media files from a URL
download_media_files() {
    local url="$1"
    local base_url=$(echo "$url" | grep -o 'https\?://[^/]*')
    local domain=$(sanitize_domain_name "$url")
    
    echo -e "${YELLOW}Fetching media files from $url...${NC}"
    
    # Create a temporary file to store the webpage content
    local temp_file=$(mktemp)
    TEMP_FILES+=("$temp_file")
    curl -s "$url" > "$temp_file"
    
    # Find all media file links
    local all_urls=""
    
    for ext in "${MEDIA_EXTENSIONS[@]}"; do
        # Find links with the current extension
        local ext_urls=$(grep -o "[^\"']*\.$ext[^\"']*" "$temp_file" | sort | uniq)
        
        # Also find URLs with href= and src= attributes
        local href_urls=$(grep -o 'href=["'\''"][^"'\'']*\.'${ext}'[^"'\'']*["'\'']' "$temp_file" | sed 's/href=["'\'']\(.*\)["'\'']/\1/g')
        local src_urls=$(grep -o 'src=["'\''"][^"'\'']*\.'${ext}'[^"'\'']*["'\'']' "$temp_file" | sed 's/src=["'\'']\(.*\)["'\'']/\1/g')
        
        all_urls="${all_urls}${ext_urls}"$'\n'"${href_urls}"$'\n'"${src_urls}"$'\n'
    done
    
    # Remove empty lines
    all_urls=$(echo "$all_urls" | grep -v '^$')
    
    # Process and normalize URLs
    local processed_urls=""
    while IFS= read -r media_url || [[ -n "$media_url" ]]; do
        # Skip empty lines
        [[ -z "$media_url" ]] && continue
        
        # Normalize the URL
        if [[ $media_url == http* ]]; then
            # Absolute URL
            processed_urls+="$media_url"$'\n'
        elif [[ $media_url == /* ]]; then
            # Relative URL starting with /
            processed_urls+="$base_url$media_url"$'\n'
        else
            # Other relative URL
            local parent_path=$(echo "$url" | grep -o 'https\?://[^?#]*' | sed 's/[^/]*$//')
            processed_urls+="$parent_path$media_url"$'\n'
        fi
    done <<< "$all_urls"
    
    # Remove empty lines and duplicates
    processed_urls=$(echo "$processed_urls" | grep -v '^$' | sort | uniq)
    
    # Further sanitize URLs to remove malformed content
    local sanitized_urls=""
    while IFS= read -r media_url || [[ -n "$media_url" ]]; do
        # Skip empty lines
        [[ -z "$media_url" ]] && continue
        
        # For each media extension, extract only the part up to and including the extension
        for ext in "${MEDIA_EXTENSIONS[@]}"; do
            if [[ $media_url == *".$ext"* ]]; then
                # Extract everything up to and including the file extension
                clean_url=$(echo "$media_url" | sed -E "s/^(.*\.$ext).*$/\1/")
                sanitized_urls+="$clean_url"$'\n'
                break
            fi
        done
    done <<< "$processed_urls"
    
    # Replace the processed_urls with the sanitized version
    processed_urls=$(echo "$sanitized_urls" | grep -v '^$' | sort | uniq)
    
    # Clean up the temporary file
    rm "$temp_file"
    TEMP_FILES=("${TEMP_FILES[@]/$temp_file}")
    
    # Count URLs
    local url_count=$(echo "$processed_urls" | wc -l | tr -d ' ')
    
    if [[ -z "$processed_urls" ]]; then
        echo -e "${YELLOW}No media files found on $url${NC}"
        return
    fi
    
    echo -e "${GREEN}Found $url_count media files to download from $url${NC}"
    
    # Download each file
    local count=1
    
    # Create domain-specific directory for multiple URLs
    if [[ ${#URLS[@]} -gt 1 ]]; then
        mkdir -p "$DOWNLOAD_DIR/media/$domain"
        local media_dir="$DOWNLOAD_DIR/media/$domain"
    else
        local media_dir="$DOWNLOAD_DIR/media"
    fi
    
    echo "$processed_urls" | while read -r media_url; do
        # Skip empty lines
        [[ -z "$media_url" ]] && continue
        
        # Extract filename from URL
        local filename=$(basename "$media_url" | sed 's/\?.*//')
        
        echo -e "${YELLOW}[$count/$url_count] Downloading:${NC} $filename"
        
        # Download with curl, showing progress bar
        curl -L --progress-bar "$media_url" -o "$media_dir/$filename"
        
        # Check if download was successful
        if [[ $? -eq 0 ]]; then
            echo -e "${GREEN}Successfully downloaded:${NC} $filename"
        else
            echo -e "${RED}Failed to download:${NC} $filename"
        fi
        
        count=$((count+1))
    done
}

# Function to use Firecrawl Extract API
use_firecrawl_extract() {
    local url="$1"
    local domain=$(sanitize_domain_name "$url")
    
    echo -e "${YELLOW}Using Firecrawl Extract API for $url...${NC}"
    
    # Create domain-specific directory for multiple URLs
    if [[ ${#URLS[@]} -gt 1 ]]; then
        mkdir -p "$DOWNLOAD_DIR/extracted/$domain"
        local extract_dir="$DOWNLOAD_DIR/extracted/$domain"
    else
        local extract_dir="$DOWNLOAD_DIR/extracted"
    fi
    
    # Prepare the request to Firecrawl Extract API
    local response=$(curl -s -X POST https://api.firecrawl.dev/v1/extract \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $API_KEY" \
        -d "{\"urls\": [\"$url\"], \"formats\": [\"all\"]}")
    
    # Check if the API call was successful
    if [[ $response == *"error"* ]]; then
        echo -e "${RED}Error from Firecrawl API:${NC} $response"
        return
    fi
    
    # Create a sanitized filename based on the URL
    local sanitized_filename=$(echo "$url" | sed 's/[^a-zA-Z0-9]/_/g')
    
    # Save the full API response as JSON
    echo "$response" > "$extract_dir/${sanitized_filename}_full_response.json"
    
    # Extract text content from the API response
    local text_content=$(echo "$response" | grep -o '"text":"[^"]*"' | sed 's/"text":"//;s/"$//' | sed 's/\\n/\n/g')
    
    # Save the text content
    echo "$text_content" > "$extract_dir/${sanitized_filename}_content.txt"
    
    # Extract title from the API response
    local title=$(echo "$response" | grep -o '"title":"[^"]*"' | sed 's/"title":"//;s/"$//')
    
    # Save page metadata
    echo "URL: $url" > "$extract_dir/${sanitized_filename}_metadata.txt"
    echo "Title: $title" >> "$extract_dir/${sanitized_filename}_metadata.txt"
    echo "Extraction Date: $(date)" >> "$extract_dir/${sanitized_filename}_metadata.txt"
    
    echo -e "${GREEN}Successfully extracted content from $url${NC}"
    echo -e "${GREEN}Saved to:${NC} $extract_dir/${sanitized_filename}_content.txt"
}

# Process each URL
for url in "${URLS[@]}"; do
    echo -e "\n${BLUE}Processing URL:${NC} $url"
    
    # Use Firecrawl Extract API if not in media-only mode
    if [[ "$MEDIA_ONLY" == "false" ]]; then
        use_firecrawl_extract "$url"
    fi
    
    # Download media files if not in extract-only mode
    if [[ "$EXTRACT_ONLY" == "false" ]]; then
        download_media_files "$url"
    fi
done

echo -e "\n${GREEN}Processing complete!${NC}"
echo -e "Files are available in: $DOWNLOAD_DIR"

# Count downloaded media files
MEDIA_COUNT=$(find "$DOWNLOAD_DIR/media" -type f | wc -l | tr -d ' ')
echo -e "Media files downloaded: $MEDIA_COUNT"

# Count extracted content files
EXTRACT_COUNT=$(find "$DOWNLOAD_DIR/extracted" -type f | wc -l | tr -d ' ')
echo -e "Extraction files created: $EXTRACT_COUNT"

# List directories by size
echo -e "\n${YELLOW}Directory sizes:${NC}"
du -sh "$DOWNLOAD_DIR"/* | sort -hr

# Clean up any remaining temporary files
for temp_file in "${TEMP_FILES[@]}"; do
    [[ -f "$temp_file" ]] && rm "$temp_file"
done

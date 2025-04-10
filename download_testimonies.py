#!/usr/bin/env python3
import json
import os
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import re

# Path configurations
TESTIMONIES_JSON = "/Users/liamellis/Desktop/ultraterrestrial/packages/agentic-rag/docs/testimonies.json"
OUTPUT_DIR = "/Users/liamellis/Desktop/ultraterrestrial-resurrection/docs/testimonies"

def extract_video_id(url):
    """Extract YouTube video ID from URL."""
    video_id_match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
    if video_id_match:
        return video_id_match.group(1)
    return None

def sanitize_filename(text):
    """Convert text to a safe filename."""
    # Replace special characters with underscores
    safe_name = re.sub(r'[^\w\-\.]', '_', text)
    # Limit length and remove trailing underscores
    return safe_name[:100].rstrip('_')

def get_transcript(video_id):
    """Get transcript for a video."""
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        formatter = TextFormatter()
        return formatter.format_transcript(transcript)
    except Exception as e:
        return f"Error retrieving transcript: {str(e)}"

def main():
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load testimonies data
    with open(TESTIMONIES_JSON, 'r') as f:
        testimonies = json.load(f)
    
    # Process each testimony
    for index, testimony in enumerate(testimonies):
        print(f"Processing {index+1}/{len(testimonies)}: {testimony['testimony']}")
        
        # Extract video ID from URL
        video_id = extract_video_id(testimony['url'])
        if not video_id:
            print(f"  Could not extract video ID from URL: {testimony['url']}")
            continue
        
        # Get transcript
        transcript_text = get_transcript(video_id)
        
        # Create filename based on witness and testimony
        witness = testimony['witness'] if testimony['witness'] != "Unknown" else f"Unknown-{index}"
        filename = sanitize_filename(f"{witness}_{testimony['testimony']}")
        filepath = os.path.join(OUTPUT_DIR, f"{filename}.md")
        
        # Write output file with testimony information and transcript
        with open(filepath, 'w') as f:
            f.write(f"# {testimony['testimony']}\n\n")
            f.write(f"## Witness\n{testimony['witness']}\n\n")
            f.write(f"## Original Video\n{testimony['url']}\n\n")
            f.write(f"## Transcript\n\n{transcript_text}\n")
        
        print(f"  Saved to {filepath}")

if __name__ == "__main__":
    main()
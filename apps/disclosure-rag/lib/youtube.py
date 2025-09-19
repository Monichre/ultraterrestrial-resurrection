import concurrent.futures
import csv
import datetime
import json
import os
import re
from concurrent.futures import ThreadPoolExecutor

import requests
import streamlit as st
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from processing.content_analysis import ContentAnalysisEngine
from dotenv import load_dotenv
from processing.web_content_processor import WebContentProcessor

# Load environment variables
load_dotenv()
directory = os.environ.get('TRANSCRIPT_DIRECTORY_PATH')

# Lazy initialization to prevent environment variable loading issues
analyzer = None
web_processor = None

def get_analyzer():
    global analyzer
    if analyzer is None:
        analyzer = ContentAnalysisEngine()
    return analyzer

def get_web_processor():
    global web_processor
    if web_processor is None:
        web_processor = WebContentProcessor()
    return web_processor


def detect_transcript_language(text):
    """Detect if transcript is actually in English despite YouTube labeling"""
    if not text or len(text.strip()) < 50:
        return 'too_short'
    
    # Count different character types
    korean_count = sum(1 for char in text if '\uAC00' <= char <= '\uD7A3')
    chinese_count = sum(1 for char in text if '\u4E00' <= char <= '\u9FFF')
    japanese_count = sum(1 for char in text if '\u3040' <= char <= '\u309F' or '\u30A0' <= char <= '\u30FF')
    english_count = sum(1 for char in text if char.isalpha() and ord(char) < 128)
    
    total_alpha_chars = sum(1 for char in text if char.isalpha())
    if total_alpha_chars < 30:  # Lowered threshold for better detection
        return 'too_short'
    
    # Calculate if this is actually English
    if korean_count > total_alpha_chars * 0.1:
        return 'korean'
    elif chinese_count > total_alpha_chars * 0.1:
        return 'chinese'  
    elif japanese_count > total_alpha_chars * 0.1:
        return 'japanese'
    elif english_count > total_alpha_chars * 0.7:
        return 'english'
    else:
        return 'mixed'




def get_folder_path_from_metadata(metadata):
    """Helper function to get the correct folder path based on metadata"""
    current_date = datetime.datetime.now().astimezone().strftime("%Y-%m-%d")
    base_folder = os.path.join(directory, current_date) if directory else os.path.join(
        os.getcwd(), current_date)

    if metadata and metadata.get('id'):
        return os.path.join(base_folder, metadata['id'])

    if metadata and metadata.get('title'):
        return os.path.join(base_folder, clean_string(metadata['title']))

    return os.path.join(base_folder, 'unknown')


def to_camel_case(snake_str):
    components = snake_str.split('-')
    return components[0] + ''.join(x.title() for x in components[1:])


def clean_string(input_string):
    cleaned_string = re.sub(r'[^a-zA-Z0-9]+', '-',
                            input_string).strip('-').lower()
    camel_case_string = to_camel_case(cleaned_string)
    return camel_case_string


def format_metadata(metadata):
    """Format metadata into a readable string"""
    formatted_text = []

    # Add title and URL
    formatted_text.append(f"# {metadata['title']}")
    formatted_text.append(f"[Video Link]({metadata['webpage_url']})")
    formatted_text.append(f"**ID**: {metadata['id']}")

    # Add categories if present
    if metadata.get('categories'):
        formatted_text.append(
            f"**Categories**: {', '.join(metadata['categories'])}")

    # Add tags if present
    if metadata.get('tags'):
        formatted_text.append(f"**Tags**: {', '.join(metadata['tags'])}")

    # Add description if present
    if metadata.get('description'):
        formatted_text.append("\n## Description")
        formatted_text.append(metadata['description'])

    # Add chapters if present
    if metadata.get('chapters') and metadata['chapters']:
        formatted_text.append("\n## Chapters")
        for chapter in metadata['chapters']:
            start_time = chapter.get('start_time', 0)
            title = chapter.get('title', 'Untitled')
            formatted_text.append(f"- **{title}** at {start_time}s")

    return "\n".join(formatted_text)


def get_video_info_and_transcript(url):
    """Get video information and transcript using youtube-transcript-api only"""
    try:
        # Use youtube-transcript-api (cookie-free, fast, reliable)
        try:
            from .youtube_transcript_enhanced import get_video_info_and_transcript_enhanced
            enhanced_result = get_video_info_and_transcript_enhanced(url)
            if enhanced_result and enhanced_result.get('transcript'):
                print("✅ Successfully extracted transcript using youtube-transcript-api")
                return enhanced_result
            else:
                print("⚠️ youtube-transcript-api failed - no transcript available")
                return None
        except ImportError:
            print("❌ youtube-transcript-api module not available")
            return None
        except Exception as e:
            print(f"❌ youtube-transcript-api error: {e}")
            return None

    except Exception as e:
        print(f"Error: {e}")
        return None


def write_transcript_to_file(title, transcript, url, analysis, metadata=None):
    """Write transcript to file with updated path structure"""
    video_title = clean_string(title)
    file_name = f"{video_title}.txt"
    folder_path = get_folder_path_from_metadata(metadata)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    file_path = os.path.join(folder_path, file_name)

    with open(file_path, "w", encoding='utf-8') as file:
        if title:
            file.write(f"{title}\n\n")
        if url:
            file.write(f"{url}\n\n")
        if analysis:
            file.write(analysis)
            file.write("\n\n")
        file.write(transcript)

    print(f"Transcript saved to {file_name}")
    return file_path


def write_metadata_to_json(metadata, title):
    """Write metadata to a JSON file with updated path structure"""
    video_title = clean_string(title)
    file_name = f"{video_title}_metadata.json"
    folder_path = get_folder_path_from_metadata(metadata)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    file_path = os.path.join(folder_path, file_name)

    with open(file_path, "w", encoding='utf-8') as file:
        json.dump(metadata, file, indent=2, ensure_ascii=False)

    print(f"Metadata saved to {file_name}")
    return file_path


def generate_transcript(url):
    """Generate transcript using only youtube-transcript-api"""
    metadata = get_video_info_and_transcript(url)
    if not metadata or not metadata.get('title'):
        print("❌ Failed to extract video information")
        return None

    name = metadata['title']
    print("========================METADATA=========================")

    # If transcript is missing at this point, abort gracefully (downstream expects transcript)
    if not metadata.get('transcript'):
        print("❌ Failed to generate transcript")
        return None

    try:
        analysis = get_analyzer().analyze_content(metadata['transcript'])
        if analysis is None:
            print("❌ Content analysis failed - likely API key issue")
            return None
    except Exception as e:
        print(f"❌ Content analysis error: {e}")
        return None

    chapters = []
    if metadata.get('chapters'):
        for chapter in metadata['chapters']:
            if 'title' in chapter:
                chapters.append({'title': chapter['title']})

    summary_title = f"{name} Summary"
    file_metadata = {
        'title': name,
        'url': metadata.get('webpage_url', url),
        'id': metadata.get('id'),
        'categories': metadata.get('categories', []),
        'tags': metadata.get('tags', []),
        'description': metadata.get('description'),
        'chapters': chapters
    }

    file_path = write_transcript_to_file(name, metadata['transcript'], url, None, metadata)
    print(file_path)

    summary_path = write_transcript_to_file(summary_title, analysis, url, None, metadata)
    print(summary_path)

    # Write summary to Mem0 memory (best-effort, no failures propagated)
    try:
        from .mem0_integration import add_youtube_summary_memory
    except Exception:
        try:
            from lib.mem0_integration import add_youtube_summary_memory
        except Exception:
            add_youtube_summary_memory = None

    if add_youtube_summary_memory:
        try:
            add_youtube_summary_memory(
                title=name,
                video_url=metadata.get('webpage_url', url),
                video_id=metadata.get('id'),
                summary_text=analysis or "",
                tags=metadata.get('tags', [])
            )
        except Exception as e:
            print(f"⚠️ Mem0 write skipped: {e}")

    metadata_file_name = f"{clean_string(name)}_metadata.json"
    metadata_path = os.path.join(os.path.dirname(file_path), metadata_file_name)
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(file_metadata, f, indent=2, ensure_ascii=False)

    return {
        'file_path': file_path,
        'summary_path': summary_path,
        'metadata_path': metadata_path
    }


def parse_file_and_generate_transcript(file_path, max_workers=5):
    # Read URLs from file
    try:
        file_extension = os.path.splitext(file_path)[1].lower()
        urls = []

        with open(file_path, 'r', encoding='utf-8') as file:
            if file_extension == '.csv':
                reader = csv.DictReader(file)
                urls = [row['url'] for row in reader if 'url' in row]
            elif file_extension == '.json':
                data = json.load(file)
                if isinstance(data, list):
                    urls = [item['url'] for item in data if isinstance(
                        item, dict) and 'url' in item]
                elif isinstance(data, dict) and 'urls' in data:
                    urls = data['urls']
            else:
                raise ValueError(
                    f"Unsupported file extension: {file_extension}. Please use .csv or .json files.")

        if not urls:
            raise ValueError("No valid URLs found in the input file")

        # Helper function to detect YouTube URLs
        def is_youtube_url(url):
            youtube_patterns = [
                r'youtube\.com/watch\?v=',
                r'youtu\.be/',
                r'youtube\.com/shorts/',
                r'youtube\.com/playlist\?list='
            ]
            return any(re.search(pattern, url) for pattern in youtube_patterns)

        # Process URLs in parallel
        results = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {}

            # Separate YouTube URLs from other URLs
            for url in urls:
                if is_youtube_url(url):
                    # For YouTube URLs, use generate_transcript
                    future = executor.submit(generate_transcript, url)
                else:
                    # For other URLs, use web_processor.process_url
                    future = executor.submit(get_web_processor().process_url, url)

                future_to_url[future] = url

            for future in concurrent.futures.as_completed(future_to_url):
                result = future.result()
                if result:
                    results.append(result)

        return results

    except Exception as e:
        print(f"Error processing file {file_path}: {str(e)}")
        return []
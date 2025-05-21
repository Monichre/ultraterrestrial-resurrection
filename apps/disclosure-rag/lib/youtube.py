import concurrent.futures
import csv
import datetime
import json
import os
import re
from concurrent.futures import ThreadPoolExecutor

import requests
import streamlit as st
import yt_dlp
from analysis.content_analysis import ContentAnalysisEngine
from dotenv import load_dotenv
from lib.web_content_processor import WebContentProcessor

# Load environment variables
load_dotenv()
directory = os.environ.get('TRANSCRIPT_DIRECTORY_PATH')

analyzer = ContentAnalysisEngine()
web_processor = WebContentProcessor()


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
    """Get video information and transcript using yt-dlp"""
    try:
        ydl_opts = {
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitlesformat': 'vtt',
            'skip_download': True,
            'quiet': True
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            transcript_text = None

            for subtitle_type in ['subtitles', 'automatic_captions']:
                if not transcript_text and info.get(subtitle_type, {}).get('en'):
                    captions = info[subtitle_type]['en']
                    if isinstance(captions, list):
                        for fmt in captions:
                            if fmt.get('ext') == 'vtt':
                                response = requests.get(fmt['url'])
                                if response.status_code == 200:

                                    vtt_content = response.text

                                    content_parts = vtt_content.split('\n\n')
                                    transcript_parts = []
                                    for part in content_parts:
                                        if '-->' in part:  # This is a caption block

                                            lines = part.split('\n')
                                            if len(lines) > 2:  # Has timestamp and text
                                                text = ' '.join(lines[2:])

                                                text = re.sub(
                                                    '<[^>]+>', '', text)
                                                transcript_parts.append(
                                                    text.strip())
                                    transcript_text = ' '.join(
                                        transcript_parts)
                                    break

            metadata = {
                'title': info.get('title'),
                'id': info.get('id'),
                'webpage_url': url,
                'categories': info.get('categories', []),
                'tags': info.get('tags', []),
                'description': info.get('description'),
                'chapters': info.get('chapters', []),
                'transcript': transcript_text
            }
            st.write(metadata)

            return metadata

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
    metadata = get_video_info_and_transcript(url)
    if not metadata:
        return None

    # write_metadata_to_json(metadata, metadata['title'])
    # formatted_metadata = format_metadata(metadata)

    name = metadata['title']
    print("========================METADATA=========================")

    if metadata['transcript']:
        analysis = analyzer.analyze_content(metadata['transcript'])
        st.write(analysis)
        chapters = []
        if metadata['chapters'] and len(metadata['chapters']) > 0:
            for chapter in metadata['chapters']:
                chapters.append({
                    'title': chapter['title']

                })

        summary_title = f"{name} Summary"
        file_metadata = {
            'title': name,
            'url': metadata['webpage_url'],
            'id': metadata['id'],
            'categories': metadata['categories'],
            'tags': metadata['tags'],
            'description': metadata['description'],
            'chapters': chapters
        }

        file_path = write_transcript_to_file(
            name, metadata['transcript'], url, None, metadata)
        print(file_path)

        summary_path = write_transcript_to_file(
            summary_title, analysis, url, None, metadata)
        print(summary_path)

        metadata_file_name = f"{clean_string(name)}_metadata.json"

        metadata_path = os.path.join(
            os.path.dirname(file_path), metadata_file_name)
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(file_metadata, f, indent=2, ensure_ascii=False)

        return {
            'file_path': file_path,
            'summary_path': summary_path,
            'metadata_path': metadata_path
        }
    return None


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
                    future = executor.submit(web_processor.process_url, url)

                future_to_url[future] = url

            for future in concurrent.futures.as_completed(future_to_url):
                result = future.result()
                if result:
                    results.append(result)

        return results

    except Exception as e:
        print(f"Error processing file {file_path}: {str(e)}")
        return []

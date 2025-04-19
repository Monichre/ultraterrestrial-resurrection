#!/usr/bin/env python3

import argparse
import os
import sys
from datetime import datetime
import json

from lib.openai.upload import upload_file_to_openai
from lib.web_content_processor import WebContentProcessor
from lib.youtube import (generate_transcript,
                         parse_file_and_generate_transcript,
                         write_transcript_to_file)
from processing.queue import add_processed_content_to_queue

web_processor = WebContentProcessor()


def main():
    parser = argparse.ArgumentParser(
        description="Generate transcripts from YouTube videos or scrape web content.")
    parser.add_argument('--url', help="URL of the YouTube video or webpage")
    parser.add_argument('--upload', action='store_true',
                        help="Upload the content to OpenAI")
    parser.add_argument('--pdf', action='store_true')
    parser.add_argument('--file',
                        help="Provide path to the urls file", action='store_true')
    parser.add_argument('--scrape', action='store_true',
                        help="Scrape the URL instead of processing as YouTube video")
    args = parser.parse_args()

    # if args.pdf:
    #     # data = parse_file_and_generate_transcript(args.pdf)
    #     # return data

    if args.scrape and args.url:
        print(f"Scraping content from: {args.url}")
        data = web_processor.process_url(args.url)

        if data:
            content = data['content']  # type: ignore
            metadata = data['metadata']  # type: ignore
            markdown = data['markdown']  # type: ignore
            summary = data['summary']  # type: ignore
            title = metadata['title']
            summary_title = f"{title} Summary"
            url = metadata['url']

        if content and summary:
            file_path = write_transcript_to_file(title, markdown, url, None)
            summary_path = write_transcript_to_file(
                summary_title, summary, url, None)
            print(f"Content saved to: {file_path}")

            if args.upload:
                upload = upload_file_to_openai(file_path)
                summary_upload = upload_file_to_openai(summary_path)
                if data['metadata_path'] and os.path.exists(data['metadata_path']):
                    # Load metadata from file and use the object
                    with open(data['metadata_path'], 'r', encoding='utf-8') as f:
                        metadata_obj = json.load(f)
                    add_processed_content_to_queue(metadata_obj, summary_path)
                else:
                    add_processed_content_to_queue(metadata, summary_path)
                print(upload)
                print(summary_upload)
                return upload, summary_upload
            return file_path, summary_path
        else:
            print("Failed to scrape content from the URL")
            return None

    elif args.url and args.file:
        data = parse_file_and_generate_transcript(args.url)
        print(data)
        if args.upload and data and args.upload:
            if data['file_path'] and os.path.exists(data['file_path']):
                upload = upload_file_to_openai(data['file_path'])
                print(upload)
            if data['summary_path'] and os.path.exists(data['summary_path']):
                summary_upload = upload_file_to_openai(data['summary_path'])
                print(summary_upload)
            if data['metadata_path'] and os.path.exists(data['metadata_path']):
                metadata_upload = upload_file_to_openai(data['metadata_path'])
                print(metadata_upload)
                # Load metadata from file and use the object
                with open(data['metadata_path'], 'r', encoding='utf-8') as f:
                    metadata_obj = json.load(f)
                add_processed_content_to_queue(
                    metadata_obj, data['summary_path'])
            return data
        return data

    elif args.url:
        data = generate_transcript(args.url)
        if args.upload and data and args.upload:
            if data['file_path'] and os.path.exists(data['file_path']):
                upload = upload_file_to_openai(data['file_path'])
                print(upload)
            if data['summary_path'] and os.path.exists(data['summary_path']):
                summary_upload = upload_file_to_openai(data['summary_path'])
                print(summary_upload)
            if data['metadata_path'] and os.path.exists(data['metadata_path']):
                metadata_upload = upload_file_to_openai(data['metadata_path'])
                print(metadata_upload)
                # Load metadata from file and use the object
                with open(data['metadata_path'], 'r', encoding='utf-8') as f:
                    metadata_obj = json.load(f)
                add_processed_content_to_queue(
                    metadata_obj, data['summary_path'])
            return data

        else:
            print(f"The youtube video was transcribed but not uploaded")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()

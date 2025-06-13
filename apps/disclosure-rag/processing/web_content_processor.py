import json
import os
from datetime import datetime
from typing import Any, Dict

import requests
from processing.content_analysis import ContentAnalysisEngine
from bs4 import BeautifulSoup
from bs4.element import Tag
from markdownify import markdownify as md

analysis_engine = ContentAnalysisEngine()


class WebContentProcessor:
    def __init__(self):
        self.headers = {
            'User-Agent': ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                           'AppleWebKit/537.36 (KHTML, like Gecko) '
                           'Chrome/91.0.4472.124 Safari/537.36')
        }

    def html_to_markdown(self, html_content: str) -> str:
        try:
            markdown_content = md(
                html_content,
                heading_style="ATX",      # Use # style headings
                bullets="-",              # Use - for unordered lists
                code_language="python",   # Default language for code blocks
                strip=['script', 'style', 'form', 'iframe']
            )
            return markdown_content.strip()
        except Exception as e:
            print(f"Error converting HTML to Markdown: {e}")
            return ""

    def handle_pdf(self, url: str) -> Dict[str, Any]:
        try:
            # Download PDF file
            pdf_response = requests.get(url, headers=self.headers)
            pdf_response.raise_for_status()

            # Determine the case_files directory absolute path
            cases_dir = os.path.join(os.path.dirname(
                os.path.dirname(__file__)), "knowledge", "case_files")
            if not os.path.exists(cases_dir):
                os.makedirs(cases_dir)

            # Determine file path for the PDF using basename of URL, removing query parameters if any
            pdf_filename = os.path.basename(url.split("?")[0])
            pdf_filepath = os.path.join(cases_dir, pdf_filename)

            # Save downloaded PDF to the case_files directory
            with open(pdf_filepath, "wb") as f:
                f.write(pdf_response.content)

            # Convert the PDF to markdown using convert_pdf_to_markdown from document_converter
            from .document_converter import convert_pdf_to_markdown
            markdown_content = convert_pdf_to_markdown(pdf_filepath)

            # Prepare metadata using the markdown content
            metadata = {
                'url': url,
                'title': pdf_filename,
                'timestamp': datetime.now().isoformat(),
                'length': len(markdown_content)
            }
            return {
                'metadata': metadata,
                'content': markdown_content,
                'markdown': markdown_content,
                'html': f"<pre>{markdown_content}</pre>"
            }
        except Exception as e:
            print(f"Error processing PDF: {e}")
            return {
                'metadata': {
                    'url': url,
                    'title': '',
                    'timestamp': datetime.now().isoformat(),
                    'length': 0
                },
                'content': '',
                'markdown': '',
                'html': ''
            }

    def scrape_url(self, url: str) -> Dict[str, Any]:
        try:
            if url.lower().endswith('.pdf'):
                return self.handle_pdf(url)
            else:
                response = requests.get(url, headers=self.headers)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')

                # Extract title if available
                title = soup.title.string if soup.title else ""

                # Prioritize article, then main, then body
                main_content = soup.find('article') or soup.find(
                    'main') or soup.find('body')
                if main_content is None:
                    content = markdown_content = html_output = ""
                else:
                    # Remove unwanted elements if main_content is a Tag
                    if isinstance(main_content, Tag):
                        for element in main_content.find_all(['script', 'style', 'nav', 'header', 'footer', 'iframe']):
                            element.decompose()
                    content = main_content.get_text(separator='\n', strip=True) if hasattr(
                        main_content, 'get_text') else str(main_content)
                    markdown_content = self.html_to_markdown(str(main_content))
                    html_output = str(main_content)

                metadata = {
                    'url': url,
                    'title': title,
                    'timestamp': datetime.now().isoformat(),
                    'length': len(content)
                }
                return {
                    'metadata': metadata,
                    'content': content,
                    'markdown': markdown_content,
                    'html': html_output
                }
        except Exception as e:
            print(f"Error scraping URL: {e}")
            return {
                'metadata': {
                    'url': url,
                    'title': '',
                    'timestamp': datetime.now().isoformat(),
                    'length': 0
                },
                'content': '',
                'markdown': '',
                'html': ''
            }

    def process_url(self, url: str):

        processed_content = self.scrape_url(url)
        print(processed_content)
        if processed_content:
            content = processed_content['content']
            metadata = processed_content['metadata']
            summary = analysis_engine.analyze_content(content)
            print(summary)
            return {
                'content': content,
                'markdown': processed_content['markdown'],
                'html': processed_content['html'],
                'metadata': metadata,
                'summary': summary
            }

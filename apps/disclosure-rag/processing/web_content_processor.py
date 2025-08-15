import json
import os
import re
import urllib.parse
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from pathlib import Path
import hashlib
import mimetypes

import requests
from processing.content_analysis import ContentAnalysisEngine
from bs4 import BeautifulSoup
from bs4.element import Tag
from markdownify import markdownify as md
from PIL import Image, ImageFile
import base64
import io

analysis_engine = ContentAnalysisEngine()


class WebContentProcessor:
    def __init__(self, enable_media_extraction: bool = True, max_images: int = 10):
        self.headers = {
            'User-Agent': ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                           'AppleWebKit/537.36 (KHTML, like Gecko) '
                           'Chrome/91.0.4472.124 Safari/537.36')
        }
        self.enable_media_extraction = enable_media_extraction
        self.max_images = max_images
        self.session = requests.Session()
        self.session.headers.update(self.headers)

        # Setup storage directories
        self.setup_storage_directories()

        # Image processing settings
        ImageFile.LOAD_TRUNCATED_IMAGES = True

    def setup_storage_directories(self):
        """Setup directories for storing downloaded media"""
        base_dir = Path(__file__).parent.parent
        self.knowledge_dir = base_dir / "knowledge"
        self.sources_dir = self.knowledge_dir / "sources"
        self.files_dir = self.sources_dir / "files"
        self.images_dir = self.files_dir / "images"
        self.pdfs_dir = self.files_dir / "pdfs"

        # Create directories if they don't exist
        for directory in [self.knowledge_dir, self.sources_dir, self.files_dir, self.images_dir, self.pdfs_dir]:
            directory.mkdir(parents=True, exist_ok=True)

    def generate_safe_filename(self, url: str, content_type: str = None) -> str:
        """Generate a safe filename from URL and content type"""
        # Remove query parameters and fragments
        clean_url = url.split('?')[0].split('#')[0]

        # Extract filename from URL
        filename = os.path.basename(clean_url)
        if not filename:
            # Generate filename from URL hash
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            filename = f"content_{url_hash}"

        # Add extension if missing and we have content type
        if '.' not in filename and content_type:
            extension = mimetypes.guess_extension(content_type)
            if extension:
                filename += extension

        # Clean filename for filesystem safety
        filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
        return filename[:255]  # Limit length

    def download_and_analyze_image(self, img_url: str, base_url: str) -> Optional[Dict[str, Any]]:
        """Download and analyze an image"""
        try:
            # Resolve relative URLs
            full_url = urllib.parse.urljoin(base_url, img_url)

            # Download image
            response = self.session.get(full_url, timeout=30, stream=True)
            response.raise_for_status()

            # Check content type
            content_type = response.headers.get('content-type', '').lower()
            if not content_type.startswith('image/'):
                return None

            # Generate filename and save
            filename = self.generate_safe_filename(full_url, content_type)
            filepath = self.images_dir / filename

            # Download and save image
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            # Analyze image with PIL
            image_info = self.analyze_image(filepath, full_url)

            return image_info

        except Exception as e:
            print(f"Error downloading image {img_url}: {e}")
            return None

    def analyze_image(self, filepath: Path, url: str) -> Dict[str, Any]:
        """Analyze image file and extract metadata"""
        try:
            with Image.open(filepath) as img:
                # Basic image info
                info = {
                    'url': url,
                    'local_path': str(filepath),
                    'filename': filepath.name,
                    'format': img.format,
                    'mode': img.mode,
                    'size': img.size,
                    'width': img.width,
                    'height': img.height,
                    'file_size': filepath.stat().st_size,
                    'aspect_ratio': round(img.width / img.height, 2) if img.height > 0 else 0
                }

                # Extract EXIF data if available
                if hasattr(img, '_getexif') and img._getexif():
                    exif = img._getexif()
                    info['exif'] = {k: v for k, v in exif.items(
                    ) if isinstance(v, (str, int, float))}

                # Generate thumbnail for analysis
                thumbnail = img.copy()
                thumbnail.thumbnail((300, 300))

                # Convert to base64 for AI analysis
                buffer = io.BytesIO()
                thumbnail.save(buffer, format='JPEG')
                thumbnail_b64 = base64.b64encode(buffer.getvalue()).decode()
                info['thumbnail_b64'] = thumbnail_b64

                # AI-powered image analysis
                if len(thumbnail_b64) < 1000000:  # ~1MB limit
                    analysis = self.analyze_image_content(thumbnail_b64, url)
                    info.update(analysis)

                return info

        except Exception as e:
            print(f"Error analyzing image {filepath}: {e}")
            return {
                'url': url,
                'local_path': str(filepath),
                'filename': filepath.name,
                'error': str(e)
            }

    def analyze_image_content(self, thumbnail_b64: str, url: str) -> Dict[str, Any]:
        """Use AI to analyze image content and extract meaningful information"""
        try:
            # Create a combined text prompt for image analysis
            image_analysis_prompt = f"""
            Analyze this image from URL: {url}
            
            Focus on:
            1. Visual content and main subjects
            2. Any text or documents visible in the image
            3. Technical, scientific, or aerospace-related content
            4. UFO, military, or government-related elements
            5. Historical significance or time period clues
            6. Image type (photograph, document scan, diagram, illustration, etc.)
            
            Provide a structured analysis with description, key subjects, text content found, scientific elements, historical context, image type, and relevance score (1-10 for UFO/disclosure research).
            """

            # Use the existing analysis engine for text-based analysis of image context
            # In a full implementation, this would use vision-capable AI models
            context_analysis = analysis_engine.analyze_content(
                image_analysis_prompt)

            return {
                'ai_description': f"Image analysis for {os.path.basename(url)}",
                'content_type': 'image',
                'analysis_timestamp': datetime.now().isoformat(),
                'relevance_score': 5,  # Default relevance
                'context_analysis': context_analysis,
                'analysis_method': 'text_context_analysis'
            }

        except Exception as e:
            return {
                'analysis_error': str(e),
                'analysis_timestamp': datetime.now().isoformat(),
                'analysis_method': 'error'
            }

    def extract_links_from_soup(self, soup: BeautifulSoup, base_url: str) -> Dict[str, List[str]]:
        """Extract and categorize links from BeautifulSoup object"""
        links = {
            'pdfs': [],
            'images': [],
            'external_links': [],
            'related_pages': []
        }

        try:
            # Extract PDF links
            pdf_links = soup.find_all(
                'a', href=re.compile(r'\.pdf(\?.*)?$', re.I))
            for link in pdf_links:
                href = link.get('href')
                if href:
                    full_url = urllib.parse.urljoin(base_url, href)
                    links['pdfs'].append(full_url)

            # Extract image links
            img_tags = soup.find_all('img', src=True)
            for img in img_tags[:self.max_images]:  # Limit number of images
                src = img.get('src')
                if src:
                    full_url = urllib.parse.urljoin(base_url, src)
                    # Filter out small images (likely icons)
                    width = img.get('width', '0')
                    height = img.get('height', '0')
                    try:
                        if int(width) > 50 or int(height) > 50 or (width == '0' and height == '0'):
                            links['images'].append(full_url)
                    except (ValueError, TypeError):
                        links['images'].append(full_url)

            # Extract relevant external links
            all_links = soup.find_all('a', href=True)
            for link in all_links:
                href = link.get('href')
                if href and not href.startswith('#') and not href.startswith('mailto:'):
                    full_url = urllib.parse.urljoin(base_url, href)

                    # Categorize based on content or keywords
                    link_text = link.get_text(strip=True).lower()
                    href_lower = href.lower()

                    # Check for relevant keywords
                    relevant_keywords = ['ufo', 'alien', 'extraterrestrial', 'disclosure', 'classified',
                                         'military', 'government', 'sighting', 'encounter', 'phenomenon']

                    if any(keyword in link_text or keyword in href_lower for keyword in relevant_keywords):
                        links['related_pages'].append({
                            'url': full_url,
                            'text': link.get_text(strip=True),
                            'title': link.get('title', '')
                        })
                    elif full_url not in [base_url] and len(links['external_links']) < 20:
                        links['external_links'].append({
                            'url': full_url,
                            'text': link.get_text(strip=True),
                            'title': link.get('title', '')
                        })

        except Exception as e:
            print(f"Error extracting links: {e}")

        return links

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
            pdf_response = self.session.get(url, timeout=60, stream=True)
            pdf_response.raise_for_status()

            # Generate safe filename and filepath
            pdf_filename = self.generate_safe_filename(url, 'application/pdf')
            pdf_filepath = self.pdfs_dir / pdf_filename

            # Save downloaded PDF to the PDFs directory
            with open(pdf_filepath, "wb") as f:
                for chunk in pdf_response.iter_content(chunk_size=8192):
                    f.write(chunk)

            # Convert the PDF to markdown using convert_pdf_to_markdown from document_converter
            from .document_converter import convert_pdf_to_markdown
            markdown_content = convert_pdf_to_markdown(str(pdf_filepath))

            # Analyze PDF content for additional insights
            pdf_analysis = analysis_engine.analyze_content(
                markdown_content[:10000])  # Limit for analysis

            # Prepare metadata using the markdown content
            metadata = {
                'url': url,
                'title': pdf_filename,
                'local_path': str(pdf_filepath),
                'file_size': pdf_filepath.stat().st_size,
                'timestamp': datetime.now().isoformat(),
                'length': len(markdown_content),
                'content_type': 'pdf',
                'analysis': pdf_analysis
            }

            return {
                'metadata': metadata,
                'content': markdown_content,
                'markdown': markdown_content,
                'html': f"<pre>{markdown_content}</pre>",
                'media_type': 'pdf',
                'file_info': {
                    'local_path': str(pdf_filepath),
                    'file_size': pdf_filepath.stat().st_size,
                    'filename': pdf_filename
                }
            }
        except Exception as e:
            print(f"Error processing PDF: {e}")
            return {
                'metadata': {
                    'url': url,
                    'title': os.path.basename(url.split("?")[0]),
                    'timestamp': datetime.now().isoformat(),
                    'length': 0,
                    'error': str(e)
                },
                'content': '',
                'markdown': '',
                'html': '',
                'media_type': 'pdf',
                'error': str(e)
            }

    def scrape_url(self, url: str) -> Dict[str, Any]:
        try:
            # Handle PDF URLs
            if url.lower().endswith('.pdf') or 'application/pdf' in url.lower():
                return self.handle_pdf(url)

            # Handle regular web pages
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract title and meta information
            title = soup.title.string.strip() if soup.title and soup.title.string else ""
            meta_description = ""
            meta_desc_tag = soup.find('meta', attrs={'name': 'description'})
            if meta_desc_tag:
                meta_description = meta_desc_tag.get('content', '')

            # Extract and process multimedia links
            extracted_links = {}
            downloaded_media = {'images': [], 'pdfs': []}

            if self.enable_media_extraction:
                extracted_links = self.extract_links_from_soup(soup, url)

                # Download and analyze images
                for img_url in extracted_links.get('images', [])[:self.max_images]:
                    img_info = self.download_and_analyze_image(img_url, url)
                    if img_info:
                        downloaded_media['images'].append(img_info)

                # Download and process linked PDFs
                # Limit PDF downloads
                for pdf_url in extracted_links.get('pdfs', [])[:5]:
                    try:
                        pdf_info = self.handle_pdf(pdf_url)
                        if pdf_info and 'error' not in pdf_info:
                            downloaded_media['pdfs'].append(pdf_info)
                    except Exception as e:
                        print(f"Error processing linked PDF {pdf_url}: {e}")

            # Extract main content
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

            # Enhanced metadata
            metadata = {
                'url': url,
                'title': title,
                'meta_description': meta_description,
                'timestamp': datetime.now().isoformat(),
                'content_length': len(content),
                'media_extraction_enabled': self.enable_media_extraction,
                'extracted_media_counts': {
                    'images_found': len(extracted_links.get('images', [])),
                    'images_downloaded': len(downloaded_media['images']),
                    'pdfs_found': len(extracted_links.get('pdfs', [])),
                    'pdfs_downloaded': len(downloaded_media['pdfs']),
                    'related_links': len(extracted_links.get('related_pages', []))
                }
            }

            return {
                'metadata': metadata,
                'content': content,
                'markdown': markdown_content,
                'html': html_output,
                'media_type': 'webpage',
                'extracted_links': extracted_links,
                'downloaded_media': downloaded_media
            }

        except Exception as e:
            print(f"Error scraping URL: {e}")
            return {
                'metadata': {
                    'url': url,
                    'title': '',
                    'timestamp': datetime.now().isoformat(),
                    'content_length': 0,
                    'error': str(e)
                },
                'content': '',
                'markdown': '',
                'html': '',
                'media_type': 'webpage',
                'error': str(e)
            }

    def process_url(self, url: str) -> Dict[str, Any]:
        """
        Enhanced URL processing with multimedia extraction and comprehensive analysis
        """
        processed_content = self.scrape_url(url)
        print(f"Processed content keys: {processed_content.keys()}")

        if processed_content and processed_content.get('content'):
            content = processed_content['content']
            metadata = processed_content['metadata']

            # Analyze main content
            main_analysis = analysis_engine.analyze_content(content)
            print(f"Main content analysis completed")

            # Prepare multimedia summaries
            media_summaries = {
                'images': [],
                'pdfs': [],
                'related_content': []
            }

            # Summarize downloaded media
            downloaded_media = processed_content.get('downloaded_media', {})

            # Process images
            for img_info in downloaded_media.get('images', []):
                try:
                    img_summary = {
                        'url': img_info.get('url'),
                        'filename': img_info.get('filename'),
                        'size': f"{img_info.get('width', 0)}x{img_info.get('height', 0)}",
                        'file_size': img_info.get('file_size', 0),
                        'format': img_info.get('format'),
                        'ai_description': img_info.get('ai_description', ''),
                        'relevance_score': img_info.get('relevance_score', 0),
                        'local_path': img_info.get('local_path')
                    }
                    media_summaries['images'].append(img_summary)
                except Exception as e:
                    print(f"Error creating image summary: {e}")

            # Process PDFs
            for pdf_info in downloaded_media.get('pdfs', []):
                try:
                    pdf_content_preview = pdf_info.get('content', '')[:500] + "..." if len(
                        pdf_info.get('content', '')) > 500 else pdf_info.get('content', '')

                    pdf_summary = {
                        'url': pdf_info.get('metadata', {}).get('url'),
                        'filename': pdf_info.get('file_info', {}).get('filename'),
                        'file_size': pdf_info.get('file_info', {}).get('file_size', 0),
                        'content_length': len(pdf_info.get('content', '')),
                        'content_preview': pdf_content_preview,
                        'analysis': pdf_info.get('metadata', {}).get('analysis', {}),
                        'local_path': pdf_info.get('file_info', {}).get('local_path')
                    }
                    media_summaries['pdfs'].append(pdf_summary)
                except Exception as e:
                    print(f"Error creating PDF summary: {e}")

            # Process related links
            extracted_links = processed_content.get('extracted_links', {})
            for link_info in extracted_links.get('related_pages', []):
                try:
                    related_summary = {
                        'url': link_info.get('url'),
                        'title': link_info.get('text', ''),
                        'link_title': link_info.get('title', ''),
                        'relevance': 'high'  # Since these were filtered for relevant keywords
                    }
                    media_summaries['related_content'].append(related_summary)
                except Exception as e:
                    print(f"Error creating related link summary: {e}")

            # Create comprehensive summary
            comprehensive_summary = {
                'main_content': main_analysis,
                'multimedia_summary': {
                    'total_media_items': len(media_summaries['images']) + len(media_summaries['pdfs']),
                    'images_extracted': len(media_summaries['images']),
                    'pdfs_extracted': len(media_summaries['pdfs']),
                    'related_links_found': len(media_summaries['related_content']),
                    'media_storage_location': {
                        'images_dir': str(self.images_dir),
                        'pdfs_dir': str(self.pdfs_dir)
                    }
                },
                'media_details': media_summaries
            }

            print(
                f"Comprehensive analysis completed with {len(media_summaries['images'])} images and {len(media_summaries['pdfs'])} PDFs")

            return {
                'content': content,
                'markdown': processed_content['markdown'],
                'html': processed_content['html'],
                'metadata': metadata,
                'summary': comprehensive_summary,
                'media_type': processed_content.get('media_type', 'webpage'),
                'extracted_links': processed_content.get('extracted_links', {}),
                'downloaded_media': downloaded_media,
                'processing_timestamp': datetime.now().isoformat()
            }
        else:
            error_msg = processed_content.get(
                'error', 'Unknown error during processing')
            return {
                'content': '',
                'markdown': '',
                'html': '',
                'metadata': processed_content.get('metadata', {}),
                'summary': {'error': error_msg},
                'error': error_msg,
                'processing_timestamp': datetime.now().isoformat()
            }
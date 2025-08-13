#!/usr/bin/env python3
"""
Test script for the enhanced WebContentProcessor with multimedia support
"""

import os
import sys
from pathlib import Path
from pprint import pprint

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set test environment variables to avoid API key requirements
os.environ.setdefault('OPENAI_API_KEY', 'test-key')
os.environ.setdefault('ANTHROPIC_API_KEY', 'test-key')
os.environ.setdefault('GROQ_API_KEY', 'test-key')
os.environ.setdefault('DEEPSEEK_API_KEY', 'test-key')

from processing.web_content_processor import WebContentProcessor

def test_enhanced_web_processing():
    """Test the enhanced web content processor"""
    
    print("🛸 Testing Enhanced Web Content Processor with Multimedia Support")
    print("=" * 60)
    
    # Initialize processor with multimedia extraction enabled
    processor = WebContentProcessor(enable_media_extraction=True, max_images=5)
    
    # Test URLs with different types of content
    test_urls = [
        # Simple web page test
        "https://httpbin.org/html",
        
        # If you have a UFO/disclosure related URL with images/PDFs, add it here
        # "https://example-ufo-site.com/disclosure-page"
    ]
    
    for url in test_urls:
        try:
            print(f"\n📡 Processing URL: {url}")
            print("-" * 40)
            
            # Process the URL
            result = processor.process_url(url)
            
            if 'error' in result:
                print(f"❌ Error processing {url}: {result['error']}")
                continue
            
            # Display results
            metadata = result.get('metadata', {})
            summary = result.get('summary', {})
            
            print(f"📄 Title: {metadata.get('title', 'N/A')}")
            print(f"📊 Content Length: {metadata.get('content_length', 0)} characters")
            print(f"🎭 Media Type: {result.get('media_type', 'N/A')}")
            
            # Display multimedia extraction results
            if 'multimedia_summary' in summary:
                multimedia = summary['multimedia_summary']
                print(f"\n🖼️  Media Extraction Results:")
                print(f"   • Images extracted: {multimedia.get('images_extracted', 0)}")
                print(f"   • PDFs extracted: {multimedia.get('pdfs_extracted', 0)}")
                print(f"   • Related links found: {multimedia.get('related_links_found', 0)}")
                print(f"   • Total media items: {multimedia.get('total_media_items', 0)}")
            
            # Display extracted links
            extracted_links = result.get('extracted_links', {})
            if extracted_links:
                print(f"\n🔗 Links Found:")
                for link_type, links in extracted_links.items():
                    if links:
                        print(f"   • {link_type.title()}: {len(links)} found")
            
            # Display downloaded media details
            downloaded_media = result.get('downloaded_media', {})
            if downloaded_media.get('images'):
                print(f"\n🖼️  Downloaded Images:")
                for i, img in enumerate(downloaded_media['images'][:3]):  # Show first 3
                    print(f"   {i+1}. {img.get('filename', 'N/A')} ({img.get('size', 'N/A')})")
            
            if downloaded_media.get('pdfs'):
                print(f"\n📑 Downloaded PDFs:")
                for i, pdf in enumerate(downloaded_media['pdfs'][:3]):  # Show first 3
                    info = pdf.get('file_info', {})
                    size_mb = info.get('file_size', 0) / (1024 * 1024)
                    print(f"   {i+1}. {info.get('filename', 'N/A')} ({size_mb:.1f} MB)")
            
            print(f"\n✅ Successfully processed {url}")
            
        except Exception as e:
            print(f"❌ Error testing {url}: {e}")
    
    # Test storage directories
    print(f"\n📁 Storage Directories:")
    print(f"   • Images: {processor.images_dir}")
    print(f"   • PDFs: {processor.pdfs_dir}")
    print(f"   • Images directory exists: {processor.images_dir.exists()}")
    print(f"   • PDFs directory exists: {processor.pdfs_dir.exists()}")

def test_direct_pdf_processing():
    """Test direct PDF processing"""
    
    print(f"\n\n🔬 Testing Direct PDF Processing")
    print("=" * 40)
    
    processor = WebContentProcessor()
    
    # Test with a simple PDF URL (you can replace with actual UFO document URLs)
    pdf_test_urls = [
        # Add actual PDF URLs here for testing
        # "https://example.com/ufo-document.pdf"
    ]
    
    if not pdf_test_urls:
        print("📝 No PDF test URLs provided - skipping PDF tests")
        return
    
    for pdf_url in pdf_test_urls:
        try:
            print(f"📄 Processing PDF: {pdf_url}")
            result = processor.process_url(pdf_url)
            
            if 'error' in result:
                print(f"❌ Error: {result['error']}")
                continue
            
            metadata = result.get('metadata', {})
            print(f"✅ Successfully processed PDF")
            print(f"   • File size: {metadata.get('file_size', 0)} bytes")
            print(f"   • Content length: {metadata.get('length', 0)} characters")
            print(f"   • Local path: {metadata.get('local_path', 'N/A')}")
            
        except Exception as e:
            print(f"❌ Error processing PDF {pdf_url}: {e}")

if __name__ == "__main__":
    print("🚀 Starting Enhanced Web Content Processor Tests\n")
    
    try:
        test_enhanced_web_processing()
        test_direct_pdf_processing()
        
        print(f"\n🎉 All tests completed!")
        print(f"📂 Check the knowledge/case_files/ directory for downloaded media")
        
    except Exception as e:
        print(f"💥 Test suite failed: {e}")
        import traceback
        traceback.print_exc()
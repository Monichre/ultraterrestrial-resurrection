#!/usr/bin/env python3
"""
Test what we can actually download from OpenAI vector store
"""

import os
from openai import OpenAI

client = OpenAI()
vector_store_id = "vs_meWOEnUiUxtQWf0W6NBsNpCG"

def test_download_methods():
    """Test different download approaches"""
    
    # First, get a small sample of files
    try:
        response = client.vector_stores.files.list(
            vector_store_id=vector_store_id,
            limit=3
        )
        
        print(f"Testing with {len(response.data)} sample files:")
        
        for i, file in enumerate(response.data[:2]):  # Just test 2 files
            print(f"\n--- File {i+1}: {file.id} ---")
            
            # Method 1: Try vector store file content
            try:
                content = client.vector_stores.files.content(
                    vector_store_id=vector_store_id,
                    file_id=file.id
                )
                print(f"✅ Vector store content method works: {type(content)}")
                if hasattr(content, 'content'):
                    print(f"   Content length: {len(content.content)} chars")
                elif hasattr(content, 'text'):
                    print(f"   Text length: {len(content.text)} chars")
                else:
                    print(f"   Content attributes: {dir(content)}")
            except Exception as e:
                print(f"❌ Vector store content failed: {e}")
            
            # Method 2: Try regular file content
            try:
                content = client.files.retrieve_content(file.id)
                print(f"✅ Regular file content works: {type(content)}")
                print(f"   Content length: {len(content)} chars")
                print(f"   First 100 chars: {content[:100]}...")
            except Exception as e:
                print(f"❌ Regular file content failed: {e}")
            
            # Method 3: Try file.content()
            try:
                content = client.files.content(file.id)
                print(f"✅ File.content() works: {type(content)}")
                if hasattr(content, 'content'):
                    print(f"   Content length: {len(content.content)} chars")
                elif hasattr(content, 'text'):
                    print(f"   Text length: {len(content.text)} chars")
                else:
                    print(f"   Content type: {type(content)}")
                    print(f"   Content preview: {str(content)[:100]}...")
            except Exception as e:
                print(f"❌ File.content() failed: {e}")
                
    except Exception as e:
        print(f"Error getting file list: {e}")

def check_file_details():
    """Check what file details we can get"""
    try:
        response = client.vector_stores.files.list(
            vector_store_id=vector_store_id,
            limit=1
        )
        
        if response.data:
            file = response.data[0]
            print(f"\nFile details for {file.id}:")
            print(f"  Status: {file.status}")
            print(f"  Created: {file.created_at}")
            
            # Get full file details
            try:
                file_details = client.files.retrieve(file.id)
                print(f"  Filename: {getattr(file_details, 'filename', 'N/A')}")
                print(f"  Bytes: {getattr(file_details, 'bytes', 'N/A')}")
                print(f"  Purpose: {getattr(file_details, 'purpose', 'N/A')}")
            except Exception as e:
                print(f"  Could not get file details: {e}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("🧪 Testing OpenAI Vector Store Download Methods")
    print("=" * 50)
    
    check_file_details()
    test_download_methods()
    
    print("\n" + "=" * 50)
    print("💡 Summary: This will show what download methods actually work")
#!/usr/bin/env python3
"""
Fixed OpenAI Vector Store Query
Date: December 20, 2024
Uses updated OpenAI API v1.84.0+
"""

import os
import json
from datetime import datetime
import pandas as pd
from openai import OpenAI

# Initialize the OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def list_vector_store_files(vector_store_id: str) -> dict:
    """
    List all files in a vector store using the updated API
    
    Args:
        vector_store_id: ID of the vector store to query
        
    Returns:
        Dictionary with file information and metadata
    """
    try:
        # Get vector store info
        vector_store = client.vector_stores.retrieve(vector_store_id)
        print(f"Vector Store: {vector_store.name}")
        print(f"Status: {vector_store.status}")
        print(f"File Counts: {vector_store.file_counts}")
        
        files = []
        after = None
        
        # Paginate through all files
        while True:
            response = client.vector_stores.files.list(
                vector_store_id=vector_store_id,
                limit=100,
                after=after
            )
            
            print(f"Found {len(response.data)} files in this batch")
            
            if not response.data:
                break
                
            # Extract file info
            for file in response.data:
                file_info = {
                    'file_id': file.id,
                    'created_at': file.created_at,
                    'status': file.status,
                    'usage_bytes': getattr(file, 'usage_bytes', 0),
                    'chunking_strategy': getattr(file, 'chunking_strategy', None)
                }
                
                # Get additional file details
                try:
                    file_details = client.files.retrieve(file.id)
                    file_info.update({
                        'filename': getattr(file_details, 'filename', f"{file.id}.txt"),
                        'bytes': getattr(file_details, 'bytes', 0),
                        'purpose': getattr(file_details, 'purpose', 'unknown')
                    })
                except Exception as e:
                    print(f"Could not get details for file {file.id}: {e}")
                    file_info['filename'] = f"{file.id}.txt"
                    file_info['bytes'] = 0
                
                files.append(file_info)
                print(f"  - {file_info['filename']} ({file_info['bytes']} bytes)")
            
            # Get next page cursor
            after = response.last_id if hasattr(response, 'last_id') else None
            if not after:
                break
        
        result = {
            "vector_store_info": {
                "id": vector_store.id,
                "name": vector_store.name,
                "status": vector_store.status,
                "file_counts": vector_store.file_counts,
                "created_at": vector_store.created_at
            },
            "files": files,
            "total_files": len(files),
            "query_timestamp": datetime.now().isoformat()
        }
        
        # Save to JSON
        output_file = f'vector_store_analysis_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2, default=str)
        
        # Save to CSV for easy viewing
        if files:
            df = pd.DataFrame(files)
            csv_file = f'vector_store_files_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
            df.to_csv(csv_file, index=False)
            print(f"Files saved to {csv_file}")
        
        print(f"Full analysis saved to {output_file}")
        return result
        
    except Exception as e:
        print(f"Error querying vector store: {str(e)}")
        return {"error": str(e), "files": [], "total_files": 0}

def compare_with_local_files(vector_store_data):
    """Compare vector store files with local knowledge base"""
    
    # Scan local files
    local_files = []
    
    # Scan PDFs
    import glob
    for pdf in glob.glob("case_files/*.pdf"):
        local_files.append(os.path.basename(pdf))
    
    # Scan transcripts (handle nested structure)
    for txt in glob.glob("transcripts/**/*.txt", recursive=True):
        if "Summary" not in txt:  # Skip summary files
            local_files.append(os.path.basename(txt))
    
    # Get vector store filenames
    vector_files = [f['filename'] for f in vector_store_data['files']]
    
    # Compare
    local_set = set(local_files)
    vector_set = set(vector_files)
    
    comparison = {
        "local_only": sorted(list(local_set - vector_set)),
        "vector_only": sorted(list(vector_set - local_set)), 
        "in_both": sorted(list(local_set & vector_set)),
        "local_count": len(local_set),
        "vector_count": len(vector_set),
        "overlap_count": len(local_set & vector_set)
    }
    
    print(f"\n🔄 Comparison Results:")
    print(f"  📁 Local files: {comparison['local_count']}")
    print(f"  ☁️  Vector store files: {comparison['vector_count']}")
    print(f"  ✅ In both: {comparison['overlap_count']}")
    print(f"  📤 Only local: {len(comparison['local_only'])}")
    print(f"  📥 Only in vector store: {len(comparison['vector_only'])}")
    
    return comparison

if __name__ == "__main__":
    vector_store_id = "vs_meWOEnUiUxtQWf0W6NBsNpCG"
    
    print("🛸 OpenAI Vector Store Analysis")
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Query vector store
    result = list_vector_store_files(vector_store_id)
    
    if "error" not in result:
        print(f"\n✅ Successfully queried vector store")
        print(f"📊 Total files: {result['total_files']}")
        
        # Compare with local files
        comparison = compare_with_local_files(result)
        
        # Save comparison
        comparison_file = f'comparison_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(comparison_file, 'w') as f:
            json.dump({
                "vector_store_data": result,
                "comparison": comparison,
                "timestamp": datetime.now().isoformat()
            }, f, indent=2, default=str)
        
        print(f"\n📊 Comparison saved to {comparison_file}")
    else:
        print(f"❌ Failed to query vector store: {result['error']}")
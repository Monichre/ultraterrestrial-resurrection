#!/usr/bin/env python3
"""
Script to check the contents of OpenAI vector store and compare with local knowledge base
"""

import os
import json
from pathlib import Path
from openai import OpenAI
from datetime import datetime

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

VECTOR_STORE_ID = 'vs_meWOEnUiUxtQWf0W6NBsNpCG'


def get_vector_store_info():
    """Get information about the vector store"""
    try:
        vector_store = client.beta.vector_stores.retrieve(VECTOR_STORE_ID)
        print(f"Vector Store: {vector_store.name}")
        print(f"ID: {vector_store.id}")
        print(f"File Count: {vector_store.file_counts}")
        print(f"Created: {datetime.fromtimestamp(vector_store.created_at)}")
        print(f"Status: {vector_store.status}")
        return vector_store
    except Exception as e:
        print(f"Error retrieving vector store: {e}")
        return None


def list_vector_store_files():
    """List all files in the vector store"""
    try:
        files = []
        after = None

        while True:
            response = client.beta.vector_stores.files.list(
                vector_store_id=VECTOR_STORE_ID,
                limit=100,
                after=after
            )

            files.extend(response.data)

            if not response.has_more:
                break

            after = response.data[-1].id if response.data else None

        return files
    except Exception as e:
        print(f"Error listing files: {e}")
        return []


def get_file_details(file_id):
    """Get details about a specific file"""
    try:
        file = client.files.retrieve(file_id)
        return {
            'id': file.id,
            'filename': file.filename,
            'bytes': file.bytes,
            'created_at': datetime.fromtimestamp(file.created_at),
            'purpose': file.purpose
        }
    except Exception as e:
        print(f"Error retrieving file {file_id}: {e}")
        return None


def get_local_files():
    """Get all local knowledge base files"""
    knowledge_base_path = Path(__file__).parent.parent

    local_files = {
        'pdfs': [],
        'transcripts': [],
        'markdown': []
    }

    # Get PDFs
    for pdf in knowledge_base_path.glob('files/*.pdf'):
        local_files['pdfs'].append({
            'name': pdf.name,
            'size': pdf.stat().st_size,
            'path': str(pdf.relative_to(knowledge_base_path))
        })

    # Get transcripts
    for txt in knowledge_base_path.glob('transcripts/**/*.txt'):
        local_files['transcripts'].append({
            'name': txt.name,
            'size': txt.stat().st_size,
            'path': str(txt.relative_to(knowledge_base_path))
        })

    # Get markdown files
    for md in knowledge_base_path.glob('**/*.md'):
        if 'node_modules' not in str(md):
            local_files['markdown'].append({
                'name': md.name,
                'size': md.stat().st_size,
                'path': str(md.relative_to(knowledge_base_path))
            })

    return local_files


def compare_files(vector_files, local_files):
    """Compare vector store files with local files"""
    # Create sets of filenames for comparison
    vector_filenames = {f['filename'] for f in vector_files if f}

    local_pdf_names = {f['name'] for f in local_files['pdfs']}
    local_transcript_names = {f['name'] for f in local_files['transcripts']}
    local_all_names = local_pdf_names | local_transcript_names

    # Find differences
    in_vector_only = vector_filenames - local_all_names
    in_local_only = local_all_names - vector_filenames
    in_both = vector_filenames & local_all_names

    return {
        'in_vector_only': sorted(list(in_vector_only)),
        'in_local_only': sorted(list(in_local_only)),
        'in_both': sorted(list(in_both)),
        'stats': {
            'vector_total': len(vector_filenames),
            'local_total': len(local_all_names),
            'local_pdfs': len(local_pdf_names),
            'local_transcripts': len(local_transcript_names),
            'only_in_vector': len(in_vector_only),
            'only_in_local': len(in_local_only),
            'in_both': len(in_both)
        }
    }


def main():
    print("=" * 80)
    print("OpenAI Vector Store Analysis")
    print("=" * 80)

    # Get vector store info
    vector_store = get_vector_store_info()
    if not vector_store:
        return

    print("\n" + "=" * 80)
    print("Fetching vector store files...")
    print("=" * 80)

    # List all files in vector store
    vector_files = list_vector_store_files()
    print(f"\nFound {len(vector_files)} files in vector store")

    # Get details for each file
    vector_file_details = []
    for i, vf in enumerate(vector_files):
        if i % 10 == 0:
            print(f"Processing file {i+1}/{len(vector_files)}...")
        details = get_file_details(vf.id)
        if details:
            vector_file_details.append(details)

    print("\n" + "=" * 80)
    print("Analyzing local knowledge base...")
    print("=" * 80)

    # Get local files
    local_files = get_local_files()
    print(f"\nLocal files:")
    print(f"  PDFs: {len(local_files['pdfs'])}")
    print(f"  Transcripts: {len(local_files['transcripts'])}")
    print(f"  Markdown: {len(local_files['markdown'])}")

    print("\n" + "=" * 80)
    print("Comparing vector store with local files...")
    print("=" * 80)

    # Compare files
    comparison = compare_files(vector_file_details, local_files)

    print(f"\nComparison Summary:")
    print(f"  Total in vector store: {comparison['stats']['vector_total']}")
    print(f"  Total in local: {comparison['stats']['local_total']}")
    print(f"  Only in vector store: {comparison['stats']['only_in_vector']}")
    print(f"  Only in local: {comparison['stats']['only_in_local']}")
    print(f"  In both: {comparison['stats']['in_both']}")

    # Save detailed report
    report = {
        'timestamp': datetime.now().isoformat(),
        'vector_store_id': VECTOR_STORE_ID,
        'vector_store_info': {
            'name': vector_store.name,
            'file_counts': vector_store.file_counts,
            'created_at': datetime.fromtimestamp(vector_store.created_at).isoformat(),
            'status': vector_store.status
        },
        'vector_files': vector_file_details,
        'local_files': local_files,
        'comparison': comparison
    }

    report_path = Path(__file__).parent / 'vector_store_report.json'
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2, default=str)

    print(f"\nDetailed report saved to: {report_path}")

    # Print some examples of differences
    if comparison['in_vector_only']:
        print(f"\nExample files only in vector store (first 10):")
        for f in comparison['in_vector_only'][:10]:
            print(f"  - {f}")

    if comparison['in_local_only']:
        print(f"\nExample files only in local (first 10):")
        for f in comparison['in_local_only'][:10]:
            print(f"  - {f}")


if __name__ == '__main__':
    main()

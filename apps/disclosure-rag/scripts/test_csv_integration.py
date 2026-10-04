#!/usr/bin/env python3
"""
CSV Integration Test Script
Date: July 9, 2025 at 07:52 PST

Quick test script to validate CSV integration functionality with sample data.
"""

import asyncio
import json
import tempfile
import pandas as pd
from pathlib import Path
from typing import Dict, List, Any
import sys
import os

# Add the lib directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib'))

from csv_integration import CSVTripleRAGIntegration

def create_sample_csv_files(temp_dir: Path) -> Dict[str, str]:
    """
    Create sample CSV files for testing
    
    Args:
        temp_dir: Temporary directory for CSV files
        
    Returns:
        Dictionary of created files
    """
    files_created = {}
    
    # Sample documents data
    documents_data = [
        {
            'id': 'doc_001',
            'title': 'UFO Sighting Report 1947',
            'summary': 'Detailed report of unidentified flying object sighting near Roswell, New Mexico in July 1947. Witness described metallic disc-shaped craft with unusual flight patterns.',
            'url': 'https://example.com/ufo-report-1947',
            'metadata': '{"location": "Roswell, NM", "witness_count": 3, "classification": "unidentified"}',
            'embedding': json.dumps([0.1, -0.2, 0.3] + [0.0] * 381),  # 384D vector
            'created_at': '2024-01-01T00:00:00Z',
            'source_type': 'government_report'
        },
        {
            'id': 'doc_002',
            'title': 'Project Blue Book Analysis',
            'summary': 'Comprehensive analysis of Project Blue Book findings from 1952-1969. Includes statistical analysis of 12,618 UFO reports and categorization of explained vs unexplained cases.',
            'url': 'https://example.com/blue-book-analysis',
            'metadata': '{"project": "Blue Book", "timeframe": "1952-1969", "total_cases": 12618}',
            'embedding': json.dumps([0.2, -0.1, 0.4] + [0.0] * 381),
            'created_at': '2024-01-02T00:00:00Z',
            'source_type': 'military_document'
        },
        {
            'id': 'doc_003',
            'title': 'Recent UAP Disclosure',
            'summary': 'Pentagon releases three videos of unidentified aerial phenomena. Navy confirms authenticity of videos showing objects with flight characteristics beyond known technology.',
            'url': 'https://example.com/pentagon-uap-disclosure',
            'metadata': '{"source": "Pentagon", "videos": 3, "classification": "declassified"}',
            'embedding': json.dumps([0.3, -0.3, 0.2] + [0.0] * 381),
            'created_at': '2024-01-03T00:00:00Z',
            'source_type': 'official_disclosure'
        }
    ]
    
    # Sample chunks data
    chunks_data = [
        {
            'id': 'chunk_001',
            'document_id': 'doc_001',
            'content': 'On July 8, 1947, at approximately 14:30 hours, three witnesses observed a metallic disc-shaped object flying at high altitude over Roswell, New Mexico.',
            'chunk_index': 0,
            'token_count': 25,
            'page_number': 1,
            'heading': '# Initial Sighting Report',
            'embedding': json.dumps([0.1, -0.2, 0.3] + [0.0] * 381),
            'created_at': '2024-01-01T00:00:00Z'
        },
        {
            'id': 'chunk_002',
            'document_id': 'doc_001',
            'content': 'The object displayed unusual flight characteristics including rapid acceleration, silent operation, and ability to change direction without banking.',
            'chunk_index': 1,
            'token_count': 20,
            'page_number': 1,
            'heading': '## Flight Characteristics',
            'embedding': json.dumps([0.2, -0.1, 0.4] + [0.0] * 381),
            'created_at': '2024-01-01T00:00:00Z'
        },
        {
            'id': 'chunk_003',
            'document_id': 'doc_002',
            'content': 'Project Blue Book was the official U.S. Air Force investigation of UFOs from 1952 to 1969. The project investigated 12,618 reported sightings.',
            'chunk_index': 0,
            'token_count': 28,
            'page_number': 1,
            'heading': '# Project Overview',
            'embedding': json.dumps([0.3, -0.3, 0.2] + [0.0] * 381),
            'created_at': '2024-01-02T00:00:00Z'
        }
    ]
    
    # Sample entities data
    entities_data = [
        {
            'id': 'entity_001',
            'document_id': 'doc_001',
            'entity_type': 'location',
            'entity_data': '{"name": "Roswell, New Mexico", "coordinates": [33.3872, -104.5281], "significance": "UFO incident location"}',
            'confidence': 0.95,
            'metadata': '{"extraction_method": "NER", "source": "text_analysis"}',
            'created_at': '2024-01-01T00:00:00Z'
        },
        {
            'id': 'entity_002',
            'document_id': 'doc_001',
            'entity_type': 'date',
            'entity_data': '{"date": "1947-07-08", "description": "Date of UFO sighting"}',
            'confidence': 0.99,
            'metadata': '{"extraction_method": "date_parser", "source": "text_analysis"}',
            'created_at': '2024-01-01T00:00:00Z'
        },
        {
            'id': 'entity_003',
            'document_id': 'doc_002',
            'entity_type': 'organization',
            'entity_data': '{"name": "U.S. Air Force", "role": "UFO investigation", "project": "Blue Book"}',
            'confidence': 0.98,
            'metadata': '{"extraction_method": "NER", "source": "text_analysis"}',
            'created_at': '2024-01-02T00:00:00Z'
        }
    ]
    
    # Sample processing tasks data
    tasks_data = [
        {
            'id': 'task_001',
            'document_id': 'doc_001',
            'task_type': 'document_processing',
            'status': 'completed',
            'started_at': '2024-01-01T10:00:00Z',
            'completed_at': '2024-01-01T10:05:00Z',
            'metadata': '{"processing_time": 300, "backend": "triple_rag", "version": "1.0"}'
        },
        {
            'id': 'task_002',
            'document_id': 'doc_001',
            'task_type': 'chunk_processing',
            'status': 'completed',
            'started_at': '2024-01-01T10:05:00Z',
            'completed_at': '2024-01-01T10:06:00Z',
            'metadata': '{"chunks_processed": 2, "backend": "triple_rag", "version": "1.0"}'
        },
        {
            'id': 'task_003',
            'document_id': 'doc_002',
            'task_type': 'entity_extraction',
            'status': 'running',
            'started_at': '2024-01-02T10:00:00Z',
            'completed_at': None,
            'metadata': '{"extraction_method": "NER", "backend": "xata_only", "version": "1.0"}'
        }
    ]
    
    # Create CSV files
    datasets = {
        'documents.csv': documents_data,
        'document_chunks.csv': chunks_data,
        'document_entities.csv': entities_data,
        'document_processing_tasks.csv': tasks_data
    }
    
    for filename, data in datasets.items():
        file_path = temp_dir / filename
        df = pd.DataFrame(data)
        df.to_csv(file_path, index=False)
        files_created[filename] = str(file_path)
        print(f"✅ Created sample CSV: {filename} ({len(data)} records)")
    
    return files_created

async def test_csv_integration():
    """
    Test CSV integration with sample data
    """
    print("🧪 Testing CSV Integration with Sample Data")
    print("=" * 50)
    
    # Create temporary directory for test files
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Create sample CSV files
        print("\n📁 Creating sample CSV files...")
        sample_files = create_sample_csv_files(temp_path)
        
        # Initialize CSV integration
        print("\n🔧 Initializing CSV integration...")
        csv_integration = CSVTripleRAGIntegration(csv_directory=str(temp_path))
        
        # Test validation
        print("\n🔍 Validating CSV directory...")
        validation_result = csv_integration.validate_csv_directory()
        print(f"Validation status: {validation_result['status']}")
        print(f"Found files: {len(validation_result['found_files'])}")
        
        if validation_result['status'] == 'invalid':
            print(f"❌ Validation failed: {validation_result['errors']}")
            return False
        
        # Test schema analysis
        print("\n📊 Analyzing CSV schemas...")
        for filename in validation_result['found_files']:
            data = csv_integration.load_csv_data(filename)
            table_name = filename.replace('.csv', '')
            analysis = csv_integration.analyze_csv_schema(data, table_name)
            print(f"  {filename}: {analysis['record_count']} records, {analysis['column_count']} columns")
        
        # Test complete integration (with mock backends)
        print("\n🚀 Running complete integration test...")
        try:
            integration_results = await csv_integration.run_complete_integration()
            
            # Display results
            print(f"\n📈 Integration Results:")
            print(f"Status: {integration_results['status']}")
            
            if 'statistics' in integration_results:
                stats = integration_results['statistics']['overall']
                print(f"Total processed: {stats['total_processed']}")
                print(f"Success rate: {stats['success_rate']:.1f}%")
                
                # Show details by type
                for data_type, results in integration_results['statistics']['by_type'].items():
                    if results['processed'] > 0:
                        success_rate = (results['successful'] / results['processed']) * 100
                        print(f"  {data_type}: {results['successful']}/{results['processed']} ({success_rate:.1f}%)")
            
            # Save test results
            test_results_file = "test_csv_integration_results.json"
            with open(test_results_file, 'w') as f:
                json.dump(integration_results, f, indent=2, default=str)
            print(f"\n💾 Test results saved to: {test_results_file}")
            
            return True
            
        except Exception as e:
            print(f"❌ Integration test failed: {e}")
            return False

def test_individual_components():
    """
    Test individual components of the integration system
    """
    print("\n🔧 Testing Individual Components")
    print("-" * 30)
    
    try:
        # Test adapter
        print("Testing TripleRAGSchemaAdapter...")
        from adapters.triple_rag_schema_adapter import TripleRAGSchemaAdapter
        adapter = TripleRAGSchemaAdapter()
        
        # Test document adaptation
        sample_doc = {
            'id': 'test_doc',
            'title': 'Test Document',
            'summary': 'This is a test document.',
            'metadata': '{"test": true}',
            'embedding': [0.1, 0.2, 0.3] + [0.0] * 381
        }
        
        adapted_doc = adapter.adapt_document(sample_doc)
        print(f"✅ Document adaptation successful: {adapted_doc.id}")
        
        # Test chunk adaptation
        sample_chunk = {
            'id': 'test_chunk',
            'document_id': 'test_doc',
            'content': 'This is a test chunk.',
            'chunk_index': 0,
            'embedding': [0.1, 0.2, 0.3] + [0.0] * 381
        }
        
        adapted_chunk = adapter.adapt_chunk(sample_chunk)
        print(f"✅ Chunk adaptation successful: {adapted_chunk.id}")
        
        return True
        
    except Exception as e:
        print(f"❌ Component test failed: {e}")
        return False

async def main():
    """
    Main test execution
    """
    print("🚀 CSV Integration Test Suite")
    print("=" * 50)
    
    # Test individual components
    components_ok = test_individual_components()
    
    if not components_ok:
        print("\n❌ Component tests failed - skipping integration test")
        return
    
    # Test complete integration
    integration_ok = await test_csv_integration()
    
    # Final results
    print("\n" + "=" * 50)
    if components_ok and integration_ok:
        print("✅ All tests passed! CSV integration is ready for use.")
        print("\n🎯 Next steps:")
        print("1. Place your CSV files in the csv_exports/ directory")
        print("2. Run: python scripts/prepare_csv_integration.py")
        print("3. Run: python scripts/csv_integration.py")
    else:
        print("❌ Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    asyncio.run(main())
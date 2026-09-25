#!/usr/bin/env python3
"""
CSV Data Integration Script for Triple RAG System
Date: July 9, 2025 at 07:50 PST

Processes CSV exports from Xata database and integrates them into Triple RAG system
using the adapter pattern. This script validates the current schema compatibility
and demonstrates seamless integration with all backends.
"""

import asyncio
import csv
import json
import logging
import pandas as pd
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import sys
import os

# Add the lib directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib'))

from adapters.triple_rag_schema_adapter import TripleRAGSchemaAdapter
from integrations.triple_rag_integration import TripleRAGIntegration

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class CSVTripleRAGIntegration:
    """
    Handles CSV data integration with Triple RAG system
    
    This class processes CSV exports from Xata database, validates schema
    compatibility, and integrates data into Triple RAG backends using
    the adapter pattern.
    """
    
    def __init__(self, csv_directory: str = "csv_exports"):
        """
        Initialize CSV integration
        
        Args:
            csv_directory: Directory containing CSV export files
        """
        self.csv_directory = Path(csv_directory)
        self.results = {
            'documents': {'processed': 0, 'successful': 0, 'failed': 0, 'errors': []},
            'chunks': {'processed': 0, 'successful': 0, 'failed': 0, 'errors': []},
            'entities': {'processed': 0, 'successful': 0, 'failed': 0, 'errors': []},
            'processing_tasks': {'processed': 0, 'successful': 0, 'failed': 0, 'errors': []}
        }
        
        # Initialize adapter and integration
        self.adapter = TripleRAGSchemaAdapter()
        self.integration = TripleRAGIntegration()
        
        logger.info(f"CSV Integration initialized for directory: {csv_directory}")
    
    def validate_csv_directory(self) -> Dict[str, Any]:
        """
        Validate CSV directory structure and files
        
        Returns:
            Dict containing validation results
        """
        validation_result = {
            'status': 'valid',
            'found_files': [],
            'missing_files': [],
            'errors': []
        }
        
        expected_files = [
            'documents.csv',
            'document_chunks.csv',
            'document_entities.csv',
            'document_processing_tasks.csv'
        ]
        
        if not self.csv_directory.exists():
            validation_result['status'] = 'invalid'
            validation_result['errors'].append(f"CSV directory not found: {self.csv_directory}")
            return validation_result
        
        # Check for expected files
        for filename in expected_files:
            file_path = self.csv_directory / filename
            if file_path.exists():
                validation_result['found_files'].append(filename)
                logger.info(f"Found CSV file: {filename}")
            else:
                validation_result['missing_files'].append(filename)
                logger.warning(f"Missing CSV file: {filename}")
        
        # Check if we have at least documents and chunks
        if 'documents.csv' not in validation_result['found_files']:
            validation_result['status'] = 'invalid'
            validation_result['errors'].append("Required file documents.csv not found")
        
        if 'document_chunks.csv' not in validation_result['found_files']:
            validation_result['status'] = 'invalid'
            validation_result['errors'].append("Required file document_chunks.csv not found")
        
        return validation_result
    
    def load_csv_data(self, filename: str) -> List[Dict[str, Any]]:
        """
        Load CSV data into list of dictionaries
        
        Args:
            filename: CSV filename to load
            
        Returns:
            List of dictionaries containing CSV data
        """
        file_path = self.csv_directory / filename
        
        if not file_path.exists():
            logger.error(f"CSV file not found: {file_path}")
            return []
        
        try:
            # Use pandas for better CSV handling
            df = pd.read_csv(file_path)
            
            # Convert to list of dictionaries
            records = df.to_dict('records')
            
            # Clean up NaN values
            cleaned_records = []
            for record in records:
                cleaned_record = {}
                for key, value in record.items():
                    if pd.isna(value):
                        cleaned_record[key] = None
                    else:
                        cleaned_record[key] = value
                cleaned_records.append(cleaned_record)
            
            logger.info(f"Loaded {len(cleaned_records)} records from {filename}")
            return cleaned_records
            
        except Exception as e:
            logger.error(f"Error loading CSV file {filename}: {e}")
            return []
    
    def analyze_csv_schema(self, data: List[Dict[str, Any]], table_name: str) -> Dict[str, Any]:
        """
        Analyze CSV schema structure
        
        Args:
            data: List of CSV records
            table_name: Name of the table/CSV
            
        Returns:
            Schema analysis results
        """
        if not data:
            return {'status': 'empty', 'columns': [], 'sample_record': None}
        
        sample_record = data[0]
        columns = list(sample_record.keys())
        
        analysis = {
            'status': 'valid',
            'table_name': table_name,
            'record_count': len(data),
            'columns': columns,
            'column_count': len(columns),
            'sample_record': sample_record,
            'column_types': {},
            'null_percentages': {},
            'adapter_compatibility': {}
        }
        
        # Analyze column types and null percentages
        for column in columns:
            values = [record.get(column) for record in data]
            non_null_values = [v for v in values if v is not None]
            
            analysis['null_percentages'][column] = (len(values) - len(non_null_values)) / len(values) * 100
            
            if non_null_values:
                sample_value = non_null_values[0]
                analysis['column_types'][column] = type(sample_value).__name__
            else:
                analysis['column_types'][column] = 'null'
        
        # Check adapter compatibility
        if table_name == 'documents':
            required_fields = ['id', 'title', 'summary']
            optional_fields = ['url', 'metadata', 'embedding', 'created_at']
        elif table_name == 'document_chunks':
            required_fields = ['id', 'document_id', 'content']
            optional_fields = ['chunk_index', 'token_count', 'page_number', 'heading', 'embedding']
        elif table_name == 'document_entities':
            required_fields = ['id', 'document_id', 'entity_type', 'entity_data']
            optional_fields = ['confidence', 'metadata']
        elif table_name == 'document_processing_tasks':
            required_fields = ['id', 'document_id', 'task_type', 'status']
            optional_fields = ['started_at', 'completed_at', 'metadata']
        else:
            required_fields = []
            optional_fields = []
        
        # Check field presence
        for field in required_fields:
            if field in columns:
                analysis['adapter_compatibility'][field] = 'present'
            else:
                analysis['adapter_compatibility'][field] = 'missing'
        
        for field in optional_fields:
            if field in columns:
                analysis['adapter_compatibility'][field] = 'present'
            else:
                analysis['adapter_compatibility'][field] = 'optional_missing'
        
        return analysis
    
    async def process_documents(self, documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process documents through Triple RAG pipeline
        
        Args:
            documents: List of document records from CSV
            
        Returns:
            Processing results
        """
        logger.info(f"Processing {len(documents)} documents...")
        
        # Initialize backends
        await self.integration.initialize_backends()
        
        # Process documents in batches
        batch_results = await self.integration.process_batch_documents(documents)
        
        # Update results
        self.results['documents']['processed'] = len(documents)
        self.results['documents']['successful'] = batch_results['successful']
        self.results['documents']['failed'] = batch_results['failed']
        self.results['documents']['errors'] = batch_results['errors']
        
        logger.info(f"Document processing completed: {batch_results['successful']}/{len(documents)} successful")
        return batch_results
    
    async def process_chunks(self, chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process chunks through Triple RAG pipeline
        
        Args:
            chunks: List of chunk records from CSV
            
        Returns:
            Processing results
        """
        logger.info(f"Processing {len(chunks)} chunks...")
        
        # Process chunks in batches
        batch_results = await self.integration.process_batch_chunks(chunks)
        
        # Update results
        self.results['chunks']['processed'] = len(chunks)
        self.results['chunks']['successful'] = batch_results['successful']
        self.results['chunks']['failed'] = batch_results['failed']
        self.results['chunks']['errors'] = batch_results['errors']
        
        logger.info(f"Chunk processing completed: {batch_results['successful']}/{len(chunks)} successful")
        return batch_results
    
    def process_entities(self, entities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process entities using adapter pattern
        
        Args:
            entities: List of entity records from CSV
            
        Returns:
            Processing results
        """
        logger.info(f"Processing {len(entities)} entities...")
        
        processed_entities = []
        failed_entities = []
        
        for entity in entities:
            try:
                adapted_entity = self.adapter.adapt_entity(entity)
                processed_entities.append(adapted_entity)
            except Exception as e:
                logger.error(f"Error processing entity {entity.get('id', 'unknown')}: {e}")
                failed_entities.append({
                    'entity_id': entity.get('id', 'unknown'),
                    'error': str(e)
                })
        
        # Update results
        self.results['entities']['processed'] = len(entities)
        self.results['entities']['successful'] = len(processed_entities)
        self.results['entities']['failed'] = len(failed_entities)
        self.results['entities']['errors'] = failed_entities
        
        logger.info(f"Entity processing completed: {len(processed_entities)}/{len(entities)} successful")
        
        return {
            'total_entities': len(entities),
            'successful': len(processed_entities),
            'failed': len(failed_entities),
            'processed_entities': processed_entities,
            'errors': failed_entities
        }
    
    def process_processing_tasks(self, tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process processing tasks using adapter pattern
        
        Args:
            tasks: List of processing task records from CSV
            
        Returns:
            Processing results
        """
        logger.info(f"Processing {len(tasks)} processing tasks...")
        
        processed_tasks = []
        failed_tasks = []
        
        for task in tasks:
            try:
                adapted_task = self.adapter.adapt_processing_task(task)
                processed_tasks.append(adapted_task)
            except Exception as e:
                logger.error(f"Error processing task {task.get('id', 'unknown')}: {e}")
                failed_tasks.append({
                    'task_id': task.get('id', 'unknown'),
                    'error': str(e)
                })
        
        # Update results
        self.results['processing_tasks']['processed'] = len(tasks)
        self.results['processing_tasks']['successful'] = len(processed_tasks)
        self.results['processing_tasks']['failed'] = len(failed_tasks)
        self.results['processing_tasks']['errors'] = failed_tasks
        
        logger.info(f"Processing task adaptation completed: {len(processed_tasks)}/{len(tasks)} successful")
        
        return {
            'total_tasks': len(tasks),
            'successful': len(processed_tasks),
            'failed': len(failed_tasks),
            'processed_tasks': processed_tasks,
            'errors': failed_tasks
        }
    
    async def run_complete_integration(self) -> Dict[str, Any]:
        """
        Run complete CSV integration process
        
        Returns:
            Complete integration results
        """
        logger.info("Starting complete CSV integration process...")
        
        # Validate CSV directory
        validation_result = self.validate_csv_directory()
        if validation_result['status'] == 'invalid':
            logger.error(f"CSV validation failed: {validation_result['errors']}")
            return {
                'status': 'failed',
                'validation': validation_result,
                'results': self.results
            }
        
        integration_results = {
            'status': 'success',
            'validation': validation_result,
            'schema_analysis': {},
            'processing_results': {},
            'statistics': {},
            'timestamp': datetime.now().isoformat()
        }
        
        # Process each CSV file
        for filename in validation_result['found_files']:
            table_name = filename.replace('.csv', '')
            logger.info(f"Processing {table_name}...")
            
            # Load CSV data
            data = self.load_csv_data(filename)
            if not data:
                continue
            
            # Analyze schema
            schema_analysis = self.analyze_csv_schema(data, table_name)
            integration_results['schema_analysis'][table_name] = schema_analysis
            
            # Process data based on type
            if table_name == 'documents':
                processing_result = await self.process_documents(data)
                integration_results['processing_results']['documents'] = processing_result
            elif table_name == 'document_chunks':
                processing_result = await self.process_chunks(data)
                integration_results['processing_results']['chunks'] = processing_result
            elif table_name == 'document_entities':
                processing_result = self.process_entities(data)
                integration_results['processing_results']['entities'] = processing_result
            elif table_name == 'document_processing_tasks':
                processing_result = self.process_processing_tasks(data)
                integration_results['processing_results']['processing_tasks'] = processing_result
        
        # Generate statistics
        integration_results['statistics'] = self.generate_integration_statistics()
        
        # Get Triple RAG integration statistics
        triple_rag_stats = self.integration.get_statistics()
        integration_results['triple_rag_statistics'] = triple_rag_stats
        
        logger.info("Complete CSV integration process finished")
        return integration_results
    
    def generate_integration_statistics(self) -> Dict[str, Any]:
        """
        Generate comprehensive integration statistics
        
        Returns:
            Integration statistics
        """
        total_processed = sum(self.results[key]['processed'] for key in self.results)
        total_successful = sum(self.results[key]['successful'] for key in self.results)
        total_failed = sum(self.results[key]['failed'] for key in self.results)
        
        statistics = {
            'overall': {
                'total_processed': total_processed,
                'total_successful': total_successful,
                'total_failed': total_failed,
                'success_rate': (total_successful / total_processed * 100) if total_processed > 0 else 0
            },
            'by_type': self.results.copy(),
            'generated_at': datetime.now().isoformat()
        }
        
        return statistics
    
    def save_results(self, results: Dict[str, Any], output_file: str = "csv_integration_results.json") -> None:
        """
        Save integration results to JSON file
        
        Args:
            results: Integration results to save
            output_file: Output filename
        """
        try:
            with open(output_file, 'w') as f:
                json.dump(results, f, indent=2, default=str)
            logger.info(f"Integration results saved to {output_file}")
        except Exception as e:
            logger.error(f"Error saving results: {e}")

async def main():
    """
    Main execution function
    """
    print("🚀 CSV Triple RAG Integration Script")
    print("=" * 50)
    
    # Initialize integration
    csv_integration = CSVTripleRAGIntegration()
    
    # Run complete integration
    try:
        results = await csv_integration.run_complete_integration()
        
        # Display results
        print("\n📊 Integration Results:")
        print(f"Status: {results['status']}")
        
        if 'statistics' in results:
            stats = results['statistics']['overall']
            print(f"Total Processed: {stats['total_processed']}")
            print(f"Total Successful: {stats['total_successful']}")
            print(f"Total Failed: {stats['total_failed']}")
            print(f"Success Rate: {stats['success_rate']:.1f}%")
        
        # Save results
        csv_integration.save_results(results)
        
        print("\n✅ CSV integration completed successfully!")
        print("📄 Results saved to csv_integration_results.json")
        
    except Exception as e:
        logger.error(f"Integration failed: {e}")
        print(f"\n❌ Integration failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
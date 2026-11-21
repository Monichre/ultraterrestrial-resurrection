#!/usr/bin/env python3
"""
CSV Integration Preparation Script
Date: July 9, 2025 at 07:51 PST

Prepares CSV files for Triple RAG integration by validating schema compatibility,
cleaning data, and setting up the proper directory structure.
"""

import json
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging
import sys
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class CSVPreparation:
    """
    Handles CSV file preparation for Triple RAG integration
    """
    
    def __init__(self, input_directory: str = ".", output_directory: str = "csv_exports"):
        """
        Initialize CSV preparation
        
        Args:
            input_directory: Directory containing raw CSV files
            output_directory: Directory for prepared CSV files
        """
        self.input_dir = Path(input_directory)
        self.output_dir = Path(output_directory)
        self.output_dir.mkdir(exist_ok=True)
        
        # Schema requirements for each table
        self.schema_requirements = {
            'documents': {
                'required': ['id', 'title', 'summary'],
                'optional': ['url', 'metadata', 'embedding', 'created_at', 'source_type', 'file_path'],
                'renamed_fields': {
                    'content': 'summary',  # Map content to summary for Triple RAG
                    'name': 'title',       # Map name to title if needed
                    'source': 'source_type'
                }
            },
            'document_chunks': {
                'required': ['id', 'document_id', 'content'],
                'optional': ['chunk_index', 'token_count', 'page_number', 'heading', 'embedding', 'created_at'],
                'renamed_fields': {
                    'text': 'content',     # Map text to content if needed
                    'index': 'chunk_index'
                }
            },
            'document_entities': {
                'required': ['id', 'document_id', 'entity_type', 'entity_data'],
                'optional': ['confidence', 'metadata', 'created_at'],
                'renamed_fields': {
                    'type': 'entity_type',
                    'data': 'entity_data'
                }
            },
            'document_processing_tasks': {
                'required': ['id', 'document_id', 'task_type', 'status'],
                'optional': ['started_at', 'completed_at', 'metadata', 'error_message'],
                'renamed_fields': {
                    'type': 'task_type',
                    'state': 'status'
                }
            }
        }
        
        self.preparation_results = {
            'files_found': [],
            'files_processed': [],
            'errors': [],
            'warnings': [],
            'statistics': {}
        }
    
    def discover_csv_files(self) -> List[Path]:
        """
        Discover CSV files in input directory
        
        Returns:
            List of discovered CSV files
        """
        csv_files = []
        
        for file_path in self.input_dir.glob("*.csv"):
            csv_files.append(file_path)
            self.preparation_results['files_found'].append(str(file_path))
            logger.info(f"Found CSV file: {file_path.name}")
        
        return csv_files
    
    def analyze_csv_structure(self, file_path: Path) -> Dict[str, Any]:
        """
        Analyze CSV file structure and compatibility
        
        Args:
            file_path: Path to CSV file
            
        Returns:
            Analysis results
        """
        logger.info(f"Analyzing CSV structure: {file_path.name}")
        
        try:
            # Load CSV
            df = pd.read_csv(file_path)
            
            # Basic analysis
            analysis = {
                'filename': file_path.name,
                'record_count': len(df),
                'column_count': len(df.columns),
                'columns': list(df.columns),
                'data_types': df.dtypes.to_dict(),
                'null_counts': df.isnull().sum().to_dict(),
                'sample_records': df.head(3).to_dict('records'),
                'schema_compatibility': {},
                'suggested_table_type': None
            }
            
            # Determine table type based on filename or columns
            table_type = self._determine_table_type(file_path.name, df.columns)
            analysis['suggested_table_type'] = table_type
            
            # Check schema compatibility
            if table_type:
                compatibility = self._check_schema_compatibility(df, table_type)
                analysis['schema_compatibility'] = compatibility
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing CSV {file_path.name}: {e}")
            return {
                'filename': file_path.name,
                'error': str(e),
                'schema_compatibility': {'status': 'error'}
            }
    
    def _determine_table_type(self, filename: str, columns: List[str]) -> Optional[str]:
        """
        Determine table type based on filename and columns
        
        Args:
            filename: CSV filename
            columns: List of column names
            
        Returns:
            Suggested table type
        """
        filename_lower = filename.lower()
        
        # Check filename patterns
        if 'document' in filename_lower and 'chunk' in filename_lower:
            return 'document_chunks'
        elif 'document' in filename_lower and 'entit' in filename_lower:
            return 'document_entities'
        elif 'document' in filename_lower and ('task' in filename_lower or 'process' in filename_lower):
            return 'document_processing_tasks'
        elif 'document' in filename_lower:
            return 'documents'
        
        # Check column patterns
        column_set = set(col.lower() for col in columns)
        
        if 'content' in column_set and 'document_id' in column_set and 'chunk' in str(columns).lower():
            return 'document_chunks'
        elif 'entity_type' in column_set or 'entity_data' in column_set:
            return 'document_entities'
        elif 'task_type' in column_set or ('status' in column_set and 'started_at' in column_set):
            return 'document_processing_tasks'
        elif 'title' in column_set or 'summary' in column_set:
            return 'documents'
        
        return None
    
    def _check_schema_compatibility(self, df: pd.DataFrame, table_type: str) -> Dict[str, Any]:
        """
        Check schema compatibility with Triple RAG requirements
        
        Args:
            df: DataFrame to check
            table_type: Type of table (documents, chunks, etc.)
            
        Returns:
            Compatibility analysis
        """
        if table_type not in self.schema_requirements:
            return {'status': 'unknown_table_type'}
        
        requirements = self.schema_requirements[table_type]
        columns = set(df.columns)
        
        compatibility = {
            'status': 'compatible',
            'required_fields': {},
            'optional_fields': {},
            'extra_fields': [],
            'suggestions': []
        }
        
        # Check required fields
        for field in requirements['required']:
            if field in columns:
                compatibility['required_fields'][field] = 'present'
            else:
                # Check if field can be renamed
                found_renamed = False
                for rename_from, rename_to in requirements['renamed_fields'].items():
                    if rename_to == field and rename_from in columns:
                        compatibility['required_fields'][field] = f'rename_from_{rename_from}'
                        compatibility['suggestions'].append(f"Rename '{rename_from}' to '{field}'")
                        found_renamed = True
                        break
                
                if not found_renamed:
                    compatibility['required_fields'][field] = 'missing'
                    compatibility['status'] = 'incompatible'
        
        # Check optional fields
        for field in requirements['optional']:
            if field in columns:
                compatibility['optional_fields'][field] = 'present'
            else:
                compatibility['optional_fields'][field] = 'missing'
        
        # Check for extra fields
        expected_fields = set(requirements['required'] + requirements['optional'])
        extra_fields = columns - expected_fields
        compatibility['extra_fields'] = list(extra_fields)
        
        if extra_fields:
            compatibility['suggestions'].append(f"Extra fields found: {', '.join(extra_fields)}")
        
        return compatibility
    
    def prepare_csv_file(self, file_path: Path, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepare CSV file for Triple RAG integration
        
        Args:
            file_path: Path to source CSV file
            analysis: Analysis results from analyze_csv_structure
            
        Returns:
            Preparation results
        """
        logger.info(f"Preparing CSV file: {file_path.name}")
        
        try:
            # Load CSV
            df = pd.read_csv(file_path)
            
            table_type = analysis['suggested_table_type']
            if not table_type:
                return {'status': 'skipped', 'reason': 'unknown_table_type'}
            
            # Clean and prepare data
            df_cleaned = self._clean_dataframe(df, table_type)
            
            # Generate output filename
            output_filename = f"{table_type}.csv"
            output_path = self.output_dir / output_filename
            
            # Save prepared CSV
            df_cleaned.to_csv(output_path, index=False)
            
            preparation_result = {
                'status': 'success',
                'input_file': str(file_path),
                'output_file': str(output_path),
                'table_type': table_type,
                'original_records': len(df),
                'cleaned_records': len(df_cleaned),
                'records_removed': len(df) - len(df_cleaned),
                'columns_renamed': [],
                'columns_added': [],
                'timestamp': datetime.now().isoformat()
            }
            
            self.preparation_results['files_processed'].append(output_filename)
            logger.info(f"Prepared CSV saved to: {output_path}")
            
            return preparation_result
            
        except Exception as e:
            logger.error(f"Error preparing CSV {file_path.name}: {e}")
            self.preparation_results['errors'].append(f"Error preparing {file_path.name}: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def _clean_dataframe(self, df: pd.DataFrame, table_type: str) -> pd.DataFrame:
        """
        Clean DataFrame for Triple RAG compatibility
        
        Args:
            df: Source DataFrame
            table_type: Type of table
            
        Returns:
            Cleaned DataFrame
        """
        df_cleaned = df.copy()
        requirements = self.schema_requirements[table_type]
        
        # Apply field renaming
        for old_name, new_name in requirements['renamed_fields'].items():
            if old_name in df_cleaned.columns:
                df_cleaned = df_cleaned.rename(columns={old_name: new_name})
                logger.info(f"Renamed column '{old_name}' to '{new_name}'")
        
        # Handle specific data cleaning by table type
        if table_type == 'documents':
            df_cleaned = self._clean_documents_table(df_cleaned)
        elif table_type == 'document_chunks':
            df_cleaned = self._clean_chunks_table(df_cleaned)
        elif table_type == 'document_entities':
            df_cleaned = self._clean_entities_table(df_cleaned)
        elif table_type == 'document_processing_tasks':
            df_cleaned = self._clean_tasks_table(df_cleaned)
        
        # Remove rows with missing required fields
        required_fields = requirements['required']
        for field in required_fields:
            if field in df_cleaned.columns:
                df_cleaned = df_cleaned.dropna(subset=[field])
        
        # Clean string fields
        string_columns = df_cleaned.select_dtypes(include=['object']).columns
        for col in string_columns:
            df_cleaned[col] = df_cleaned[col].astype(str).replace('nan', '').replace('None', '')
        
        return df_cleaned
    
    def _clean_documents_table(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean documents table specifically"""
        # Ensure title and summary are not empty
        if 'title' in df.columns:
            df['title'] = df['title'].fillna('Untitled Document')
        
        if 'summary' in df.columns:
            df['summary'] = df['summary'].fillna('')
        
        # Handle metadata as JSON string
        if 'metadata' in df.columns:
            df['metadata'] = df['metadata'].apply(self._ensure_json_string)
        
        return df
    
    def _clean_chunks_table(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean chunks table specifically"""
        # Ensure content is not empty
        if 'content' in df.columns:
            df = df[df['content'].notna() & (df['content'] != '')]
        
        # Normalize chunk_index
        if 'chunk_index' in df.columns:
            df['chunk_index'] = pd.to_numeric(df['chunk_index'], errors='coerce').fillna(0).astype(int)
        
        # Normalize page_number
        if 'page_number' in df.columns:
            df['page_number'] = pd.to_numeric(df['page_number'], errors='coerce').fillna(1).astype(int)
        
        return df
    
    def _clean_entities_table(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean entities table specifically"""
        # Ensure entity_data is JSON string
        if 'entity_data' in df.columns:
            df['entity_data'] = df['entity_data'].apply(self._ensure_json_string)
        
        # Normalize confidence
        if 'confidence' in df.columns:
            df['confidence'] = pd.to_numeric(df['confidence'], errors='coerce').fillna(0.0)
        
        return df
    
    def _clean_tasks_table(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean processing tasks table specifically"""
        # Normalize status values
        if 'status' in df.columns:
            status_mapping = {
                'pending': 'pending',
                'running': 'running',
                'completed': 'completed',
                'failed': 'failed',
                'success': 'completed',
                'error': 'failed'
            }
            df['status'] = df['status'].map(status_mapping).fillna('pending')
        
        return df
    
    def _ensure_json_string(self, value):
        """Ensure value is a valid JSON string"""
        if pd.isna(value) or value == '':
            return '{}'
        
        if isinstance(value, str):
            try:
                # Try to parse as JSON to validate
                json.loads(value)
                return value
            except:
                # If not valid JSON, wrap in quotes
                return json.dumps(str(value))
        
        # Convert other types to JSON
        return json.dumps(value)
    
    def generate_preparation_report(self) -> Dict[str, Any]:
        """
        Generate comprehensive preparation report
        
        Returns:
            Preparation report
        """
        report = {
            'summary': {
                'files_found': len(self.preparation_results['files_found']),
                'files_processed': len(self.preparation_results['files_processed']),
                'errors': len(self.preparation_results['errors']),
                'warnings': len(self.preparation_results['warnings'])
            },
            'details': self.preparation_results.copy(),
            'output_directory': str(self.output_dir),
            'generated_at': datetime.now().isoformat()
        }
        
        return report
    
    def save_report(self, report: Dict[str, Any], filename: str = "csv_preparation_report.json"):
        """
        Save preparation report to file
        
        Args:
            report: Report to save
            filename: Output filename
        """
        try:
            with open(filename, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            logger.info(f"Preparation report saved to {filename}")
        except Exception as e:
            logger.error(f"Error saving report: {e}")

def main():
    """
    Main execution function
    """
    print("📋 CSV Integration Preparation Script")
    print("=" * 50)
    
    # Initialize preparation
    csv_prep = CSVPreparation()
    
    # Discover CSV files
    csv_files = csv_prep.discover_csv_files()
    
    if not csv_files:
        print("❌ No CSV files found in current directory")
        return
    
    print(f"Found {len(csv_files)} CSV files")
    
    # Analyze and prepare each file
    for file_path in csv_files:
        print(f"\n📊 Analyzing: {file_path.name}")
        
        # Analyze structure
        analysis = csv_prep.analyze_csv_structure(file_path)
        
        if 'error' in analysis:
            print(f"❌ Error analyzing {file_path.name}: {analysis['error']}")
            continue
        
        print(f"Records: {analysis['record_count']}")
        print(f"Columns: {analysis['column_count']}")
        print(f"Suggested type: {analysis['suggested_table_type']}")
        
        # Show compatibility
        if analysis['schema_compatibility']['status'] == 'compatible':
            print("✅ Schema compatible")
        elif analysis['schema_compatibility']['status'] == 'incompatible':
            print("⚠️  Schema incompatible")
        else:
            print("❓ Schema unknown")
        
        # Prepare file
        preparation_result = csv_prep.prepare_csv_file(file_path, analysis)
        
        if preparation_result['status'] == 'success':
            print(f"✅ Prepared: {preparation_result['output_file']}")
        else:
            print(f"❌ Preparation failed: {preparation_result.get('reason', 'unknown')}")
    
    # Generate and save report
    report = csv_prep.generate_preparation_report()
    csv_prep.save_report(report)
    
    print(f"\n📄 Preparation report saved to csv_preparation_report.json")
    print(f"📁 Prepared files saved to: {csv_prep.output_dir}")
    print("\n✅ CSV preparation completed!")
    print("\n🚀 Next step: Run csv_integration.py to process prepared files")

if __name__ == "__main__":
    main()
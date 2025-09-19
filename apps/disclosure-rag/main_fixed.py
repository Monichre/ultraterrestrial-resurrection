#!/usr/bin/env python3
"""
Fixed Enhanced Main Processor for Disclosure RAG
Addresses async/sync integration issues and restores rich UI features

Key Fixes:
- Proper async/sync integration for entity extraction
- Maintains rich terminal UI from original
- Uses existing processing pipeline without breaking it
- Configuration management without hardcoded paths

Usage:
  python main_fixed.py "https://youtube.com/watch?v=..." [--upload]
  python main_fixed.py "https://example.com/article" [--upload]
  python main_fixed.py /path/to/document.pdf [--upload]
  python main_fixed.py --status
"""

import argparse
import os
import sys
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List
from urllib.parse import urlparse
from dataclasses import dataclass, field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import core processors (using existing sync implementations)
from lib.knowledge_base_crud import KnowledgeBaseCRUD
from lib.knowledge_base_service import (
    kb_service,
    process_youtube_url_enhanced,
    process_web_url_enhanced,
    add_to_knowledge_base
)
from processing.web_content_processor import WebContentProcessor
from lib.openai_client.upload import upload_file_to_openai
from lib.upstash.queue import add_processed_content_to_queue


@dataclass
class ProcessingConfig:
    """Centralized configuration management"""
    
    # Path Configuration (environment-based, no hardcoded paths)
    knowledge_base_path: str = field(
        default_factory=lambda: os.getenv(
            "KNOWLEDGE_BASE_PATH", 
            str(Path(__file__).parent.parent.parent / "packages/knowledge-base")
        )
    )
    processing_queue_path: str = field(
        default_factory=lambda: os.getenv(
            "PROCESSING_QUEUE_PATH",
            str(Path(__file__).parent / "data/processing_queue")
        )
    )
    
    # Integration Toggles
    enable_mem0: bool = field(
        default_factory=lambda: os.getenv("MEM0_ENABLE", "true").lower() == "true"
    )
    enable_cocoindex: bool = field(
        default_factory=lambda: os.getenv("COCOINDEX_ENABLE", "true").lower() == "true"
    )
    enable_entity_extraction: bool = field(
        default_factory=lambda: os.getenv("ENTITY_EXTRACTION_ENABLE", "true").lower() == "true"
    )
    
    @property
    def files_directory(self) -> str:
        """Get files directory path"""
        return str(Path(self.knowledge_base_path) / "sources/files")
    
    def is_processing_queue_file(self, file_path: str) -> bool:
        """Check if file is from processing queue"""
        return file_path.startswith(self.processing_queue_path)


class EnhancedSystemStatus:
    """Enhanced system status checking with better integration info"""
    
    def __init__(self, config: ProcessingConfig):
        self.config = config
    
    def print_comprehensive_status(self):
        """Print comprehensive system status"""
        print(f"\n🔧 Enhanced System Status (Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")
        print("=" * 70)
        
        # Core System Status
        status = kb_service.get_integration_status()
        print(f"\n📊 Core Systems:")
        print(f"   {'✅' if status['local_kb'] else '❌'} Local Knowledge Base")
        print(f"   {'✅' if status['search_sync'] else '❌'} Upstash Search Sync")
        print(f"   {'✅' if status['search_url'] else '❌'} Search URL Configured")
        print(f"   {'✅' if status['search_token'] else '❌'} Search Token Configured")
        
        # Integration Status
        print(f"\n🔗 AI Integrations:")
        
        # CocoIndex Status
        cocoindex_available = self._check_cocoindex_availability()
        print(f"   {'✅' if cocoindex_available else '❌'} CocoIndex Knowledge Graph")
        
        if cocoindex_available:
            try:
                from lib.cocoindex_integration import cocoindex_processor
                kg_status = cocoindex_processor.get_processing_status()
                if kg_status.get('status') == 'success' and 'statistics' in kg_status:
                    stats = kg_status['statistics']
                    print(f"       📄 Documents: {stats.get('total_documents', 0)}")
                    print(f"       🏷️ Entities: {stats.get('total_entities', 0)}")
                    print(f"       🔗 Relationships: {stats.get('total_relationships', 0)}")
            except Exception as e:
                print(f"       ⚠️ Status check failed: {e}")
        
        # Enhanced CocoIndex
        enhanced_cocoindex = self._check_enhanced_cocoindex()
        print(f"   {'✅' if enhanced_cocoindex else '❌'} Enhanced CocoIndex")
        
        # Mem0 Integration Status
        mem0_status = self._check_mem0_status()
        print(f"   {'✅' if mem0_status['enabled'] else '❌'} Mem0 Memory Integration")
        if mem0_status['available'] and not mem0_status['enabled']:
            print(f"       ⚠️ Available but not configured")
        elif not mem0_status['available']:
            print(f"       ❌ Module not installed")
        
        # Entity Extraction
        entity_available = self._check_entity_extraction()
        print(f"   {'✅' if entity_available else '❌'} Entity Extraction System")
        
        # Configuration Status
        print(f"\n⚙️ Configuration:")
        print(f"   📁 Knowledge Base Path: {self.config.knowledge_base_path}")
        print(f"   🔄 Processing Queue: {self.config.processing_queue_path}")
        print(f"   🧠 Mem0 Enabled: {'✅' if self.config.enable_mem0 else '❌'}")
        print(f"   🕸️ CocoIndex Enabled: {'✅' if self.config.enable_cocoindex else '❌'}")
        print(f"   🔍 Entity Extraction: {'✅' if self.config.enable_entity_extraction else '❌'}")
        
        # Suggestions for missing components
        self._print_setup_suggestions(status, cocoindex_available, mem0_status, enhanced_cocoindex)
    
    def _check_cocoindex_availability(self) -> bool:
        """Check if CocoIndex is available"""
        try:
            from lib.cocoindex_integration import cocoindex_processor
            return True
        except ImportError:
            return False
    
    def _check_enhanced_cocoindex(self) -> bool:
        """Check if Enhanced CocoIndex is available"""
        try:
            from lib.cocoindex import create_live_cocoindex, BackendFactory
            return True
        except ImportError:
            return False
    
    def _check_mem0_status(self) -> Dict[str, bool]:
        """Check Mem0 integration status"""
        try:
            from lib.mem0_integration import _is_enabled, _get_api_key
            return {
                "available": True,
                "enabled": _is_enabled(),
                "api_key_configured": bool(_get_api_key())
            }
        except ImportError:
            return {"available": False, "enabled": False, "api_key_configured": False}
    
    def _check_entity_extraction(self) -> bool:
        """Check if entity extraction system is available"""
        try:
            from lib.entity_extraction.processors.interactive_entity_processor import InteractiveEntityProcessor
            return True
        except ImportError:
            return False
    
    def _print_setup_suggestions(self, core_status: Dict, cocoindex: bool, mem0_status: Dict, enhanced_cocoindex: bool):
        """Print setup suggestions for missing components"""
        suggestions = []
        
        if not core_status['search_sync']:
            suggestions.append("🔍 Enable Upstash Search: export UPSTASH_SEARCH_URL=... && export UPSTASH_SEARCH_TOKEN=...")
        
        if not cocoindex:
            suggestions.append("🕸️ Install CocoIndex: pip install cocoindex")
        
        if not enhanced_cocoindex:
            suggestions.append("⚡ Install Enhanced CocoIndex: pip install enhanced-cocoindex")
        
        if mem0_status['available'] and not mem0_status['enabled']:
            suggestions.append("🧠 Configure Mem0: export MEM0_API_KEY=your_key")
        elif not mem0_status['available']:
            suggestions.append("🧠 Install Mem0: pip install mem0ai")
        
        if suggestions:
            print(f"\n💡 Setup Suggestions:")
            for suggestion in suggestions:
                print(f"   • {suggestion}")
        
        print(f"\n🎯 Current Status: {'🟢 All systems operational' if all([core_status['local_kb'], cocoindex, mem0_status['enabled']]) else '🟡 Some integrations missing'}")


def trigger_cocoindex_processing(doc_id: str, force_update: bool = False) -> Optional[Dict[str, Any]]:
    """Trigger CocoIndex knowledge graph processing (sync version)"""
    try:
        from lib.cocoindex_integration import cocoindex_processor
        logger.info(f"Triggering CocoIndex knowledge graph processing for document: {doc_id}")
        result = cocoindex_processor.process_document_knowledge_graph(doc_id, force_update)
        
        if result.get('status') == 'success':
            entities_count = result.get('entities_processed', 0)
            relationships_count = result.get('relationships_processed', 0)
            logger.info(f"CocoIndex processing completed: {entities_count} entities, {relationships_count} relationships")
        elif result.get('status') == 'skipped':
            logger.info(f"CocoIndex processing skipped: {result.get('reason', 'unknown')}")
        else:
            logger.warning(f"CocoIndex processing failed: {result.get('error', 'unknown error')}")
        
        return result
        
    except ImportError:
        logger.info("CocoIndex KG processing skipped - not available")
        return {"status": "skipped", "reason": "cocoindex_not_available"}
    except Exception as e:
        logger.error(f"Error triggering CocoIndex processing: {e}")
        return {"status": "error", "error": str(e)}


def add_mem0_integrations(result: Dict[str, Any], content_type: str, processing_steps: List[str]):
    """Add Mem0 memory integrations (sync version)"""
    if not result or not result.get('doc_id'):
        return
    
    try:
        from lib.mem0_integration import add_processing_summary_memory
        
        # Add comprehensive processing summary
        final_status = "success" if result.get('doc_id') else "failed"
        add_processing_summary_memory(
            doc_id=result['doc_id'],
            title=result.get('title', 'Unknown'),
            content_type=content_type,
            processing_steps=processing_steps,
            final_status=final_status
        )
        logger.info("Mem0 processing summary added")
        
    except ImportError:
        logger.info("Mem0 integration not available")
    except Exception as e:
        logger.warning(f"Mem0 integration failed: {e}")


def process_url_enhanced_fixed(url: str, upload: bool = False, add_to_kb: bool = True, 
                               config: ProcessingConfig = None) -> Optional[Dict[str, Any]]:
    """Enhanced URL processing with proper sync integration"""
    logger.info(f"Processing URL: {url}")
    processing_steps = []
    
    # Use existing sync processing functions
    if is_youtube_url(url):
        processing_steps.append("YouTube transcript extraction")
        result = process_youtube_url_enhanced(url, upload)
        content_type = "youtube_video"
    else:
        processing_steps.append("Web content extraction")
        result = process_web_url_enhanced(url, upload)
        content_type = "web_article"
    
    if not result:
        return None
    
    # Add mem0 integration for web articles (YouTube already has it)
    if result and not is_youtube_url(url):
        try:
            from lib.mem0_integration import add_web_article_memory
            processing_steps.append("Mem0 web article memory")
            add_web_article_memory(
                title=result.get('title', 'Unknown'),
                url=url,
                content=result.get('content', ''),
                summary=result.get('analysis', ''),
                tags=result.get('tags', [])
            )
        except Exception as e:
            logger.warning(f"Mem0 web article memory skipped: {e}")
    
    # Add CocoIndex knowledge graph processing
    if result and result.get('doc_id') and add_to_kb:
        try:
            from lib.terminal_display import display
            display.print_stage("🕸️ KNOWLEDGE GRAPH", "🕸️")
            display.start_spinner("📊 Building knowledge graph with CocoIndex...")
            processing_steps.append("Knowledge graph construction")
            
            cocoindex_result = trigger_cocoindex_processing(result['doc_id'])
            if cocoindex_result and cocoindex_result.get('status') == 'success':
                entities_count = cocoindex_result.get('entities_processed', 0)
                relationships_count = cocoindex_result.get('relationships_processed', 0)
                display.stop_spinner(f"✅ Knowledge graph built: {entities_count} entities, {relationships_count} relationships")
                result['cocoindex_processing'] = cocoindex_result
                
                # Add knowledge graph memory
                try:
                    from lib.mem0_integration import add_knowledge_graph_memory
                    processing_steps.append("Mem0 knowledge graph memory")
                    add_knowledge_graph_memory(
                        doc_id=result['doc_id'],
                        entities_processed=entities_count,
                        relationships_processed=relationships_count,
                        kg_results=cocoindex_result
                    )
                except Exception as e:
                    logger.warning(f"Mem0 knowledge graph memory skipped: {e}")
            else:
                reason = cocoindex_result.get('reason', 'unknown') if cocoindex_result else 'failed'
                display.stop_spinner(f"⚠️ Knowledge graph {cocoindex_result.get('status', 'skipped')}: {reason}")
                if cocoindex_result:
                    result['cocoindex_processing'] = cocoindex_result
                    
        except Exception as e:
            try:
                from lib.terminal_display import display
                display.stop_spinner("❌ Knowledge graph processing failed")
            except:
                pass
            logger.error(f"CocoIndex processing failed: {e}")
    
    # Add comprehensive processing summary
    add_mem0_integrations(result, content_type, processing_steps)
    
    return result


def process_file_enhanced_fixed(file_path: str, upload: bool = False, add_to_kb: bool = True,
                               config: ProcessingConfig = None) -> Optional[Dict[str, Any]]:
    """Enhanced file processing with proper sync integration and path management"""
    logger.info(f"Processing file: {file_path}")
    processing_steps = ["File content extraction"]
    
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return None
    
    try:
        # Read file content (same as original)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title from filename
        title = Path(file_path).stem.replace('_', ' ').replace('-', ' ').title()
        
        # If markdown, try to get title from first header
        if file_path.endswith('.md') and content.startswith('#'):
            first_line = content.split('\n')[0]
            title = first_line.strip('#').strip()
        
        # Create data structure
        data = {
            'content': content,
            'title': title,
            'source': file_path,
            'file_path': file_path,
            'metadata': {
                'title': title,
                'source': file_path,
                'type': 'file',
                'file_type': Path(file_path).suffix
            }
        }
        
        # Upload if requested
        if upload:
            upload_result = upload_file_to_openai(file_path)
            data['upload_results'] = upload_result
            processing_steps.append("OpenAI vector store upload")
            
            # Add to queue
            add_processed_content_to_queue(data['metadata'], file_path, file_path)
        
        # Add to knowledge base
        if add_to_kb:
            doc_type = 'research' if file_path.endswith('.pdf') else 'case_file'
            doc_id = add_to_knowledge_base(data, doc_type)
            data['doc_id'] = doc_id
            
            # Entity processing (keep sync - this is where the original worked)
            if doc_id and config and config.enable_entity_extraction:
                try:
                    from lib.terminal_display import display
                    from lib.knowledge_base_crud import KnowledgeBaseCRUD
                    
                    kb_crud = KnowledgeBaseCRUD()
                    doc_info = kb_crud.get_document_by_id(doc_id)
                    
                    if doc_info:
                        display.print_stage("🔍 ENTITY EXTRACTION", "🔍")
                        display.start_spinner("📊 Extracting entities with AI...")
                        processing_steps.append("Entity extraction")
                        
                        try:
                            from lib.entity_extraction.processors.interactive_entity_processor import InteractiveEntityProcessor
                            processor = InteractiveEntityProcessor()
                            
                            # Use the file path directly for entity extraction
                            summary_file = file_path
                            
                            # Process entities (sync version - no await)
                            entity_results = processor.process_summary_file_interactive(
                                summary_file, doc_id, interactive=False
                            )
                            
                            if entity_results and entity_results.get('entities'):
                                # Calculate total matches
                                total_matches = sum(
                                    len(entities) for entities in entity_results.get('entities', {}).values()
                                ) if isinstance(entity_results.get('entities'), dict) else 0
                                
                                display.stop_spinner(f"✅ Entities extracted: {total_matches} total matches")
                                data['entity_processing'] = entity_results
                                
                                # Add entity extraction memory
                                try:
                                    from lib.mem0_integration import add_entity_extraction_memory
                                    processing_steps.append("Mem0 entity extraction memory")
                                    add_entity_extraction_memory(
                                        doc_id=doc_id,
                                        entities=entity_results.get('entities', []),
                                        total_matches=total_matches,
                                        processing_results=entity_results
                                    )
                                except Exception as e:
                                    logger.warning(f"Mem0 entity extraction memory skipped: {e}")
                            else:
                                display.stop_spinner("⚠️ No entities extracted")
                                
                        except Exception as e:
                            display.stop_spinner("❌ Entity extraction failed")
                            logger.error(f"Entity processing failed: {e}")
                    else:
                        logger.warning(f"Could not find document info for entity processing: {doc_id}")
                        
                except Exception as e:
                    logger.error(f"Error setting up entity processing: {e}")
            
            # CocoIndex knowledge graph processing
            if doc_id:
                try:
                    from lib.terminal_display import display
                    display.print_stage("🕸️ KNOWLEDGE GRAPH", "🕸️")
                    display.start_spinner("📊 Building knowledge graph with CocoIndex...")
                    processing_steps.append("Knowledge graph construction")
                    
                    cocoindex_result = trigger_cocoindex_processing(doc_id)
                    if cocoindex_result and cocoindex_result.get('status') == 'success':
                        entities_count = cocoindex_result.get('entities_processed', 0)
                        relationships_count = cocoindex_result.get('relationships_processed', 0)
                        display.stop_spinner(f"✅ Knowledge graph built: {entities_count} entities, {relationships_count} relationships")
                        data['cocoindex_processing'] = cocoindex_result
                        
                        # Add knowledge graph memory
                        try:
                            from lib.mem0_integration import add_knowledge_graph_memory
                            processing_steps.append("Mem0 knowledge graph memory")
                            add_knowledge_graph_memory(
                                doc_id=doc_id,
                                entities_processed=entities_count,
                                relationships_processed=relationships_count,
                                kg_results=cocoindex_result
                            )
                        except Exception as e:
                            logger.warning(f"Mem0 knowledge graph memory skipped: {e}")
                    else:
                        reason = cocoindex_result.get('reason', 'unknown') if cocoindex_result else 'failed'
                        display.stop_spinner(f"⚠️ Knowledge graph {cocoindex_result.get('status', 'skipped')}: {reason}")
                        if cocoindex_result:
                            data['cocoindex_processing'] = cocoindex_result
                            
                except Exception as e:
                    display.stop_spinner("❌ Knowledge graph processing failed")
                    logger.error(f"CocoIndex processing failed: {e}")
            
            # File relocation (using config for paths)
            if doc_id and config and config.is_processing_queue_file(file_path):
                try:
                    import shutil
                    
                    # Use config for files directory
                    files_dir = config.files_directory
                    os.makedirs(files_dir, exist_ok=True)
                    
                    # Create destination path
                    filename = os.path.basename(file_path)
                    destination_path = os.path.join(files_dir, filename)
                    
                    # Move file
                    shutil.move(file_path, destination_path)
                    logger.info(f"Moved processed file from processing_queue to files: {filename}")
                    
                    # Update data source
                    data['source'] = destination_path
                    data['metadata']['source'] = destination_path
                    processing_steps.append("File relocation")
                    
                except Exception as e:
                    logger.error(f"Failed to move file to files: {e}")
            
            # Add comprehensive processing summary
            add_mem0_integrations(data, "file", processing_steps)
        
        return data
        
    except Exception as e:
        logger.error(f"Error processing file: {e}")
        return None


def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube video"""
    return any(domain in url.lower() for domain in ['youtube.com', 'youtu.be'])


def main():
    """Fixed main function with proper sync processing and rich UI"""
    
    # Initialize configuration
    config = ProcessingConfig()
    
    # Parse arguments
    parser = argparse.ArgumentParser(
        description="Enhanced Disclosure RAG Content Processor (Fixed)"
    )
    parser.add_argument("input", nargs="?", help="URL or file path to process")
    parser.add_argument("--upload", action="store_true", help="Upload to OpenAI vector store")
    parser.add_argument("--no-kb", action="store_true", help="Skip adding to knowledge base")
    parser.add_argument("--status", action="store_true", help="Show comprehensive system status")
    
    args = parser.parse_args()
    
    # Show header (using existing display system)
    try:
        from lib.terminal_display import display
        display.print_header()
    except ImportError:
        print("\n🛸 Disclosure RAG - Enhanced Content Processor (Fixed)")
        print("=" * 60)
    
    # Handle status request
    if args.status:
        status_checker = EnhancedSystemStatus(config)
        status_checker.print_comprehensive_status()
        return
    
    # Validate input
    if not args.input:
        print(f"\n❌ Error: Input URL or file path is required when not using --status")
        parser.print_help()
        sys.exit(1)
    
    # Process input
    input_path = args.input.strip()
    add_to_kb = not args.no_kb
    
    try:
        # Show input detection (using existing display if available)
        try:
            from lib.terminal_display import display
            if input_path.startswith(('http://', 'https://')):
                url_type = "youtube" if is_youtube_url(input_path) else "web"
                display.print_url_detected(input_path, url_type)
            else:
                display.print_url_detected(input_path, "file")
        except ImportError:
            print(f"🔍 Processing: {input_path}")
        
        # Process based on input type
        if input_path.startswith(('http://', 'https://')):
            result = process_url_enhanced_fixed(input_path, args.upload, add_to_kb, config)
        else:
            result = process_file_enhanced_fixed(input_path, args.upload, add_to_kb, config)
        
        # Display results (enhanced version)
        if result:
            print(f"\n✅ Processing complete!")
            print(f"   📄 Title: {result.get('title', 'Unknown')}")
            print(f"   📍 Source: {result.get('source', 'Unknown')}")
            
            if 'doc_id' in result:
                print(f"   🆔 Document ID: {result['doc_id']}")
            
            if args.upload and 'upload_results' in result:
                print(f"   📤 OpenAI Upload: ✅")
            
            if 'queue_result' in result:
                print(f"   📋 QStash Queue: ✅")
            
            # Show entity extraction results
            if 'entity_processing' in result:
                entity_result = result['entity_processing']
                if entity_result and entity_result.get('entities'):
                    total_entities = sum(len(entities) for entities in entity_result.get('entities', {}).values())
                    print(f"   🔍 Entity Extraction: ✅ ({total_entities} entities extracted)")
                else:
                    print(f"   🔍 Entity Extraction: ⚠️ No entities found")
            
            # Show CocoIndex knowledge graph results
            if 'cocoindex_processing' in result:
                kg_result = result['cocoindex_processing']
                if kg_result and kg_result.get('status') == 'success':
                    entities = kg_result.get('entities_processed', 0)
                    relationships = kg_result.get('relationships_processed', 0)
                    print(f"   🕸️ Knowledge Graph: ✅ ({entities} entities, {relationships} relationships)")
                else:
                    status = kg_result.get('status', 'unknown') if kg_result else 'unavailable'
                    reason = kg_result.get('reason', '') if kg_result else ''
                    print(f"   🕸️ Knowledge Graph: ⚠️ {status.title()} {reason}")
            
            # Show memory integration
            try:
                from lib.mem0_integration import _is_enabled
                if _is_enabled():
                    print(f"   🧠 Memory: ✅ Contextual memories added")
                else:
                    print(f"   🧠 Memory: ⚠️ Disabled or not configured")
            except ImportError:
                print(f"   🧠 Memory: ❌ Not available")
                
        else:
            print(f"\n❌ Processing failed!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print(f"\n⚠️ Processing interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

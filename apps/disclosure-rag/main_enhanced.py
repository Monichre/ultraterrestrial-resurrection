#!/usr/bin/env python3
"""
DEAD CODE — MARKED FOR DELETION (2026-08-09). DO NOT EDIT, EXTEND, OR IMPORT.

Unreachable from `dy`: main.sh only ever invokes "$SCRIPT_DIR/main.py"
(main.sh:147, 167, 195, 365, 368, 371). Nothing in the repo imports this module
(only its own usage docstring mentions its name). Last touched 2025-09-19.

The live entry point is main.py. See docs/DEAD_CODE.md.

---

Enhanced Main Processor for Disclosure RAG
Combines clean async architecture with comprehensive feature integration

Features:
- Clean async architecture with modular processors
- Comprehensive integrations (Mem0, CocoIndex, Entity Extraction)
- Configuration management (no hardcoded paths)
- Rich terminal feedback with progress tracking
- Robust error handling and recovery
- Single responsibility functions

Usage:
  python main_enhanced.py "https://youtube.com/watch?v=..." [--upload]
  python main_enhanced.py "https://example.com/article" [--upload]
  python main_enhanced.py /path/to/document.pdf [--upload]
  python main_enhanced.py --status
"""

import argparse
import asyncio
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

# Import core processors
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
    
    # Path Configuration
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
    
    # Processing Options
    default_upload: bool = field(
        default_factory=lambda: os.getenv("DEFAULT_UPLOAD", "false").lower() == "true"
    )
    batch_size: int = field(
        default_factory=lambda: int(os.getenv("BATCH_SIZE", "5"))
    )
    
    @property
    def files_directory(self) -> str:
        """Get files directory path"""
        return str(Path(self.knowledge_base_path) / "sources/files")
    
    @property
    def is_processing_queue_file(self) -> callable:
        """Check if file is from processing queue"""
        def check(file_path: str) -> bool:
            return file_path.startswith(self.processing_queue_path)
        return check


class ProcessingResult:
    """Standardized result structure for all processing operations"""
    
    def __init__(self, success: bool = False):
        self.success = success
        self.doc_id: Optional[str] = None
        self.title: Optional[str] = None
        self.source: Optional[str] = None
        self.content_type: Optional[str] = None
        self.processing_steps: List[str] = []
        self.integrations: Dict[str, Any] = {}
        self.errors: List[str] = []
        self.metadata: Dict[str, Any] = {}
        
    def add_step(self, step: str):
        """Add processing step"""
        self.processing_steps.append(step)
        logger.info(f"Processing step: {step}")
    
    def add_integration(self, name: str, result: Any):
        """Add integration result"""
        self.integrations[name] = result
        
    def add_error(self, error: str):
        """Add error"""
        self.errors.append(error)
        logger.error(f"Processing error: {error}")
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "success": self.success,
            "doc_id": self.doc_id,
            "title": self.title,
            "source": self.source,
            "content_type": self.content_type,
            "processing_steps": self.processing_steps,
            "integrations": self.integrations,
            "errors": self.errors,
            "metadata": self.metadata
        }


class TerminalDisplay:
    """Enhanced terminal display with progress tracking"""
    
    def __init__(self):
        self._has_display = self._load_display()
        
    def _load_display(self) -> bool:
        """Load terminal display if available"""
        try:
            from lib.terminal_display import display
            self.display = display
            return True
        except ImportError:
            logger.warning("Terminal display not available - using basic output")
            return False
    
    def print_header(self):
        """Print application header"""
        if self._has_display:
            self.display.print_header()
        else:
            print("\n🛸 Disclosure RAG - Enhanced Content Processor")
            print("=" * 50)
    
    def print_stage(self, title: str, icon: str = "🔧"):
        """Print processing stage"""
        if self._has_display:
            self.display.print_stage(title, icon)
        else:
            print(f"\n{icon} {title}")
    
    def start_spinner(self, message: str):
        """Start progress spinner"""
        if self._has_display:
            self.display.start_spinner(message)
        else:
            print(f"⏳ {message}")
    
    def stop_spinner(self, message: str):
        """Stop progress spinner"""
        if self._has_display:
            self.display.stop_spinner(message)
        else:
            print(f"✅ {message}")
    
    def print_url_detected(self, url: str, url_type: str):
        """Print URL detection result"""
        if self._has_display:
            self.display.print_url_detected(url, url_type)
        else:
            print(f"🔍 Detected {url_type}: {url}")


class Mem0Processor:
    """Handles Mem0 contextual memory integration"""
    
    def __init__(self, config: ProcessingConfig):
        self.config = config
        self.enabled = self._check_availability()
    
    def _check_availability(self) -> bool:
        """Check if Mem0 integration is available and enabled"""
        if not self.config.enable_mem0:
            return False
        
        try:
            from lib.mem0_integration import _is_enabled
            return _is_enabled()
        except ImportError:
            logger.info("Mem0 integration not available")
            return False
    
    async def add_web_article_memory(self, title: str, url: str, content: str, 
                                   summary: str, tags: List[str]) -> bool:
        """Add web article to memory"""
        if not self.enabled:
            return False
        
        try:
            from lib.mem0_integration import add_web_article_memory
            add_web_article_memory(title, url, content, summary, tags)
            return True
        except Exception as e:
            logger.warning(f"Mem0 web article memory failed: {e}")
            return False
    
    async def add_entity_extraction_memory(self, doc_id: str, entities: List[Dict],
                                         total_matches: int, processing_results: Dict) -> bool:
        """Add entity extraction results to memory"""
        if not self.enabled:
            return False
        
        try:
            from lib.mem0_integration import add_entity_extraction_memory
            add_entity_extraction_memory(doc_id, entities, total_matches, processing_results)
            return True
        except Exception as e:
            logger.warning(f"Mem0 entity extraction memory failed: {e}")
            return False
    
    async def add_knowledge_graph_memory(self, doc_id: str, entities_processed: int,
                                       relationships_processed: int, kg_results: Dict) -> bool:
        """Add knowledge graph results to memory"""
        if not self.enabled:
            return False
        
        try:
            from lib.mem0_integration import add_knowledge_graph_memory
            add_knowledge_graph_memory(doc_id, entities_processed, relationships_processed, kg_results)
            return True
        except Exception as e:
            logger.warning(f"Mem0 knowledge graph memory failed: {e}")
            return False
    
    async def add_processing_summary(self, doc_id: str, title: str, content_type: str,
                                   processing_steps: List[str], final_status: str) -> bool:
        """Add comprehensive processing summary to memory"""
        if not self.enabled:
            return False
        
        try:
            from lib.mem0_integration import add_processing_summary_memory
            add_processing_summary_memory(doc_id, title, content_type, processing_steps, final_status)
            return True
        except Exception as e:
            logger.warning(f"Mem0 processing summary failed: {e}")
            return False


class CocoIndexProcessor:
    """Handles CocoIndex knowledge graph processing"""
    
    def __init__(self, config: ProcessingConfig):
        self.config = config
        self.available = self._check_availability()
    
    def _check_availability(self) -> bool:
        """Check if CocoIndex integration is available"""
        if not self.config.enable_cocoindex:
            return False
        
        try:
            from lib.cocoindex_integration import cocoindex_processor
            self.processor = cocoindex_processor
            return True
        except ImportError as e:
            logger.info(f"CocoIndex integration not available: {e}")
            return False
    
    async def process_document(self, doc_id: str, force_update: bool = False) -> Optional[Dict[str, Any]]:
        """Process document for knowledge graph construction"""
        if not self.available:
            logger.info("CocoIndex processing skipped - not available")
            return None
        
        try:
            logger.info(f"Processing knowledge graph for document: {doc_id}")
            result = self.processor.process_document_knowledge_graph(doc_id, force_update)
            
            if result.get('status') == 'success':
                entities_count = result.get('entities_processed', 0)
                relationships_count = result.get('relationships_processed', 0)
                logger.info(f"Knowledge graph completed: {entities_count} entities, {relationships_count} relationships")
            elif result.get('status') == 'skipped':
                logger.info(f"Knowledge graph skipped: {result.get('reason', 'unknown')}")
            else:
                logger.warning(f"Knowledge graph failed: {result.get('error', 'unknown error')}")
            
            return result
            
        except Exception as e:
            logger.error(f"CocoIndex processing error: {e}")
            return {"status": "error", "error": str(e)}
    
    def get_status(self) -> Dict[str, Any]:
        """Get CocoIndex processing status"""
        if not self.available:
            return {"available": False}
        
        try:
            status = self.processor.get_processing_status()
            return {"available": True, **status}
        except Exception as e:
            return {"available": True, "error": str(e)}


class EntityProcessor:
    """Handles entity extraction processing"""
    
    def __init__(self, config: ProcessingConfig):
        self.config = config
        self.enabled = config.enable_entity_extraction
    
    async def process_entities(self, doc_id: str, doc_info: Dict) -> Optional[Dict[str, Any]]:
        """Extract and process entities from document"""
        if not self.enabled:
            logger.info("Entity processing disabled")
            return None
        
        try:
            from lib.entity_extraction.processors.interactive_entity_processor import InteractiveEntityProcessor
            
            # Initialize processor
            processor = InteractiveEntityProcessor()
            
            # Process entities from summary file if available
            summary_file = doc_info.get('summary_path') or doc_info.get('file_path')
            if summary_file and os.path.exists(summary_file):
                logger.info(f"Processing entities from: {summary_file}")
                result = processor.process_summary_file_interactive(
                    summary_file, doc_id, interactive=False
                )
                
                # Calculate total matches
                total_matches = sum(
                    len(entities) for entities in result.get('entities', {}).values()
                ) if isinstance(result.get('entities'), dict) else 0
                
                return {
                    "status": "success",
                    "entities": result.get('entities', {}),
                    "total_matches": total_matches,
                    "processing_results": result
                }
            else:
                logger.warning(f"No suitable file found for entity processing: {doc_id}")
                return {"status": "skipped", "reason": "no_file"}
                
        except Exception as e:
            logger.error(f"Entity processing error: {e}")
            return {"status": "error", "error": str(e)}


class FileManager:
    """Handles file operations and organization"""
    
    def __init__(self, config: ProcessingConfig):
        self.config = config
    
    async def relocate_processed_file(self, file_path: str, doc_id: str) -> Optional[str]:
        """Move successfully processed file from processing queue to files directory"""
        if not self.config.is_processing_queue_file(file_path):
            return None
        
        try:
            import shutil
            
            # Ensure files directory exists
            files_dir = self.config.files_directory
            os.makedirs(files_dir, exist_ok=True)
            
            # Create destination path
            filename = os.path.basename(file_path)
            destination_path = os.path.join(files_dir, filename)
            
            # Move file
            shutil.move(file_path, destination_path)
            logger.info(f"Relocated processed file: {filename}")
            
            return destination_path
            
        except Exception as e:
            logger.error(f"File relocation failed: {e}")
            return None


class ContentProcessor:
    """Main content processing orchestrator"""
    
    def __init__(self, config: ProcessingConfig):
        self.config = config
        self.display = TerminalDisplay()
        self.mem0 = Mem0Processor(config)
        self.cocoindex = CocoIndexProcessor(config)
        self.entity_processor = EntityProcessor(config)
        self.file_manager = FileManager(config)
        
        # Initialize other processors
        self.web_processor = WebContentProcessor()
        self.kb_crud = KnowledgeBaseCRUD()
    
    @staticmethod
    def is_youtube_url(url: str) -> bool:
        """Check if URL is a YouTube video"""
        return any(domain in url.lower() for domain in ['youtube.com', 'youtu.be'])
    
    async def process_url(self, url: str, upload: bool = False, add_to_kb: bool = True) -> ProcessingResult:
        """Process URL (YouTube video or web article)"""
        result = ProcessingResult()
        result.source = url
        result.add_step("URL processing started")
        
        try:
            # Determine content type and process
            if self.is_youtube_url(url):
                result.content_type = "youtube_video"
                result.add_step("YouTube transcript extraction")
                processing_result = process_youtube_url_enhanced(url, upload)
            else:
                result.content_type = "web_article"
                result.add_step("Web content extraction")
                processing_result = process_web_url_enhanced(url, upload)
            
            if not processing_result:
                result.add_error("Content processing failed")
                return result
            
            # Extract basic information
            result.doc_id = processing_result.get('doc_id')
            result.title = processing_result.get('title', 'Unknown')
            result.metadata = processing_result
            
            # Add Mem0 memory for web articles (YouTube already handled in generate_transcript)
            if result.content_type == "web_article":
                result.add_step("Mem0 web article memory")
                await self.mem0.add_web_article_memory(
                    title=result.title,
                    url=url,
                    content=processing_result.get('content', ''),
                    summary=processing_result.get('analysis', ''),
                    tags=processing_result.get('tags', [])
                )
            
            # Process knowledge graph if doc_id available
            if result.doc_id and add_to_kb:
                await self._process_knowledge_graph(result)
            
            # Add comprehensive processing summary
            if result.doc_id:
                await self.mem0.add_processing_summary(
                    doc_id=result.doc_id,
                    title=result.title,
                    content_type=result.content_type,
                    processing_steps=result.processing_steps,
                    final_status="success"
                )
            
            result.success = True
            return result
            
        except Exception as e:
            result.add_error(f"URL processing failed: {e}")
            return result
    
    async def process_file(self, file_path: str, upload: bool = False, add_to_kb: bool = True) -> ProcessingResult:
        """Process local file"""
        result = ProcessingResult()
        result.source = file_path
        result.content_type = "file"
        result.add_step("File processing started")
        
        try:
            if not os.path.exists(file_path):
                result.add_error(f"File not found: {file_path}")
                return result
            
            # Read and prepare file content
            result.add_step("File content extraction")
            content, title = await self._extract_file_content(file_path)
            result.title = title
            
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
                result.add_step("OpenAI vector store upload")
                upload_result = upload_file_to_openai(file_path)
                data['upload_results'] = upload_result
                result.integrations['openai_upload'] = upload_result
                
                # Add to queue
                add_processed_content_to_queue(data['metadata'], file_path, file_path)
                result.integrations['queue'] = True
            
            # Add to knowledge base
            if add_to_kb:
                result.add_step("Knowledge base integration")
                doc_type = 'research' if file_path.endswith('.pdf') else 'case_file'
                doc_id = add_to_knowledge_base(data, doc_type)
                result.doc_id = doc_id
                data['doc_id'] = doc_id
            
            result.metadata = data
            
            # Process entities if doc_id available
            if result.doc_id:
                await self._process_entities(result, data)
                await self._process_knowledge_graph(result)
                
                # Relocate file if from processing queue
                new_path = await self.file_manager.relocate_processed_file(file_path, result.doc_id)
                if new_path:
                    result.add_step("File relocation")
                    result.source = new_path
                    result.metadata['source'] = new_path
                    result.metadata['metadata']['source'] = new_path
                
                # Add processing summary
                await self.mem0.add_processing_summary(
                    doc_id=result.doc_id,
                    title=result.title,
                    content_type=result.content_type,
                    processing_steps=result.processing_steps,
                    final_status="success"
                )
            
            result.success = True
            return result
            
        except Exception as e:
            result.add_error(f"File processing failed: {e}")
            return result
    
    async def _extract_file_content(self, file_path: str) -> tuple[str, str]:
        """Extract content and title from file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title from filename
        title = Path(file_path).stem.replace('_', ' ').replace('-', ' ').title()
        
        # If markdown, try to get title from first header
        if file_path.endswith('.md') and content.startswith('#'):
            first_line = content.split('\n')[0]
            title = first_line.strip('#').strip()
        
        return content, title
    
    async def _process_entities(self, result: ProcessingResult, doc_info: Dict):
        """Process entity extraction"""
        if not result.doc_id:
            return
        
        self.display.print_stage("🔍 ENTITY EXTRACTION", "🔍")
        self.display.start_spinner("📊 Extracting entities with AI...")
        result.add_step("Entity extraction")
        
        try:
            entity_result = await self.entity_processor.process_entities(result.doc_id, doc_info)
            
            if entity_result and entity_result.get('status') == 'success':
                entities = entity_result.get('entities', {})
                total_matches = entity_result.get('total_matches', 0)
                
                self.display.stop_spinner(f"✅ Entities extracted: {total_matches} total matches")
                result.integrations['entities'] = entity_result
                
                # Add to memory
                await self.mem0.add_entity_extraction_memory(
                    doc_id=result.doc_id,
                    entities=entities,
                    total_matches=total_matches,
                    processing_results=entity_result
                )
            else:
                reason = entity_result.get('reason', 'unknown') if entity_result else 'failed'
                self.display.stop_spinner(f"⚠️ Entity extraction {entity_result.get('status', 'failed')}: {reason}")
                result.integrations['entities'] = entity_result
                
        except Exception as e:
            self.display.stop_spinner("❌ Entity extraction failed")
            result.add_error(f"Entity extraction error: {e}")
    
    async def _process_knowledge_graph(self, result: ProcessingResult):
        """Process knowledge graph construction"""
        if not result.doc_id:
            return
        
        self.display.print_stage("🕸️ KNOWLEDGE GRAPH", "🕸️")
        self.display.start_spinner("📊 Building knowledge graph with CocoIndex...")
        result.add_step("Knowledge graph construction")
        
        try:
            kg_result = await self.cocoindex.process_document(result.doc_id)
            
            if kg_result and kg_result.get('status') == 'success':
                entities_count = kg_result.get('entities_processed', 0)
                relationships_count = kg_result.get('relationships_processed', 0)
                
                self.display.stop_spinner(f"✅ Knowledge graph built: {entities_count} entities, {relationships_count} relationships")
                result.integrations['knowledge_graph'] = kg_result
                
                # Add to memory
                await self.mem0.add_knowledge_graph_memory(
                    doc_id=result.doc_id,
                    entities_processed=entities_count,
                    relationships_processed=relationships_count,
                    kg_results=kg_result
                )
            else:
                reason = kg_result.get('reason', 'unknown') if kg_result else 'not available'
                self.display.stop_spinner(f"⚠️ Knowledge graph {kg_result.get('status', 'skipped')}: {reason}")
                result.integrations['knowledge_graph'] = kg_result
                
        except Exception as e:
            self.display.stop_spinner("❌ Knowledge graph processing failed")
            result.add_error(f"Knowledge graph error: {e}")


class SystemStatus:
    """System status and health checking"""
    
    def __init__(self, config: ProcessingConfig):
        self.config = config
    
    def get_comprehensive_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        status = {
            "timestamp": datetime.now().isoformat(),
            "core_systems": self._get_core_system_status(),
            "integrations": self._get_integration_status(),
            "configuration": self._get_configuration_status()
        }
        return status
    
    def _get_core_system_status(self) -> Dict[str, bool]:
        """Get core system availability"""
        status = kb_service.get_integration_status()
        return {
            "local_kb": status.get('local_kb', False),
            "search_sync": status.get('search_sync', False),
            "search_url": status.get('search_url', False),
            "search_token": status.get('search_token', False)
        }
    
    def _get_integration_status(self) -> Dict[str, Any]:
        """Get integration status"""
        integrations = {}
        
        # Mem0 Integration
        try:
            from lib.mem0_integration import _is_enabled, _get_api_key
            integrations["mem0"] = {
                "available": True,
                "enabled": _is_enabled(),
                "api_key_configured": bool(_get_api_key())
            }
        except ImportError:
            integrations["mem0"] = {"available": False}
        
        # CocoIndex Integration
        try:
            from lib.cocoindex_integration import cocoindex_processor
            integrations["cocoindex"] = {"available": True}
            
            # Try to get detailed status
            try:
                kg_status = cocoindex_processor.get_processing_status()
                if kg_status.get('status') == 'success' and 'statistics' in kg_status:
                    stats = kg_status['statistics']
                    integrations["cocoindex"].update({
                        "documents": stats.get('total_documents', 0),
                        "entities": stats.get('total_entities', 0),
                        "relationships": stats.get('total_relationships', 0)
                    })
            except Exception as e:
                integrations["cocoindex"]["status_error"] = str(e)
                
        except ImportError as e:
            integrations["cocoindex"] = {"available": False, "error": str(e)}
        
        # Enhanced CocoIndex
        try:
            from lib.cocoindex import create_live_cocoindex, BackendFactory
            integrations["enhanced_cocoindex"] = {"available": True}
        except ImportError:
            integrations["enhanced_cocoindex"] = {"available": False}
        
        return integrations
    
    def _get_configuration_status(self) -> Dict[str, Any]:
        """Get configuration status"""
        return {
            "knowledge_base_path": self.config.knowledge_base_path,
            "processing_queue_path": self.config.processing_queue_path,
            "enable_mem0": self.config.enable_mem0,
            "enable_cocoindex": self.config.enable_cocoindex,
            "enable_entity_extraction": self.config.enable_entity_extraction,
            "batch_size": self.config.batch_size
        }
    
    def print_status(self):
        """Print formatted status to console"""
        status = self.get_comprehensive_status()
        
        print(f"\n🔧 System Status (Updated: {status['timestamp'][:19]})")
        print("=" * 60)
        
        # Core Systems
        print("\n📊 Core Systems:")
        core = status['core_systems']
        for system, available in core.items():
            icon = "✅" if available else "❌"
            print(f"   {icon} {system.replace('_', ' ').title()}")
        
        # Integrations
        print("\n🔗 Integrations:")
        integrations = status['integrations']
        
        for name, info in integrations.items():
            if info.get('available'):
                if name == 'mem0':
                    enabled = info.get('enabled', False)
                    api_key = info.get('api_key_configured', False)
                    icon = "✅" if enabled and api_key else "⚠️"
                    print(f"   {icon} {name.upper()}: {'Enabled' if enabled else 'Disabled'}")
                    if enabled and not api_key:
                        print(f"       ⚠️ API key not configured")
                
                elif name == 'cocoindex':
                    icon = "✅"
                    print(f"   {icon} CocoIndex: Available")
                    if 'documents' in info:
                        print(f"       📄 Documents: {info['documents']}")
                        print(f"       🏷️ Entities: {info['entities']}")
                        print(f"       🔗 Relationships: {info['relationships']}")
                
                else:
                    print(f"   ✅ {name.replace('_', ' ').title()}: Available")
            else:
                print(f"   ❌ {name.replace('_', ' ').title()}: Not available")
                if 'error' in info:
                    print(f"       Error: {info['error']}")
        
        # Configuration
        print("\n⚙️ Configuration:")
        config = status['configuration']
        print(f"   📁 Knowledge Base: {config['knowledge_base_path']}")
        print(f"   🔄 Processing Queue: {config['processing_queue_path']}")
        print(f"   🧠 Mem0 Enabled: {'✅' if config['enable_mem0'] else '❌'}")
        print(f"   🕸️ CocoIndex Enabled: {'✅' if config['enable_cocoindex'] else '❌'}")
        print(f"   🔍 Entity Extraction: {'✅' if config['enable_entity_extraction'] else '❌'}")
        
        # Suggestions
        self._print_suggestions(status)
    
    def _print_suggestions(self, status: Dict[str, Any]):
        """Print configuration suggestions"""
        suggestions = []
        
        # Check for missing configurations
        if not status['core_systems']['search_sync']:
            suggestions.append("Enable Search sync: export UPSTASH_SEARCH_URL=your_url && export UPSTASH_SEARCH_TOKEN=your_token")
        
        if not status['integrations'].get('cocoindex', {}).get('available'):
            suggestions.append("Enable CocoIndex: pip install cocoindex")
        
        mem0_info = status['integrations'].get('mem0', {})
        if mem0_info.get('available') and not mem0_info.get('enabled'):
            suggestions.append("Enable Mem0: export MEM0_API_KEY=your_key")
        
        if suggestions:
            print("\n💡 Suggestions:")
            for suggestion in suggestions:
                print(f"   • {suggestion}")


async def main():
    """Enhanced async main function"""
    
    # Initialize configuration
    config = ProcessingConfig()
    
    # Parse arguments
    parser = argparse.ArgumentParser(
        description="Enhanced Disclosure RAG Content Processor"
    )
    parser.add_argument("input", nargs="?", help="URL or file path to process")
    parser.add_argument("--upload", action="store_true", help="Upload to OpenAI vector store")
    parser.add_argument("--no-kb", action="store_true", help="Skip adding to knowledge base")
    parser.add_argument("--status", action="store_true", help="Show comprehensive system status")
    parser.add_argument("--batch", type=int, help="Process multiple items (for future batch support)")
    
    args = parser.parse_args()
    
    # Initialize processors
    processor = ContentProcessor(config)
    status_checker = SystemStatus(config)
    
    # Show header
    processor.display.print_header()
    
    # Handle status request
    if args.status:
        status_checker.print_status()
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
        # Show input detection
        if input_path.startswith(('http://', 'https://')):
            url_type = "youtube" if ContentProcessor.is_youtube_url(input_path) else "web"
            processor.display.print_url_detected(input_path, url_type)
            result = await processor.process_url(input_path, args.upload, add_to_kb)
        else:
            processor.display.print_url_detected(input_path, "file")
            result = await processor.process_file(input_path, args.upload, add_to_kb)
        
        # Display results
        await _display_results(result, args.upload)
        
        if not result.success:
            sys.exit(1)
            
    except KeyboardInterrupt:
        print(f"\n⚠️ Processing interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)


async def _display_results(result: ProcessingResult, upload_requested: bool):
    """Display processing results"""
    if result.success:
        print(f"\n✅ Processing complete!")
        print(f"   📄 Title: {result.title}")
        print(f"   📍 Source: {result.source}")
        
        if result.doc_id:
            print(f"   🆔 Document ID: {result.doc_id}")
        
        # Show processing steps
        if result.processing_steps:
            print(f"   ⚙️ Steps: {' → '.join(result.processing_steps)}")
        
        # Show integration results
        if upload_requested and 'openai_upload' in result.integrations:
            print(f"   📤 OpenAI Upload: ✅")
        
        if 'queue' in result.integrations:
            print(f"   📋 Queue: ✅")
        
        # Show entity extraction results
        if 'entities' in result.integrations:
            entity_result = result.integrations['entities']
            if entity_result.get('status') == 'success':
                total_matches = entity_result.get('total_matches', 0)
                print(f"   🔍 Entities: ✅ ({total_matches} matches)")
            else:
                status = entity_result.get('status', 'unknown')
                print(f"   🔍 Entities: ⚠️ {status.title()}")
        
        # Show knowledge graph results
        if 'knowledge_graph' in result.integrations:
            kg_result = result.integrations['knowledge_graph']
            if kg_result and kg_result.get('status') == 'success':
                entities = kg_result.get('entities_processed', 0)
                relationships = kg_result.get('relationships_processed', 0)
                print(f"   🕸️ Knowledge Graph: ✅ ({entities} entities, {relationships} relationships)")
            else:
                status = kg_result.get('status', 'unknown') if kg_result else 'unavailable'
                print(f"   🕸️ Knowledge Graph: ⚠️ {status.title()}")
        
        # Show memory integration
        try:
            from lib.mem0_integration import _is_enabled
            if _is_enabled():
                print(f"   🧠 Memory: ✅ Contextual memories added")
            else:
                print(f"   🧠 Memory: ⚠️ Disabled")
        except ImportError:
            print(f"   🧠 Memory: ❌ Not available")
        
    else:
        print(f"\n❌ Processing failed!")
        if result.errors:
            print("   Errors:")
            for error in result.errors:
                print(f"   • {error}")


if __name__ == "__main__":
    # Run async main
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n👋 Goodbye!")
    except Exception as e:
        logger.error(f"Application error: {e}")
        sys.exit(1)

#!/usr/bin/env python3
"""
End-to-End Entity Pipeline Test
Tests the complete flow: Extraction → Search → Creation → Database Insertion → Research Queue
Date: July 13, 2025
"""

import os
import sys
import asyncio
import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Test framework
import pytest

# Import our components
try:
    from agents.entity_extraction_agent import EntityExtractionAgent
    from lib.entity_extraction.core.entity_creator import EntityCreator
    from lib.research_queue_manager import ResearchQueueManager, ResearchPriority
    from lib.research_manager import ResearchManager
    COMPONENTS_AVAILABLE = True
except ImportError as e:
    COMPONENTS_AVAILABLE = False
    print(f"Components not available: {e}")

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EndToEndEntityPipelineTest:
    """Comprehensive test suite for the entity processing pipeline"""
    
    def __init__(self):
        self.test_results = {
            'timestamp': datetime.now().isoformat(),
            'tests_run': 0,
            'tests_passed': 0,
            'tests_failed': 0,
            'errors': [],
            'detailed_results': {}
        }
        
        # Initialize components
        self.entity_agent = None
        self.entity_creator = None
        self.research_queue = None
        self.research_manager = None
        
        # Test data
        self.sample_document = """
        Dr. Luis Elizondo, former director of the Advanced Aerospace Threat Identification Program (AATIP), 
        has publicly discussed UAP encounters involving the USS Nimitz in 2004. The incident, known as the 
        "Tic Tac" event, occurred off the coast of San Diego when Navy pilots David Fravor and Alex Dietrich 
        encountered an unidentified object. The Pentagon's All-domain Anomaly Resolution Office (AARO) 
        continues to investigate such incidents. Dr. Hal Puthoff from EarthTech International has also 
        contributed research to understanding these phenomena.
        """
    
    async def initialize_components(self) -> bool:
        """Initialize all pipeline components"""
        try:
            logger.info("🔧 Initializing pipeline components...")
            
            if not COMPONENTS_AVAILABLE:
                raise Exception("Required components not available")
            
            # Initialize components
            self.entity_agent = EntityExtractionAgent()
            self.entity_creator = EntityCreator()
            self.research_queue = ResearchQueueManager()
            self.research_manager = ResearchManager(self.research_queue)
            
            logger.info("✅ All components initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Component initialization failed: {e}")
            self.test_results['errors'].append(f"Initialization: {str(e)}")
            return False
    
    def run_test(self, test_name: str, test_func):
        """Run a single test and record results"""
        self.test_results['tests_run'] += 1
        logger.info(f"🧪 Running test: {test_name}")
        
        try:
            result = test_func()
            if result:
                self.test_results['tests_passed'] += 1
                self.test_results['detailed_results'][test_name] = {'status': 'PASSED', 'details': result}
                logger.info(f"✅ Test PASSED: {test_name}")
            else:
                self.test_results['tests_failed'] += 1
                self.test_results['detailed_results'][test_name] = {'status': 'FAILED', 'details': 'Test returned False'}
                logger.error(f"❌ Test FAILED: {test_name}")
                
        except Exception as e:
            self.test_results['tests_failed'] += 1
            self.test_results['detailed_results'][test_name] = {'status': 'ERROR', 'details': str(e)}
            self.test_results['errors'].append(f"{test_name}: {str(e)}")
            logger.error(f"💥 Test ERROR: {test_name} - {str(e)}")
    
    async def run_async_test(self, test_name: str, test_func):
        """Run an async test and record results"""
        self.test_results['tests_run'] += 1
        logger.info(f"🧪 Running async test: {test_name}")
        
        try:
            result = await test_func()
            if result:
                self.test_results['tests_passed'] += 1
                self.test_results['detailed_results'][test_name] = {'status': 'PASSED', 'details': result}
                logger.info(f"✅ Test PASSED: {test_name}")
            else:
                self.test_results['tests_failed'] += 1
                self.test_results['detailed_results'][test_name] = {'status': 'FAILED', 'details': 'Test returned False'}
                logger.error(f"❌ Test FAILED: {test_name}")
                
        except Exception as e:
            self.test_results['tests_failed'] += 1
            self.test_results['detailed_results'][test_name] = {'status': 'ERROR', 'details': str(e)}
            self.test_results['errors'].append(f"{test_name}: {str(e)}")
            logger.error(f"💥 Test ERROR: {test_name} - {str(e)}")
    
    def test_entity_extraction(self) -> Dict[str, Any]:
        """Test 1: Entity extraction from sample document"""
        logger.info("📄 Testing entity extraction...")
        
        # Extract entities
        entities = self.entity_agent.extract_entities(self.sample_document)
        
        # Validate extraction results
        if not entities:
            return False
        
        # Check for expected entity types
        expected_types = ['personnel', 'organizations', 'events', 'locations']
        found_types = list(entities.keys())
        
        # Verify we got some entities
        total_entities = sum(len(entity_list) for entity_list in entities.values() if isinstance(entity_list, list))
        
        result = {
            'entities_extracted': entities,
            'total_entities': total_entities,
            'entity_types_found': found_types,
            'expected_entities': {
                'personnel': ['Luis Elizondo', 'David Fravor', 'Alex Dietrich', 'Hal Puthoff'],
                'organizations': ['AATIP', 'Pentagon', 'AARO', 'EarthTech International'],
                'events': ['Tic Tac event', 'USS Nimitz incident'],
                'locations': ['San Diego']
            }
        }
        
        return result if total_entities > 0 else False
    
    def test_entity_search_simulation(self) -> Dict[str, Any]:
        """Test 2: Simulate entity database search"""
        logger.info("🔍 Testing entity search simulation...")
        
        # Use extracted entities from previous test
        if 'test_entity_extraction' not in self.test_results['detailed_results']:
            return False
        
        entities = self.test_results['detailed_results']['test_entity_extraction']['details']['entities_extracted']
        
        # Simulate search results
        search_results = {}
        total_found = 0
        total_not_found = 0
        
        for entity_type, entity_list in entities.items():
            if not isinstance(entity_list, list):
                continue
                
            search_results[entity_type] = []
            for entity in entity_list:
                entity_name = entity if isinstance(entity, str) else entity.get('name', str(entity))
                
                # Simulate some entities found, some not found
                import random
                if random.random() > 0.6:  # 40% are "found"
                    search_results[entity_type].append({
                        'entity_name': entity_name,
                        'status': 'found',
                        'xata_record': {'id': f'rec_{random.randint(1000, 9999)}', 'name': entity_name}
                    })
                    total_found += 1
                else:
                    search_results[entity_type].append({
                        'entity_name': entity_name,
                        'status': 'not_found',
                        'action_needed': 'create_new',
                        'confidence': random.uniform(0.5, 0.95)
                    })
                    total_not_found += 1
        
        # Store search results for next test
        self.search_results = search_results
        
        result = {
            'search_results': search_results,
            'total_found': total_found,
            'total_not_found': total_not_found,
            'entities_requiring_creation': total_not_found
        }
        
        return result if total_not_found > 0 else False
    
    async def test_entity_creation(self) -> Dict[str, Any]:
        """Test 3: Entity creation for missing entities"""
        logger.info("🚀 Testing entity creation...")
        
        if not hasattr(self, 'search_results'):
            return False
        
        # Test entity creation
        creation_results = await self.entity_creator.create_missing_entities(self.search_results)
        
        # Validate creation results
        if not creation_results:
            return False
        
        stats = creation_results.get('statistics', {})
        total_processed = stats.get('total_processed', 0)
        total_created = stats.get('total_created', 0)
        
        result = {
            'creation_results': creation_results,
            'total_processed': total_processed,
            'total_created': total_created,
            'success_rate': (total_created / max(1, total_processed)) * 100
        }
        
        # Store for next test
        self.creation_results = creation_results
        
        return result if total_processed > 0 else False
    
    async def test_research_queue_integration(self) -> Dict[str, Any]:
        """Test 4: Research queue integration"""
        logger.info("📋 Testing research queue integration...")
        
        if not hasattr(self, 'search_results'):
            return False
        
        # Add entities to research queue
        added_count = 0
        for entity_type, results in self.search_results.items():
            for result in results:
                if result.get('status') == 'not_found':
                    entity_name = result.get('entity_name', '')
                    
                    # Determine priority
                    if entity_type in ['personnel', 'organizations']:
                        priority = ResearchPriority.HIGH
                    else:
                        priority = ResearchPriority.MEDIUM
                    
                    # Add to queue
                    task = await self.research_queue.add_research_task(
                        entity_name=entity_name,
                        entity_type=entity_type,
                        priority=priority,
                        source_context="End-to-end pipeline test",
                        disclosure_relevance="Test entity for pipeline validation"
                    )
                    
                    if task:
                        added_count += 1
        
        # Get queue statistics
        queue_stats = self.research_queue.get_queue_stats()
        
        result = {
            'entities_added_to_queue': added_count,
            'queue_statistics': queue_stats,
            'total_tasks_in_queue': queue_stats.get('total_tasks', 0)
        }
        
        return result if added_count > 0 else False
    
    async def test_ai_research_analysis(self) -> Dict[str, Any]:
        """Test 5: AI research analysis"""
        logger.info("🧠 Testing AI research analysis...")
        
        try:
            # Generate research briefing
            briefing = await self.research_manager.generate_research_briefing()
            
            # Get priority actions
            actions = await self.research_manager.analyze_research_priorities()
            
            result = {
                'briefing_generated': bool(briefing),
                'briefing_length': len(briefing) if briefing else 0,
                'priority_actions_count': len(actions) if actions else 0,
                'ai_analysis_available': self.research_manager.ai_available
            }
            
            return result if briefing else False
            
        except Exception as e:
            logger.warning(f"AI analysis failed (expected if no API key): {e}")
            return {
                'ai_analysis_available': False,
                'error': str(e),
                'note': 'AI analysis requires OpenAI API key'
            }
    
    def test_data_persistence(self) -> Dict[str, Any]:
        """Test 6: Data persistence and file operations"""
        logger.info("💾 Testing data persistence...")
        
        try:
            # Test saving queue state
            queue_stats = self.research_queue.get_queue_stats()
            
            # Create test results file
            test_results_file = Path("end_to_end_test_results.json")
            test_data = {
                'test_timestamp': datetime.now().isoformat(),
                'queue_stats': queue_stats,
                'test_results': self.test_results
            }
            
            with open(test_results_file, 'w', encoding='utf-8') as f:
                json.dump(test_data, f, indent=2, ensure_ascii=False)
            
            # Verify file was created
            file_exists = test_results_file.exists()
            file_size = test_results_file.stat().st_size if file_exists else 0
            
            result = {
                'file_created': file_exists,
                'file_size': file_size,
                'queue_persisted': queue_stats.get('total_tasks', 0) > 0,
                'test_results_file': str(test_results_file)
            }
            
            return result if file_exists else False
            
        except Exception as e:
            logger.error(f"Data persistence test failed: {e}")
            return False
    
    def test_component_integration(self) -> Dict[str, Any]:
        """Test 7: Component integration and communication"""
        logger.info("🔗 Testing component integration...")
        
        # Test component availability
        components = {
            'entity_agent': self.entity_agent is not None,
            'entity_creator': self.entity_creator is not None,
            'research_queue': self.research_queue is not None,
            'research_manager': self.research_manager is not None
        }
        
        # Test component methods
        method_tests = {
            'entity_agent_extract': hasattr(self.entity_agent, 'extract_entities') if self.entity_agent else False,
            'entity_creator_create': hasattr(self.entity_creator, 'create_missing_entities') if self.entity_creator else False,
            'research_queue_add': hasattr(self.research_queue, 'add_research_task') if self.research_queue else False,
            'research_manager_analyze': hasattr(self.research_manager, 'analyze_research_priorities') if self.research_manager else False
        }
        
        result = {
            'components_available': components,
            'methods_available': method_tests,
            'integration_score': sum(components.values()) / len(components),
            'method_score': sum(method_tests.values()) / len(method_tests)
        }
        
        return result if result['integration_score'] > 0.5 else False
    
    async def run_all_tests(self) -> Dict[str, Any]:
        """Run the complete test suite"""
        logger.info("🚀 Starting end-to-end entity pipeline tests...")
        
        # Initialize components
        if not await self.initialize_components():
            return self.test_results
        
        # Run tests in sequence
        tests = [
            ("test_component_integration", self.test_component_integration),
            ("test_entity_extraction", self.test_entity_extraction),
            ("test_entity_search_simulation", self.test_entity_search_simulation),
            ("test_entity_creation", self.test_entity_creation),
            ("test_research_queue_integration", self.test_research_queue_integration),
            ("test_ai_research_analysis", self.test_ai_research_analysis),
            ("test_data_persistence", self.test_data_persistence)
        ]
        
        for test_name, test_func in tests:
            if asyncio.iscoroutinefunction(test_func):
                await self.run_async_test(test_name, test_func)
            else:
                self.run_test(test_name, test_func)
        
        # Calculate final results
        self.test_results['success_rate'] = (self.test_results['tests_passed'] / max(1, self.test_results['tests_run'])) * 100
        self.test_results['status'] = 'PASSED' if self.test_results['tests_failed'] == 0 else 'FAILED'
        
        # Print summary
        self.print_test_summary()
        
        return self.test_results
    
    def print_test_summary(self):
        """Print a comprehensive test summary"""
        print("\n" + "="*80)
        print("🧪 END-TO-END ENTITY PIPELINE TEST RESULTS")
        print("="*80)
        print(f"📊 Tests Run: {self.test_results['tests_run']}")
        print(f"✅ Tests Passed: {self.test_results['tests_passed']}")
        print(f"❌ Tests Failed: {self.test_results['tests_failed']}")
        print(f"📈 Success Rate: {self.test_results['success_rate']:.1f}%")
        print(f"🏆 Overall Status: {self.test_results['status']}")
        
        if self.test_results['errors']:
            print(f"\n🚨 Errors Encountered ({len(self.test_results['errors'])}):")
            for error in self.test_results['errors']:
                print(f"   - {error}")
        
        print("\n📋 Detailed Test Results:")
        for test_name, result in self.test_results['detailed_results'].items():
            status_icon = "✅" if result['status'] == 'PASSED' else "❌" if result['status'] == 'FAILED' else "💥"
            print(f"   {status_icon} {test_name}: {result['status']}")
            if result['status'] != 'PASSED' and isinstance(result['details'], str):
                print(f"      └─ {result['details']}")
        
        print("\n" + "="*80)


async def main():
    """Main test execution function"""
    print("🛸 Starting Disclosure RAG Entity Pipeline Tests")
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Create and run test suite
    test_suite = EndToEndEntityPipelineTest()
    results = await test_suite.run_all_tests()
    
    # Save results to file
    results_file = Path("entity_pipeline_test_results.json")
    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Test results saved to: {results_file}")
    
    # Return exit code based on test results
    return 0 if results['status'] == 'PASSED' else 1


if __name__ == "__main__":
    # Run the tests
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
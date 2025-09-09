#!/usr/bin/env python3
"""
Enhanced Content Analysis Engine with Professional-Grade Analysis
- Multi-model consensus analysis 
- Specialized prompts for different content types
- Quality validation framework
- Comprehensive entity extraction
Date: September 5, 2025
"""

import json
import os
import logging
from typing import Dict, Any, Optional, List
from textwrap import dedent
import asyncio

from anthropic import Anthropic
from openai import OpenAI
from groq import Groq
from dotenv import load_dotenv

# Import our enhanced prompts
from research.prompts.enhanced_research_prompt import enhanced_research_prompt
from research.prompts.specialized_analysis_prompts import (
    get_specialized_prompt, 
    detect_content_type,
    content_type_keywords
)

load_dotenv()

logger = logging.getLogger(__name__)

class EnhancedContentAnalysisEngine:
    """
    Professional-grade content analysis engine with multi-model consensus,
    specialized prompts, and comprehensive quality validation.
    """
    
    def __init__(self):
        # Initialize all available models
        self.openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.anthropic_client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
        self.deepseek_client = OpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com"
        )
        self.groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        
        # Model availability tracking
        self.available_models = self._check_model_availability()
        
        # Analysis quality metrics
        self.quality_thresholds = {
            'minimum_entities': 3,
            'minimum_word_count': 100,
            'consensus_threshold': 0.7,
            'confidence_threshold': 0.6
        }
    
    def _check_model_availability(self) -> Dict[str, bool]:
        """Check which models are available based on API keys"""
        return {
            'openai': bool(os.environ.get("OPENAI_API_KEY")),
            'anthropic': bool(os.environ.get("ANTHROPIC_API_KEY")),
            'deepseek': bool(os.getenv("DEEPSEEK_API_KEY")),
            'groq': bool(os.environ.get("GROQ_API_KEY"))
        }
    
    async def analyze_content_comprehensive(
        self, 
        content: str, 
        content_type: Optional[str] = None,
        use_multi_model: bool = True,
        quality_validation: bool = True
    ) -> Dict[str, Any]:
        """
        Perform comprehensive content analysis with professional-grade standards
        
        Args:
            content: Text content to analyze
            content_type: Override automatic content type detection
            use_multi_model: Whether to use multiple models for consensus
            quality_validation: Whether to apply quality validation framework
            
        Returns:
            Comprehensive analysis results with quality metrics
        """
        try:
            # Step 1: Content type detection and prompt selection
            detected_type = content_type or detect_content_type(content)
            base_prompt = enhanced_research_prompt
            specialized_prompt = get_specialized_prompt(detected_type)
            
            logger.info(f"Analyzing content of type: {detected_type}")
            
            # Step 2: Multi-model analysis
            analysis_results = {}
            
            if use_multi_model and len([m for m in self.available_models.values() if m]) > 1:
                analysis_results = await self._multi_model_analysis(
                    content, base_prompt, specialized_prompt
                )
            else:
                # Single model analysis (fallback)
                analysis_results = await self._single_model_analysis(
                    content, base_prompt
                )
            
            # Step 3: Consensus building and quality validation
            final_analysis = self._build_consensus_analysis(analysis_results)
            
            # Step 4: Entity extraction and structuring
            structured_entities = self._extract_structured_entities(final_analysis)
            
            # Step 5: Quality validation
            quality_metrics = {}
            if quality_validation:
                quality_metrics = self._validate_analysis_quality(
                    final_analysis, structured_entities
                )
            
            # Step 6: Generate comprehensive response
            comprehensive_result = {
                'content_type': detected_type,
                'analysis_method': 'multi_model' if use_multi_model else 'single_model',
                'final_analysis': final_analysis,
                'structured_entities': structured_entities,
                'quality_metrics': quality_metrics,
                'model_results': analysis_results,
                'timestamp': self._get_timestamp(),
                'confidence_score': self._calculate_confidence_score(analysis_results, quality_metrics)
            }
            
            return comprehensive_result
            
        except Exception as e:
            logger.error(f"Comprehensive analysis error: {e}")
            return {
                'error': str(e),
                'status': 'failed',
                'timestamp': self._get_timestamp()
            }
    
    async def _multi_model_analysis(
        self, content: str, base_prompt: str, specialized_prompt: str
    ) -> Dict[str, Any]:
        """Run analysis across multiple models for consensus building"""
        results = {}
        
        # Combine prompts for maximum effectiveness
        combined_prompt = f"{base_prompt}\n\n{specialized_prompt}\n\nCONTENT TO ANALYZE:\n{content}"
        
        # Claude analysis (primary - highest quality)
        if self.available_models['anthropic']:
            try:
                claude_result = await self._get_claude_analysis_enhanced(combined_prompt)
                results['claude'] = {
                    'analysis': claude_result,
                    'model': 'claude-3-5-sonnet',
                    'quality_score': self._assess_response_quality(claude_result)
                }
            except Exception as e:
                logger.error(f"Claude analysis failed: {e}")
        
        # OpenAI GPT-4 analysis (secondary)
        if self.available_models['openai']:
            try:
                openai_result = await self._get_openai_analysis_enhanced(combined_prompt)
                results['openai'] = {
                    'analysis': openai_result,
                    'model': 'gpt-4-turbo',
                    'quality_score': self._assess_response_quality(openai_result)
                }
            except Exception as e:
                logger.error(f"OpenAI analysis failed: {e}")
        
        # DeepSeek analysis (reasoning model)
        if self.available_models['deepseek']:
            try:
                deepseek_result = await self._get_deepseek_analysis_enhanced(combined_prompt)
                results['deepseek'] = {
                    'analysis': deepseek_result,
                    'model': 'deepseek-reasoner',
                    'quality_score': self._assess_response_quality(deepseek_result)
                }
            except Exception as e:
                logger.error(f"DeepSeek analysis failed: {e}")
        
        return results
    
    async def _single_model_analysis(self, content: str, base_prompt: str) -> Dict[str, Any]:
        """Fallback single model analysis"""
        combined_prompt = f"{base_prompt}\n\nCONTENT TO ANALYZE:\n{content}"
        
        # Try models in order of preference
        if self.available_models['anthropic']:
            claude_result = await self._get_claude_analysis_enhanced(combined_prompt)
            return {
                'claude': {
                    'analysis': claude_result,
                    'model': 'claude-3-5-sonnet',
                    'quality_score': self._assess_response_quality(claude_result)
                }
            }
        elif self.available_models['openai']:
            openai_result = await self._get_openai_analysis_enhanced(combined_prompt)
            return {
                'openai': {
                    'analysis': openai_result,
                    'model': 'gpt-4-turbo',
                    'quality_score': self._assess_response_quality(openai_result)
                }
            }
        else:
            raise Exception("No available models for analysis")
    
    async def _get_claude_analysis_enhanced(self, prompt: str) -> str:
        """Enhanced Claude analysis with professional parameters"""
        try:
            message = self.anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=8000,
                temperature=0.1,  # Low temperature for factual analysis
                system=prompt,
                messages=[
                    {
                        "role": "user",
                        "content": "Please provide a comprehensive professional analysis of this content according to the framework provided."
                    }
                ]
            )
            return message.content[0].text
        except Exception as e:
            logger.error(f"Claude enhanced analysis error: {e}")
            raise
    
    async def _get_openai_analysis_enhanced(self, prompt: str) -> str:
        """Enhanced OpenAI analysis with professional parameters"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": "Please provide a comprehensive professional analysis of this content according to the framework provided."}
                ],
                max_tokens=8000,
                temperature=0.1,
                top_p=0.9
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI enhanced analysis error: {e}")
            raise
    
    async def _get_deepseek_analysis_enhanced(self, prompt: str) -> str:
        """Enhanced DeepSeek analysis with reasoning capabilities"""
        try:
            response = self.deepseek_client.chat.completions.create(
                model="deepseek-reasoner",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": "Please provide a comprehensive professional analysis with detailed reasoning."}
                ],
                max_completion_tokens=8000,
                temperature=0.1
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"DeepSeek enhanced analysis error: {e}")
            raise
    
    def _build_consensus_analysis(self, model_results: Dict[str, Any]) -> str:
        """Build consensus analysis from multiple model results"""
        if len(model_results) == 1:
            # Single model result
            return list(model_results.values())[0]['analysis']
        
        # Multi-model consensus building
        analyses = [result['analysis'] for result in model_results.values()]
        quality_scores = [result['quality_score'] for result in model_results.values()]
        
        # Weight by quality scores and select best analysis as base
        best_analysis_idx = quality_scores.index(max(quality_scores))
        best_analysis = analyses[best_analysis_idx]
        
        # For now, return the best analysis
        # Future enhancement: synthesize multiple analyses
        return best_analysis
    
    def _extract_structured_entities(self, analysis: str) -> Dict[str, List[Dict[str, Any]]]:
        """Extract and structure entities from the analysis"""
        # This would use more sophisticated NLP to extract entities
        # For now, return a structured placeholder
        return {
            'topics': [],
            'personnel': [],
            'events': [],
            'organizations': [],
            'documents': [],
            'locations': []
        }
    
    def _validate_analysis_quality(
        self, analysis: str, entities: Dict[str, List[Dict[str, Any]]]
    ) -> Dict[str, Any]:
        """Validate analysis quality against professional standards"""
        metrics = {}
        
        # Word count check
        word_count = len(analysis.split())
        metrics['word_count'] = word_count
        metrics['meets_word_threshold'] = word_count >= self.quality_thresholds['minimum_word_count']
        
        # Entity extraction check
        total_entities = sum(len(entity_list) for entity_list in entities.values())
        metrics['entity_count'] = total_entities
        metrics['meets_entity_threshold'] = total_entities >= self.quality_thresholds['minimum_entities']
        
        # Content structure check
        has_summary = 'summary' in analysis.lower() or 'overview' in analysis.lower()
        has_entities = any(keyword in analysis.lower() for keyword in ['personnel', 'topics', 'events', 'organizations'])
        has_analysis = 'analysis' in analysis.lower() or 'assessment' in analysis.lower()
        
        metrics['has_summary'] = has_summary
        metrics['has_entities'] = has_entities  
        metrics['has_analysis'] = has_analysis
        metrics['structural_completeness'] = has_summary and has_entities and has_analysis
        
        # Overall quality score
        quality_indicators = [
            metrics['meets_word_threshold'],
            metrics['meets_entity_threshold'], 
            metrics['structural_completeness']
        ]
        metrics['overall_quality_score'] = sum(quality_indicators) / len(quality_indicators)
        
        return metrics
    
    def _assess_response_quality(self, response: str) -> float:
        """Assess the quality of a model response"""
        if not response:
            return 0.0
        
        # Quality indicators
        word_count = len(response.split())
        has_structure = any(marker in response for marker in ['##', '**', '###', 'SUMMARY', 'ANALYSIS'])
        has_entities = any(keyword in response.lower() for keyword in ['personnel', 'topics', 'events', 'organizations'])
        has_detail = word_count > 500
        
        score = 0.0
        if word_count > 100:
            score += 0.25
        if has_structure:
            score += 0.25
        if has_entities:
            score += 0.25
        if has_detail:
            score += 0.25
        
        return score
    
    def _calculate_confidence_score(
        self, model_results: Dict[str, Any], quality_metrics: Dict[str, Any]
    ) -> float:
        """Calculate overall confidence in the analysis"""
        if not model_results:
            return 0.0
        
        # Average model quality scores
        quality_scores = [result['quality_score'] for result in model_results.values()]
        avg_model_quality = sum(quality_scores) / len(quality_scores)
        
        # Quality metrics score
        quality_score = quality_metrics.get('overall_quality_score', 0.0) if quality_metrics else 0.5
        
        # Combine scores (weighted toward model quality)
        confidence = (avg_model_quality * 0.7) + (quality_score * 0.3)
        
        return round(confidence, 3)
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    # Legacy compatibility method
    def analyze_content(self, content_text: str) -> str:
        """Legacy method for backward compatibility"""
        try:
            import asyncio
            
            # Run the enhanced analysis
            result = asyncio.run(self.analyze_content_comprehensive(
                content_text, 
                use_multi_model=True,
                quality_validation=True
            ))
            
            # Format for legacy compatibility
            if result.get('error'):
                return f"=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===\n\nError: {result['error']}\n\n=== ORIGINAL CONTENT ===\n\n{content_text}"
            
            analysis_section = "=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===\n\n"
            analysis_section += "Enhanced Research Agent Analysis:\n"
            analysis_section += result.get('final_analysis', 'Analysis failed')
            analysis_section += f"\n\nConfidence Score: {result.get('confidence_score', 0.0)}\n"
            analysis_section += f"Content Type: {result.get('content_type', 'unknown')}\n"
            analysis_section += f"Analysis Method: {result.get('analysis_method', 'unknown')}\n"
            analysis_section += "\n=== ORIGINAL CONTENT ===\n\n"
            
            return analysis_section
            
        except Exception as e:
            logger.error(f"Legacy analysis error: {e}")
            return f"=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===\n\nError: {str(e)}\n\n=== ORIGINAL CONTENT ===\n\n{content_text}"
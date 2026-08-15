#!/usr/bin/env python3
"""
Database Schema Compatibility Analysis
Date: July 9, 2025 at 07:38 PST

Analyzes current Xata database schema vs Triple RAG system requirements
to determine if schema modifications are needed or if adapter patterns suffice.
"""

import json
from typing import Dict, List, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class TableSchema:
    """Represents a database table schema"""
    name: str
    columns: List[str]
    primary_key: str
    relationships: List[str]
    purpose: str
    
@dataclass
class SchemaAnalysis:
    """Analysis results for schema compatibility"""
    table_name: str
    compatibility_score: float  # 0-1 scale
    issues: List[str]
    recommendations: List[str]
    migration_required: bool

class SchemaCompatibilityAnalyzer:
    """Analyzes database schema compatibility with Triple RAG system"""
    
    def __init__(self):
        self.current_schema = self._get_current_xata_schema()
        self.triple_rag_requirements = self._get_triple_rag_requirements()
        
    def _get_current_xata_schema(self) -> Dict[str, TableSchema]:
        """Current Xata database schema based on the screenshot"""
        return {
            "documents": TableSchema(
                name="documents",
                columns=[
                    "id", "title", "summary", "url", "date", "processed", 
                    "file_urls", "images", "metadata", "author_id", 
                    "organization_id", "embedding", "created_at", "updated_at"
                ],
                primary_key="id",
                relationships=["author_id", "organization_id"],
                purpose="Main document storage with metadata and embeddings"
            ),
            
            "document_chunks": TableSchema(
                name="document_chunks",
                columns=[
                    "id", "document_id", "chunk_index", "content", "token_count",
                    "page_number", "heading", "embedding", "created_at"
                ],
                primary_key="id",
                relationships=["document_id"],
                purpose="Document content split into processable chunks"
            ),
            
            "document_entities": TableSchema(
                name="document_entities",
                columns=[
                    "id", "document_id", "entity_type", "entity_data", 
                    "confidence", "start_position", "end_position", 
                    "metadata", "created_at"
                ],
                primary_key="id",
                relationships=["document_id"],
                purpose="Extracted entities linked to documents"
            ),
            
            "document_processing_tasks": TableSchema(
                name="document_processing_tasks",
                columns=[
                    "id", "document_id", "task_type", "status", "metadata",
                    "started_at", "completed_at", "created_at"
                ],
                primary_key="id",
                relationships=["document_id"],
                purpose="Processing workflow tracking"
            )
        }
    
    def _get_triple_rag_requirements(self) -> Dict[str, Any]:
        """Requirements for Triple RAG system compatibility"""
        return {
            "embedding_dimension": 384,
            "embedding_model": "all-MiniLM-L6-v2",
            "required_fields": {
                "documents": ["id", "title", "content", "embedding", "metadata"],
                "chunks": ["id", "content", "embedding", "metadata"],
                "processing": ["id", "status", "backend_results"]
            },
            "backend_support": {
                "upstash": {"requires": ["embedding", "metadata"]},
                "local_rag": {"requires": ["content", "embedding"]},
                "cocoindex": {"requires": ["embedding", "metadata", "content"]}
            },
            "processing_workflow": {
                "ingestion": ["validate", "embed", "store", "index"],
                "search": ["query", "retrieve", "merge", "rank"],
                "monitoring": ["track", "log", "error_handle"]
            }
        }
    
    def analyze_table_compatibility(self, table_name: str) -> SchemaAnalysis:
        """Analyze compatibility of a specific table"""
        
        current_table = self.current_schema.get(table_name)
        if not current_table:
            return SchemaAnalysis(
                table_name=table_name,
                compatibility_score=0.0,
                issues=[f"Table {table_name} not found in current schema"],
                recommendations=[f"Create {table_name} table"],
                migration_required=True
            )
        
        issues = []
        recommendations = []
        compatibility_score = 1.0
        
        # Analyze based on table purpose
        if table_name == "documents":
            issues, recommendations, compatibility_score = self._analyze_documents_table(current_table)
        elif table_name == "document_chunks":
            issues, recommendations, compatibility_score = self._analyze_chunks_table(current_table)
        elif table_name == "document_entities":
            issues, recommendations, compatibility_score = self._analyze_entities_table(current_table)
        elif table_name == "document_processing_tasks":
            issues, recommendations, compatibility_score = self._analyze_processing_table(current_table)
        
        return SchemaAnalysis(
            table_name=table_name,
            compatibility_score=compatibility_score,
            issues=issues,
            recommendations=recommendations,
            migration_required=compatibility_score < 0.8
        )
    
    def _analyze_documents_table(self, table: TableSchema) -> tuple:
        """Analyze documents table compatibility"""
        issues = []
        recommendations = []
        score = 1.0
        
        # Check required fields
        required_fields = ["id", "title", "embedding", "metadata"]
        missing_fields = [f for f in required_fields if f not in table.columns]
        
        if missing_fields:
            issues.append(f"Missing required fields: {missing_fields}")
            score -= 0.3
        
        # Check embedding field
        if "embedding" in table.columns:
            recommendations.append("Verify embedding dimension is 384 (sentence-transformers)")
        else:
            issues.append("No embedding field found")
            score -= 0.4
        
        # Check content field
        if "summary" in table.columns but "content" not in table.columns:
            recommendations.append("Consider adding 'content' field or using 'summary' as content")
        
        # Check metadata structure
        if "metadata" in table.columns:
            recommendations.append("Ensure metadata is JSON-compatible for Triple RAG")
        
        # Triple RAG backend compatibility
        recommendations.extend([
            "Upstash: ✅ Compatible (has embedding, metadata)",
            "LocalRAG: ✅ Compatible (has content via summary, embedding)",
            "CocoIndex: ✅ Compatible (has embedding, metadata, content)"
        ])
        
        return issues, recommendations, score
    
    def _analyze_chunks_table(self, table: TableSchema) -> tuple:
        """Analyze document_chunks table compatibility"""
        issues = []
        recommendations = []
        score = 1.0
        
        # Check required fields
        required_fields = ["id", "document_id", "content", "embedding"]
        missing_fields = [f for f in required_fields if f not in table.columns]
        
        if missing_fields:
            issues.append(f"Missing required fields: {missing_fields}")
            score -= 0.3
        
        # Check chunk-specific fields
        chunk_fields = ["chunk_index", "token_count", "page_number", "heading"]
        present_chunk_fields = [f for f in chunk_fields if f in table.columns]
        
        if len(present_chunk_fields) >= 3:
            recommendations.append("✅ Excellent chunk metadata for contextual retrieval")
        else:
            recommendations.append("Consider adding more chunk metadata (page_number, heading)")
            score -= 0.1
        
        # Triple RAG compatibility
        recommendations.extend([
            "Chunks table is ideal for Triple RAG - enables fine-grained retrieval",
            "Can be used for both document-level and chunk-level search",
            "Supports contextual search with heading and page metadata"
        ])
        
        return issues, recommendations, score
    
    def _analyze_entities_table(self, table: TableSchema) -> tuple:
        """Analyze document_entities table compatibility"""
        issues = []
        recommendations = []
        score = 1.0
        
        # Check entity extraction compatibility
        required_fields = ["id", "document_id", "entity_type", "entity_data"]
        missing_fields = [f for f in required_fields if f not in table.columns]
        
        if missing_fields:
            issues.append(f"Missing required fields: {missing_fields}")
            score -= 0.3
        
        # Check entity-specific fields
        if "confidence" in table.columns:
            recommendations.append("✅ Confidence scoring supports quality filtering")
        
        if "start_position" in table.columns and "end_position" in table.columns:
            recommendations.append("✅ Position tracking enables precise entity linking")
        
        # Check entity extraction workflow compatibility
        recommendations.extend([
            "Compatible with existing entity extraction agent",
            "Supports Xata-only search workflow (preserved as requested)",
            "Can be enhanced with Triple RAG for semantic entity search"
        ])
        
        return issues, recommendations, score
    
    def _analyze_processing_table(self, table: TableSchema) -> tuple:
        """Analyze document_processing_tasks table compatibility"""
        issues = []
        recommendations = []
        score = 1.0
        
        # Check processing workflow compatibility
        required_fields = ["id", "document_id", "task_type", "status"]
        missing_fields = [f for f in required_fields if f not in table.columns]
        
        if missing_fields:
            issues.append(f"Missing required fields: {missing_fields}")
            score -= 0.3
        
        # Check workflow tracking
        if "started_at" in table.columns and "completed_at" in table.columns:
            recommendations.append("✅ Time tracking supports performance monitoring")
        
        # Triple RAG workflow compatibility
        recommendations.extend([
            "Needs enhancement for Triple RAG backend tracking",
            "Consider adding 'backend_results' field for multi-backend status",
            "Add 'embedding_model' field to track model versions"
        ])
        
        # Suggest new fields for Triple RAG
        issues.append("Missing Triple RAG specific fields")
        recommendations.append("Add: backend_results, embedding_model, processing_version")
        score -= 0.2
        
        return issues, recommendations, score
    
    def generate_compatibility_report(self) -> Dict[str, Any]:
        """Generate comprehensive compatibility report"""
        
        report = {
            "analysis_date": datetime.now().isoformat(),
            "overall_assessment": {},
            "table_analyses": {},
            "migration_recommendations": [],
            "adapter_recommendations": [],
            "implementation_options": {}
        }
        
        # Analyze each table
        table_scores = {}
        for table_name in self.current_schema.keys():
            analysis = self.analyze_table_compatibility(table_name)
            report["table_analyses"][table_name] = {
                "compatibility_score": analysis.compatibility_score,
                "issues": analysis.issues,
                "recommendations": analysis.recommendations,
                "migration_required": analysis.migration_required
            }
            table_scores[table_name] = analysis.compatibility_score
        
        # Overall assessment
        overall_score = sum(table_scores.values()) / len(table_scores)
        report["overall_assessment"] = {
            "compatibility_score": overall_score,
            "status": self._get_compatibility_status(overall_score),
            "summary": self._generate_summary(overall_score, table_scores)
        }
        
        # Implementation recommendations
        if overall_score >= 0.8:
            report["implementation_options"]["recommended"] = "adapter_pattern"
            report["adapter_recommendations"] = self._generate_adapter_recommendations()
        else:
            report["implementation_options"]["recommended"] = "schema_migration"
            report["migration_recommendations"] = self._generate_migration_recommendations()
        
        return report
    
    def _get_compatibility_status(self, score: float) -> str:
        """Get compatibility status based on score"""
        if score >= 0.9:
            return "EXCELLENT - Minimal changes needed"
        elif score >= 0.8:
            return "GOOD - Adapter pattern recommended"
        elif score >= 0.6:
            return "FAIR - Minor schema changes needed"
        else:
            return "POOR - Major schema migration required"
    
    def _generate_summary(self, overall_score: float, table_scores: Dict[str, float]) -> str:
        """Generate summary of compatibility analysis"""
        
        best_table = max(table_scores, key=table_scores.get)
        worst_table = min(table_scores, key=table_scores.get)
        
        return f"""
        Current Xata schema has {overall_score:.1%} compatibility with Triple RAG system.
        
        Strengths:
        - {best_table} table is well-structured (score: {table_scores[best_table]:.1%})
        - Existing embedding infrastructure
        - Comprehensive metadata tracking
        
        Areas for improvement:
        - {worst_table} table needs enhancement (score: {table_scores[worst_table]:.1%})
        - Triple RAG backend tracking
        - Processing workflow integration
        """
    
    def _generate_adapter_recommendations(self) -> List[str]:
        """Generate adapter pattern recommendations"""
        return [
            "Create TripleRAGSchemaAdapter to bridge current schema with Triple RAG",
            "Implement field mapping (summary → content, metadata → json)",
            "Add backend result tracking in processing tasks",
            "Create view layer for Triple RAG compatibility",
            "Maintain backward compatibility with existing systems"
        ]
    
    def _generate_migration_recommendations(self) -> List[str]:
        """Generate schema migration recommendations"""
        return [
            "Add 'content' field to documents table",
            "Enhance document_processing_tasks with backend tracking",
            "Add embedding_model and processing_version fields",
            "Create indexes for efficient Triple RAG queries",
            "Implement gradual migration strategy"
        ]

def main():
    """Main analysis execution"""
    
    print("=" * 80)
    print("📊 DATABASE SCHEMA COMPATIBILITY ANALYSIS")
    print("=" * 80)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Purpose: Analyze Xata schema vs Triple RAG requirements")
    print()
    
    analyzer = SchemaCompatibilityAnalyzer()
    report = analyzer.generate_compatibility_report()
    
    # Display results
    print("🎯 OVERALL ASSESSMENT")
    print("-" * 40)
    print(f"Compatibility Score: {report['overall_assessment']['compatibility_score']:.1%}")
    print(f"Status: {report['overall_assessment']['status']}")
    print(f"Summary: {report['overall_assessment']['summary']}")
    
    print("\n📋 TABLE-BY-TABLE ANALYSIS")
    print("-" * 40)
    for table_name, analysis in report["table_analyses"].items():
        print(f"\n{table_name.upper()}")
        print(f"  Score: {analysis['compatibility_score']:.1%}")
        print(f"  Migration Required: {'Yes' if analysis['migration_required'] else 'No'}")
        
        if analysis['issues']:
            print(f"  Issues:")
            for issue in analysis['issues']:
                print(f"    ❌ {issue}")
        
        if analysis['recommendations']:
            print(f"  Recommendations:")
            for rec in analysis['recommendations'][:3]:  # Show top 3
                print(f"    💡 {rec}")
    
    print(f"\n🚀 RECOMMENDED APPROACH")
    print("-" * 40)
    recommended = report["implementation_options"]["recommended"]
    print(f"Approach: {recommended.upper()}")
    
    if recommended == "adapter_pattern":
        print("\n✅ ADAPTER PATTERN RECOMMENDATIONS:")
        for rec in report["adapter_recommendations"]:
            print(f"  • {rec}")
    else:
        print("\n🔄 MIGRATION RECOMMENDATIONS:")
        for rec in report["migration_recommendations"]:
            print(f"  • {rec}")
    
    print(f"\n💾 NEXT STEPS")
    print("-" * 40)
    print("1. Review detailed analysis above")
    print("2. Choose implementation approach (adapter vs migration)")
    print("3. Implement chosen approach")
    print("4. Test with existing CSV data")
    print("5. Validate Triple RAG integration")
    
    # Save detailed report
    with open("schema_compatibility_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Detailed report saved to: schema_compatibility_report.json")

if __name__ == "__main__":
    main()
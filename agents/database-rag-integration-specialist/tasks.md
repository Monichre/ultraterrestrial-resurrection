# Database & RAG Integration Specialist - Task Assignment

**Agent ID:** `database-rag-integration-specialist`
**Owner:** Week 1 Foundation Stabilization
**Priority:** Critical System Function

## Task 4: Fix Database Query Flow - `xataToXYFlow` (2 days)

### Objective
Diagnose and resolve issue preventing `xataToXYFlow` from returning records, ensuring compatibility with new Postgres Wire Enabled Xata instance.

### Initial Diagnosis Required
- [ ] Review `xataToXYFlow` code in `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts`
- [ ] Identify database interaction points and query generation
- [ ] Check application logs for errors/warnings related to `xataToXYFlow`
- [ ] Understand expected vs. actual behavior when clicking entity types

### Collaboration with Agent 1
- [ ] Confirm Agent 1 has completed migration successfully
- [ ] Verify new Postgres Wire Enabled instance is accessible and populated
- [ ] Validate connection strings and credentials are updated correctly
- [ ] Test basic database connectivity from application

### Deep Debugging Steps
- [ ] Step through `xataToXYFlow` logic using debugger
- [ ] Inspect SQL queries being generated and executed
- [ ] Execute queries directly against database using client tool
- [ ] Analyze data transformations and mapping logic
- [ ] Test edge cases: empty results, malformed data, large datasets

### Error Handling & Logging
- [ ] Implement robust error handling within `xataToXYFlow`
- [ ] Add comprehensive logging for operational visibility
- [ ] Create meaningful error messages for debugging

### Testing Requirements
- [ ] Write unit tests for `xataToXYFlow` functionality
- [ ] Create integration tests to prevent regressions
- [ ] Test with various entity types and data scenarios

## Task 5: Verify RAG System Integration (1 day)

### Objective
Ensure all four RAG systems coordinate effectively and provide accurate, performant results.

### RAG System Architecture
**Current 4 RAG Systems:**
1. **Postgres + CocoIndex** - Xata (remote) / Local PostgreSQL (local dev)
2. **OpenAI Vector Storage** - OpenAI's managed vector database
3. **Upstash Vector** - Cloud-based vector search
4. **Hybrid Orchestration** - Intelligent routing between above 3 systems

### System Understanding Required
- [ ] Document data flow for typical RAG query
- [ ] Understand purpose and configuration of each RAG backend
- [ ] Map how Hybrid Orchestration routes and merges results
- [ ] Analyze file: `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py`

### Integration Test Plan
- [ ] Design tests for direct queries to each RAG backend
- [ ] Test Hybrid Orchestration routing logic and result merging
- [ ] Verify data consistency across RAG systems
- [ ] Performance testing for various query types and volumes
- [ ] Test edge cases: no results, ambiguous queries, high load

### Test Execution & Validation
- [ ] Execute comprehensive integration test suite
- [ ] Verify accuracy, completeness, and freshness of results
- [ ] Monitor logs and metrics during testing
- [ ] Identify performance bottlenecks or errors

### Error Handling & Fallback
- [ ] Confirm proper error handling for each RAG system
- [ ] Verify fallback mechanisms in orchestration layer
- [ ] Test system behavior when individual backends fail

### Critical Files to Review
- `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py` - Triple RAG coordination
- `apps/disclosure-rag/lib/storage/local_vector_library.py` - Backup system
- RAG orchestration and routing logic files

### Success Criteria
- [ ] All 4 RAG systems respond correctly to test queries
- [ ] Hybrid Orchestration properly routes and merges results
- [ ] Performance meets sub-2s response time targets
- [ ] Proper error handling and fallback behavior verified
- [ ] No data inconsistencies between RAG backends

### Coordination Points
- **With Agent 1:** Depends on successful database migration completion
- **With Agent 2:** Ensure research-canvas RAG integrations remain functional
- **Critical:** Any RAG issues must be resolved before Week 2 Smart Tour integration

### Documentation Updates
- [ ] Update RAG system configuration documentation
- [ ] Document troubleshooting procedures
- [ ] Create operational runbooks for monitoring RAG health
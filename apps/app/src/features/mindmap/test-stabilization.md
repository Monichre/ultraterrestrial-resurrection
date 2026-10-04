# Stabilization Testing Plan

## Task 1: AI Chat Functionality Testing

### Test Cases to Execute

1. **Basic Chat Flow**
   - Open mindmap bottom menu
   - Type `/chat` to activate chat command
   - Enter a simple message like "Hello, how are you?"
   - Verify: Message appears in chat history, AI responds
   - Check console for any errors

2. **Chat Input State Management**
   - Activate chat mode
   - Type a message but don't send
   - Switch to different command (like `/search`)
   - Return to chat mode
   - Verify: Input state is correctly managed

3. **Form Submission**
   - Type chat message
   - Press Enter (should submit)
   - Type another message
   - Click submit button (should also work)
   - Verify: Both methods work correctly

4. **Error Handling**
   - Activate chat mode
   - Try submitting empty message
   - Try submitting while AI is processing
   - Verify: Appropriate error handling

### Expected Results

- Chat messages submit correctly via Enter key and form submission
- Messages appear in conversation history
- AI responses are displayed properly
- No console errors related to input state management

## Task 2: Add to Mindmap Functionality Testing

### Entity Types to Test

- Events
- Personnel (Key Figures)
- Topics
- Organizations
- Testimonies
- Documents
- Sightings

### Test Process for Each Entity

1. **Direct Entity Addition**
   - Select entity type from model menu
   - Click "Add [Entity]" without input
   - Verify: User input node appears
   - Verify: 3 related entity nodes appear around it
   - Verify: Edges connect user node to entity nodes

2. **Search-Based Addition**
   - Type `/search`
   - Select entity type
   - Enter search term (e.g., "Roswell" for events)
   - Press Enter
   - Verify: Search results appear as nodes
   - Verify: Contextual intelligence filters work

3. **Contextual Intelligence Testing**
   - Add one entity to mindmap (e.g., Roswell event)
   - Add another entity of different type
   - Verify: New entity is contextually related to existing ones
   - Check: `getGraphContext()` function generates appropriate rules

### Expected Results

- All entity types can be added successfully
- `handleLoadingRecords()` creates proper node layouts
- `xataToXYFlow()` converts database records correctly
- Contextual intelligence filters work as documented

## Task 3: Search Functionality Testing

### Test Cases

1. **Command-Based Search**
   - Type `/search`
   - Select model (e.g., "events")
   - Enter search term
   - Press Enter
   - Verify: Search results appear as nodes

2. **Regular Text Search**
   - Type search term without command
   - Select model from dropdown
   - Press Enter
   - Verify: Search executes correctly

3. **Context-Aware Search**
   - Add an entity to mindmap (establish context)
   - Perform another search
   - Verify: Results are contextually filtered
   - Check: `generateContextualSearchRules()` creates appropriate filters

### Expected Results

- Both command and regular search work
- Context-aware search shows related results
- Search results integrate with existing mindmap nodes

## Debugging Steps

### If Chat Doesn't Work

1. Check browser console for errors
2. Verify `/api/disclosure/chat` endpoint is accessible
3. Check `useAssistant` hook configuration
4. Verify input state synchronization
5. Check form submission event handling

### If Add to Mindmap Doesn't Work

1. Check `handleLoadingRecords()` function execution
2. Verify `xataToXYFlow()` response processing
3. Check database connection and query responses
4. Verify node creation and positioning logic

### If Search Doesn't Work

1. Check `runSearch()` function execution
2. Verify `initiateDatabaseTableQuery()` API calls
3. Check search result processing
4. Verify contextual intelligence rule generation

## Success Criteria

✅ All entity types can be added to mindmap without errors
✅ AI chat responds to user queries correctly  
✅ Contextual intelligence filters work as documented
✅ Search functionality works with both commands and regular text
✅ No breaking changes to current functionality
